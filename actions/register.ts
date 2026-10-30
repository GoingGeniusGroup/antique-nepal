"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/app/validations/auth/auth-achema";
import { ZodError } from "zod";
import { sendVerificationEmail } from "@/lib/mailer";

export async function registerUser(formData: FormData) {
  try {
    const data = RegisterSchema.parse({
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString(),
      phone: formData.get("phone")?.toString() || "",
      prefix: formData.get("countryCode")?.toString() || "",
      password: formData.get("password")?.toString() || "",
    });

    const fullName = `${data.firstName} ${data.lastName}`;
    const fullPhone = data.phone ? `${data.prefix}${data.phone}` : undefined;

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return {
        success: false,
        message: "User already exists with this email or phone",
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationExpiry = new Date();
    verificationExpiry.setHours(verificationExpiry.getHours() + 24); // expires in 24 hours

    console.log("verificationToken:", verificationToken);
    console.log("verificationExpiry:", verificationExpiry);

    const user = await prisma.user.create({
      data: {
        name: fullName,
        email: data.email,
        password: hashedPassword,
        phone: fullPhone,
        isActive: false,
        verificationToken: verificationToken,
        verificationExpiry: verificationExpiry,
      },
    });

    console.log("Created user:", user);

    // Send verification email
    await sendVerificationEmail(data.email, verificationToken);

    return {
      success: true,
      message: "User registered. Please verify your email.",
      userId: user.id,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((err) => {
        if (err.path?.[0]) fieldErrors[err.path[0].toString()] = err.message;
      });
      return { success: false, errors: fieldErrors };
    }
    console.error(error);
    return { success: false, message: "Something went wrong." };
  }
}
