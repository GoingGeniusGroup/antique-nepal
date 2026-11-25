import React from "react";
import nodemailer from "nodemailer";
import { renderToBuffer } from "@react-pdf/renderer";
import type { DocumentProps } from "@react-pdf/renderer";
import { resend } from "@/lib/resend";
import OrderDetailPDF from "@/app/(auth)/profile/[orderid]/components/OrderDetailPDF";

export async function sendVerificationEmail(email: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: "Gmail", // or any email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXTAUTH_URL}/action/auth/email-verification?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email. This link expires in 24 hours.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

type OrderDetailPDFProps = React.ComponentProps<typeof OrderDetailPDF>["order"];

export interface SendOrderReceiptParams {
  order: OrderDetailPDFProps;
  customerEmail: string;
  customerName?: string | null;
}

export async function sendOrderReceiptEmail({
  order,
  customerEmail,
  customerName,
}: SendOrderReceiptParams) {
  const pdfDocument = React.createElement(OrderDetailPDF, { order });
  const pdfBuffer = await renderToBuffer(
    pdfDocument as React.ReactElement<DocumentProps>
  );

  const fromAddress =
    process.env.EMAIL_FROM || "Alena Collection <onboarding@resend.dev>";
  const recipientName =
    customerName || order.shippingAddress?.fullName || "Valued Customer";
  const formattedTotal = Number(order.total).toLocaleString();

  const { data, error } = await resend.emails.send({
    from: fromAddress,
    to: [customerEmail],
    subject: `Order Receipt #${order.orderNumber} — Alena Collection`,
    html: `
      <div style="font-family: Arial, Helvetica, sans-serif; color: #18181b; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
        <p style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; color: #c6933a; margin: 0 0 8px;">
          ALENA COLLECTION
        </p>
        <h2 style="margin: 0 0 12px; font-size: 22px; color: #18181b;">
          Thank you for your order, ${recipientName}!
        </h2>
        <p style="margin: 0 0 16px; line-height: 1.6; color: #3f3f46;">
          Your payment of <strong>NPR ${formattedTotal}</strong> for order
          <strong>#${order.orderNumber}</strong> has been confirmed. Your official PDF
          receipt is attached to this email.
        </p>
        <p style="margin: 24px 0 0; font-size: 12px; color: #71717a;">
          If you have any questions about your order, simply reply to this email.
        </p>
      </div>
    `,
    attachments: [
      {
        filename: `order-${order.orderNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (error) {
    console.error("Resend failed to send order receipt", {
      orderNumber: order.orderNumber,
      error,
    });
    throw new Error(`Resend delivery failed: ${error.message}`);
  }

  console.info("Order receipt email sent", {
    orderNumber: order.orderNumber,
    emailId: data?.id,
  });

  return { success: true, emailId: data?.id };
}