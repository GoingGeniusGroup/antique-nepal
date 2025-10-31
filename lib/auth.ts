import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { error } from "console";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Facebook,
    // Credentials Login
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { identifier, password } = credentials ?? {};

        if (!identifier || !password) {
          throw new Error("Both fields are required.");
        }

        // Find user by email OR phone
        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: identifier }, { phone: identifier }],
          },
        });

        if (!user || !user.password) throw new Error("Invalid credentials");

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        return user;
      },
    }),
  ],
});
