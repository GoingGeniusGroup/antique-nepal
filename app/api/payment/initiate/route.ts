import { NextResponse } from "next/server";
import crypto from "node:crypto";

export async function POST(req: Request) {
  try {
    const { orderId, totalAmount } = await req.json();

    if (!orderId || !totalAmount) {
      return NextResponse.json(
        { error: "Missing orderId or totalAmount" },
        { status: 400 }
      );
    }

    const productCode = process.env.ESEWA_MERCHANT_CODE!;
    const secretKey = process.env.ESEWA_SECRET_KEY!;
    const formUrl = process.env.ESEWA_FORM_URL!;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

    // Unique transaction UUID per attempt
    const transactionUuid = `${orderId}-${Date.now()}`;

    // Format cleanly as string (eSewa signs exact string representations)
    const formattedTotal = Number(totalAmount).toString();

    // eSewa v2 requires this exact field order for the HMAC signature
    const signatureString = `total_amount=${formattedTotal},transaction_uuid=${transactionUuid},product_code=${productCode}`;
    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(signatureString)
      .digest("base64");

    return NextResponse.json({
      formUrl,
      payload: {
        amount: formattedTotal,
        tax_amount: "0",
        product_service_charge: "0",
        product_delivery_charge: "0",
        total_amount: formattedTotal,
        transaction_uuid: transactionUuid,
        product_code: productCode,
        success_url: `${baseUrl}/api/payment/verify`,
        failure_url: `${baseUrl}/checkout?status=failed`,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature,
      },
    });
  } catch (error) {
    console.error("eSewa initiation error:", error);
    return NextResponse.json(
      { error: "Failed to initiate eSewa payment" },
      { status: 500 }
    );
  }
}