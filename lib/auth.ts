import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { encode as defaultEncode } from "next-auth/jwt";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    // Credentials Login
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Partial<Record<"identifier" | "password", unknown>>,
        request: Request
      ) {
        const identifier = credentials?.identifier as string;
        const password = credentials?.password as string;

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
  callbacks: {
    async jwt({ token, account, user }) {
      // When the user signs in with credentials, mark the token so we create a DB session later
      if (account?.provider === "credentials") {
        (token as any).credentials = true;
      }

      // Persist user fields into the token so they are available in the session callback
      if (user) {
        if ((user as any).phone) (token as any).phone = (user as any).phone;
        if ((user as any).email) (token as any).email = (user as any).email;
        if ((user as any).name) (token as any).name = (user as any).name;
      }

      return token;
    },
    async session({ session, token }) {
      // Copy custom fields from token to session.user
      if (token && session.user) {
        (session.user as any).phone =
          (token as any).phone ?? (session.user as any).phone;
        (session.user as any).name =
          (token as any).name ?? (session.user as any).name;
        (session.user as any).email =
          (token as any).email ?? (session.user as any).email;
      }
      return session;
    },
  },
  jwt: {
    encode: async function (params) {
      // If token was created by credentials provider, create a DB-backed session
      if ((params.token as any)?.credentials) {
        const sessionToken = randomUUID();

        if (!params.token?.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await prisma.session.create({
          data: {
            sessionToken: sessionToken,
            userId: params.token.sub,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        if (!createdSession) throw new Error("Failed to create session");

        return sessionToken;
      }

      return defaultEncode(params as any);
    },
  },
});
