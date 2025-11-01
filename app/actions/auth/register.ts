"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import {
  phoneValidation,
  passwordValidation,
} from "@/app/validations/auth/auth-achema";
import { z } from "zod";

// Use .extend instead of merge (merge is deprecated)
const registrationSchema = phoneValidation
  .extend({
    password: passwordValidation.shape.password,
    rePassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"], // error points to rePassword field
  });

interface RegisterData {
  prefix: string;
  phone: string;
  password: string;
}

export async function registerUser(data: RegisterData) {
  const parseResult = registrationSchema.safeParse(data);

  if (!parseResult.success) {
    const errors = parseResult.error.issues.map((i) => i.message).join(", ");
    return { success: false, error: errors };
  }

  const { prefix, phone, password } = parseResult.data;
  const phoneNumber = prefix + phone;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { phone: phoneNumber },
    });

    if (existingUser) return { success: false, error: "User already exists" };

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { phone: phoneNumber, password: hashed },
    });

    return { success: true, user };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message || "Registration failed" };
  }
}
