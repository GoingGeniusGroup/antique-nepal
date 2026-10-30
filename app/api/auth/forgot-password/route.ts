import prisma from "@/lib/prisma";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({
      message: "If that email exists, we sent a reset link.",
    });
  }

  // Generate token
  const token = randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.passwordResetToken.create({
    data: { email, token, expires },
  });

  const resetLink = `${process.env.AUTH_URL}/reset-password?token=${token}`;

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    to: email,
    from: process.env.EMAIL_USER,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link expires in 30 minutes.</p>`,
  });

  return NextResponse.json({
    message: "Password reset email sent if account exists.",
  });
}
