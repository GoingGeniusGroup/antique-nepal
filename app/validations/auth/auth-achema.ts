import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{10}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const RegisterSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().regex(emailRegex, "Invalid email format").optional(),
    phone: z.string().regex(phoneRegex, "Phone must be 10 digits").optional(),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must be 8+ chars with uppercase, lowercase, number & special character"
      ),
  })
  .refine((data) => data.email || data.phone, {
    message: "Either email or phone is required",
    path: ["email"],
  });

export const LoginSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Email or phone is required")
    .refine((val) => {
      return emailRegex.test(val) || phoneRegex.test(val);
    }, "Must be a valid email or a 10-digit phone number"),
  password: z.string().min(1, "Password is required"),
});
