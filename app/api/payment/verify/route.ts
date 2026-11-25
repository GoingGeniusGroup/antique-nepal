import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import prisma from "@/lib/prisma";
import { sendOrderReceiptEmail } from "@/lib/mailer";

type EsewaCallback = {
  transaction_uuid: string;
  total_amount: string | number;
  product_code: string;
  status: string;
  transaction_code?: string | null;
  dev_mode?: string;
  signed_field_names?: string;
  signature?: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isEsewaCallback(value: unknown): value is EsewaCallback {
  return (
    isRecord(value) &&
    typeof value.transaction_uuid === "string" &&
    (typeof value.total_amount === "string" ||
      typeof value.total_amount === "number") &&
    typeof value.product_code === "string" &&
    typeof value.status === "string" &&
    (value.transaction_code === undefined ||
      value.transaction_code === null ||
      typeof value.transaction_code === "string") &&
    (value.dev_mode === undefined || typeof value.dev_mode === "string") &&
    (value.signed_field_names === undefined ||
      typeof value.signed_field_names === "string") &&
    (value.signature === undefined || typeof value.signature === "string")
  );
}

function toMinorUnits(value: string | number): number | null {
  const match = /^(0|[1-9]\d*)(?:\.(\d{1,2}))?$/.exec(String(value).trim());
  if (!match) return null;

  const whole = Number(match[1]);
  const fraction = Number((match[2] ?? "").padEnd(2, "0") || "0");
  const minorUnits = whole * 100 + fraction;
  return Number.isSafeInteger(minorUnits) ? minorUnits : null;
}

function isJsonObject(
  value: Prisma.JsonValue | null | undefined
): value is Prisma.JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getEsewaTransactionUuid(metadata: Prisma.JsonValue | null) {
  if (!isJsonObject(metadata)) {
    return null;
  }

  const esewaMetadata = metadata.esewa;
  if (!isJsonObject(esewaMetadata)) {
    return null;
  }

  const transactionUuid = esewaMetadata.transactionUuid;
  return typeof transactionUuid === "string" ? transactionUuid : null;
}

function hasValidDevSignature(
  callback: EsewaCallback,
  secretKey: string | undefined
) {
  if (
    !secretKey ||
    callback.dev_mode !== "true" ||
    callback.transaction_code !== "DEV-SIMULATED" ||
    !callback.signature ||
    !callback.signed_field_names
  ) {
    return false;
  }

  const signedFieldNames =
    "transaction_code,status,total_amount,transaction_uuid,product_code,dev_mode";
  if (callback.signed_field_names !== signedFieldNames) {
    return false;
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(callback.signature)) {
    return false;
  }

  const signatureString = signedFieldNames
    .split(",")
    .map((field) => {
      const value = callback[field as keyof EsewaCallback];
      return value === undefined || value === null ? null : `${field}=${value}`;
    });
  if (signatureString.some((part) => part === null)) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureString.join(","))
    .digest();
  let providedSignature: Buffer;
  try {
    providedSignature = Buffer.from(callback.signature, "base64");
  } catch {
    return false;
  }

  return (
    providedSignature.length === expectedSignature.length &&
    crypto.timingSafeEqual(providedSignature, expectedSignature)
  );
}

function redirectToCheckout(request: NextRequest) {
  const baseUrl =
    process.env.NODE_ENV === "development"
      ? request.nextUrl.origin
      : process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Payment redirect URL is not configured" },
      { status: 500 }
    );
  }

  return NextResponse.redirect(
    new URL("/checkout?status=failed", baseUrl)
  );
}

