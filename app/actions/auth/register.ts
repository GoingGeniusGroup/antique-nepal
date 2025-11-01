"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/app/validations/auth/auth-achema";
import { ZodError } from "zod";

export async function registerUser(formData: FormData) {
  try {
    const data = RegisterSchema.parse({
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      password: formData.get("password")?.toString() || "",
    });

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          data.email ? { email: data.email } : undefined,
          data.phone ? { phone: data.phone } : undefined,
        ].filter(Boolean) as any[],
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "User already exists with this email or phone",
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        password: hashedPassword,
        ...(data.email ? { email: data.email } : {}),
        ...(data.phone ? { phone: data.phone } : {}),
      } as any,
    });

    return { success: true, message: "User registered successfully", user };
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
