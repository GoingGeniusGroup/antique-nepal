import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("orderId" in body) ||
    typeof body.orderId !== "string" ||
    body.orderId.length === 0
  ) {
    return NextResponse.json({ error: "Invalid orderId" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: { id: body.orderId, userId },
    include: { payments: true },
  });
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const payment = order.payments.find(
    (candidate) =>
      candidate.paymentMethod === "eSewa" && candidate.status === "PENDING"
  );
  if (
    order.currency !== "NPR" ||
    order.status !== "PENDING" ||
    order.paymentStatus !== "PENDING" ||
    !payment ||
    payment.amount.toString() !== order.total.toString()
  ) {
    return NextResponse.json(
      { error: "Order is not awaiting eSewa payment" },
      { status: 409 }
    );
  }

  const secretKey = process.env.ESEWA_SECRET_KEY;
  const productCode = process.env.ESEWA_MERCHANT_CODE;
  if (!secretKey || !productCode) {
    return NextResponse.json(
      { error: "eSewa simulation is not configured" },
      { status: 500 }
    );
  }

  const callback = {
    transaction_code: "DEV-SIMULATED",
    status: "COMPLETE",
    total_amount: order.total.toString(),
    transaction_uuid: `${order.id}-${Date.now()}`,
    product_code: productCode,
    dev_mode: "true",
    signed_field_names:
      "transaction_code,status,total_amount,transaction_uuid,product_code,dev_mode",
  };
  const signatureString = callback.signed_field_names
    .split(",")
    .map((field) => `${field}=${callback[field as keyof typeof callback]}`)
    .join(",");
  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(signatureString)
    .digest("base64");
  const encodedData = Buffer.from(
    JSON.stringify({ ...callback, signature }),
    "utf8"
  ).toString("base64");

  const baseUrl = new URL(request.url).origin;
  const redirectUrl = new URL("/api/payment/verify", baseUrl);
  redirectUrl.searchParams.set("dev", "1");
  redirectUrl.searchParams.set("data", encodedData);

  return NextResponse.json({ redirectUrl: redirectUrl.toString() });
}