export async function GET(request: NextRequest) {
  try {
    const encodedData = request.nextUrl.searchParams.get("data");
    if (!encodedData || encodedData.length > 8192) {
      return redirectToCheckout(request);
    }

    let callback: unknown;
    try {
      callback = JSON.parse(
        Buffer.from(encodedData, "base64").toString("utf8")
      );
    } catch {
      return redirectToCheckout(request);
    }

    if (!isEsewaCallback(callback) || callback.status !== "COMPLETE") {
      return redirectToCheckout(request);
    }

    const hasDevFlag = request.nextUrl.searchParams.get("dev") === "1";
    if (hasDevFlag && process.env.NODE_ENV !== "development") {
      return redirectToCheckout(request);
    }

    const isDevSimulation =
      process.env.NODE_ENV === "development" && hasDevFlag;
    if (isDevSimulation) {
      if (!hasValidDevSignature(callback, process.env.ESEWA_SECRET_KEY)) {
        return redirectToCheckout(request);
      }
    }

    const merchantCode = process.env.ESEWA_MERCHANT_CODE;
    const statusUrl = process.env.ESEWA_STATUS_URL;
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? request.nextUrl.origin
        : process.env.NEXT_PUBLIC_BASE_URL;
    if (!merchantCode || !baseUrl || callback.product_code !== merchantCode) {
      return redirectToCheckout(request);
    }
    if (!isDevSimulation && !statusUrl) {
      return redirectToCheckout(request);
    }

    const separatorIndex = callback.transaction_uuid.lastIndexOf("-");
    if (separatorIndex <= 0) {
      return redirectToCheckout(request);
    }

    const orderId = callback.transaction_uuid.slice(0, separatorIndex);
    const timestamp = callback.transaction_uuid.slice(separatorIndex + 1);
    if (!/^\d+$/.test(timestamp)) {
      return redirectToCheckout(request);
    }

    const amountFromCallback = toMinorUnits(callback.total_amount);
    if (amountFromCallback === null) {
      return redirectToCheckout(request);
    }

    if (!isDevSimulation) {
      const verificationUrl = new URL(statusUrl!);
      verificationUrl.searchParams.set("product_code", callback.product_code);
      verificationUrl.searchParams.set(
        "total_amount",
        String(callback.total_amount)
      );
      verificationUrl.searchParams.set(
        "transaction_uuid",
        callback.transaction_uuid
      );

      const verificationResponse = await fetch(verificationUrl, {
        method: "GET",
        cache: "no-store",
      });
      if (!verificationResponse.ok) {
        return redirectToCheckout(request);
      }

      const verificationData: unknown = await verificationResponse.json();
      if (
        !isRecord(verificationData) ||
        verificationData.status !== "COMPLETE"
      ) {
        return redirectToCheckout(request);
      }
    }

    const confirmation = await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { payments: true },
      });

      if (!order || order.currency !== "NPR") {
        return false;
      }

      const amountFromOrder = toMinorUnits(order.total.toString());
      if (amountFromOrder === null || amountFromOrder !== amountFromCallback) {
        return false;
      }

      const payment = order.payments.find(
        (candidate) => candidate.paymentMethod === "eSewa"
      );
      if (!payment || toMinorUnits(payment.amount.toString()) !== amountFromOrder) {
        return false;
      }

      if (order.paymentStatus === "PAID" && payment.status === "PAID") {
        const isSameTransaction =
          getEsewaTransactionUuid(payment.metadata) ===
          callback.transaction_uuid;
        return isSameTransaction ? "already-paid" : false;
      }

      if (
        order.paymentStatus !== "PENDING" ||
        order.status !== "PENDING" ||
        payment.status !== "PENDING"
      ) {
        return false;
      }

      const existingMetadata = isJsonObject(payment.metadata)
        ? payment.metadata
        : {};
      const metadata: Prisma.InputJsonObject = {
        ...existingMetadata,
        esewa: {
          transactionUuid: callback.transaction_uuid,
          transactionCode: callback.transaction_code ?? null,
          productCode: callback.product_code,
          simulated: isDevSimulation,
        },
      };

      const updatedPayment = await tx.payment.updateMany({
        where: { id: payment.id, status: "PENDING" },
        data: { status: "PAID", metadata },
      });
      const updatedOrder = await tx.order.updateMany({
        where: {
          id: order.id,
          status: "PENDING",
          paymentStatus: "PENDING",
        },
        data: { status: "CONFIRMED", paymentStatus: "PAID" },
      });

      if (updatedPayment.count !== 1 || updatedOrder.count !== 1) {
        throw new Error("Order or payment status changed during verification");
      }

      return "newly-confirmed";
    });

    if (!confirmation) {
      return redirectToCheckout(request);
    }

    if (confirmation === "newly-confirmed") {
      try {
        const fullOrder = await prisma.order.findUnique({
          where: { id: orderId },
          include: {
            user: true,
            shippingAddress: true,
            billingAddress: true,
            items: {
              include: {
                product: {
                  include: {
                    images: {
                      where: { isPrimary: true },
                    },
                  },
                },
                productVariant: {
                  select: {
                    color: true,
                    size: true,
                  },
                },
              },
            },
          },
        });

        const customerEmail = fullOrder?.user?.email;
        if (fullOrder && customerEmail) {
          const serializedOrder = {
            ...fullOrder,
            subtotal: fullOrder.subtotal.toString(),
            shippingCost: fullOrder.shippingCost.toString(),
            tax: fullOrder.tax.toString(),
            total: fullOrder.total.toString(),
            createdAt: fullOrder.createdAt.toISOString(),
            updatedAt: fullOrder.updatedAt.toISOString(),
            items: fullOrder.items.map((item) => ({
              ...item,
              price: item.price.toString(),
              total: item.total.toString(),
              createdAt: item.createdAt.toISOString(),
            })),
          };

          await sendOrderReceiptEmail({
            order: serializedOrder,
            customerEmail,
            customerName:
              fullOrder.shippingAddress?.fullName || fullOrder.user?.name,
          });
        } else {
          console.error(
            "Unable to send order receipt: order or customer email is missing",
            { orderId }
          );
        }
      } catch (emailError) {
        console.error(
          `Order ${orderId} is confirmed, but its receipt email failed; payment response remains successful.`,
          emailError
        );
      }
    }

    const successUrl = new URL("/checkout", baseUrl);
    successUrl.searchParams.set("status", "success");
    successUrl.searchParams.set("orderId", orderId);
    return NextResponse.redirect(successUrl);
  } catch (error) {
    console.error("eSewa payment verification failed:", error);
    return redirectToCheckout(request);
  }
}