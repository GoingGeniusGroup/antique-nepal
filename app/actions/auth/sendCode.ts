"use server";

import twilio from "twilio";
import { phoneValidation } from "@/app/validations/auth/auth-achema";

const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH_TOKEN!);

interface SendCodeData {
  prefix: string;
  phone: string;
}

export async function sendVerificationCode(data: SendCodeData) {
  // Validate using Zod
  const parseResult = phoneValidation.safeParse(data);

  if (!parseResult.success) {
    // Use parseResult.error.issues to get error messages
    const errorMessages = parseResult.error.issues
      .map((issue) => issue.message)
      .join(", ");
    return { success: false, error: errorMessages };
  }

  const { prefix, phone } = parseResult.data;
  const phoneNumber = prefix + phone;

  try {
    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    return { success: true, message: "Code sent" };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Failed to send code" };
  }
}
