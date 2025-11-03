import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const RegisterSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().regex(emailRegex, "Invalid email format"),
    phone: z.string().regex(phoneRegex, "Phone must be 10 digits").optional(),
    prefix: z.string().min(1, "Country code is required"), // <-- add this
    password: z
      .string()
      .min(1, "Password is required")
      .regex(
        passwordRegex,
        "Password must be 8+ chars with uppercase, lowercase, number & special character"
      ),
  })

  .refine((data) => data.email, {
    message: "Email is required",
    path: ["email"],
  });

export const LoginSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

export const phoneValidation = z.object({
  prefix: z.string().min(1, "Prefix is required"),
  phone: z
    .string()
    .min(5, "Phone number is too short")
    .max(15, "Phone number is too long"),
});

export const codeValidation = z.object({
  code: z.string().length(6, "Verification code must be 6 characters"),
});

export const passwordValidation = z.object({
  password: z
    .string()
    .regex(
      passwordRegex,
      "Password must be 8+ chars with uppercase, lowercase, number & special character"
    ),
});
