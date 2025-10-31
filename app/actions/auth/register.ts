"use server";

import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { RegisterSchema } from "@/app/validations/auth/auth-achema";

export async function registerUser(formData: FormData) {
  try {
    const data: any = RegisterSchema.parse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      password: formData.get("password"),
    });

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email || undefined },
          { phone: data.phone || undefined },
        ],
      },
    });

    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: { ...data, password: hashedPassword },
    });

    return { success: true, message: "User registered successfully", user };
  } catch (error) {
    if (error instanceof Error && "errors" in error) {
      // Zod validation error
      // @ts-ignore
      return { success: false, message: error.errors[0].message };
    }

    console.error(error);
    return { success: false, message: "Something went wrong." };
  }
}
