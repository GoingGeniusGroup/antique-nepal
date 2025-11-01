"use server";

import twilio from "twilio";
import {
  phoneValidation,
  codeValidation,
} from "@/app/validations/auth/auth-achema";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

interface VerifyCodeData {
  prefix: string;
  phone: string;
  code: string;
}

export async function verifyCode({ prefix, phone, code }: VerifyCodeData) {
  // Validate phone
  const phoneParse = phoneValidation.safeParse({ prefix, phone });
  if (!phoneParse.success) {
    const errors = phoneParse.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errors };
  }

  // Validate code (6 characters)
  const codeParse = codeValidation.safeParse({ code });
  if (!codeParse.success) {
    const errors = codeParse.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errors };
  }

  const phoneNumber = prefix + phone;

  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verification.status === "approved") {
      return { success: true, message: "Verification successful" };
    }

    return { success: false, error: "Invalid verification code" };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Verification failed" };
  }
}
