import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60, // same — optional but recommended
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: "CUSTOMER",
          isActive: true,
        };
      },
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture.data.url,
          role: "CUSTOMER",
          isActive: true,
        };
      },
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          throw new Error("Both email and password are required");
        }

        //  Use `findUnique` safely
        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user || !user.password) {
          return null;
        }

        if (!user.isActive) {
          throw new Error(
            "Your account has been deactivated. Please contact support for assistance."
          );
        }

        //  Check for email verification - ONLY for CUSTOMER role, not ADMIN
        if (user.role === "CUSTOMER" && !user.emailVerified) {
          throw new Error("EmailNotVerified"); // custom error
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return true; // Should not happen, but as a safeguard.
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (dbUser && !dbUser.isActive) {
        return false;
      }

      return true;
    },
    async jwt({ token, user, trigger }) {
      const now = Math.floor(Date.now() / 1000);
      const maxAge = 60 * 60; // 1 hour

      // Initial sign-in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.role = (user as any).role;
        token.image = user.image;
        token.exp = now + maxAge;
        token.isActive = (user as any).isActive;
        return token;
      }

      // If the token is expired, invalidate it.
      if (token.exp && now > (token.exp as number)) {
        return null;
      }

      // On subsequent requests, fetch user data to keep the token fresh
      // This also handles the case where user data might have changed in the DB
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
        });

        // If user not found or is inactive, invalidate the session.
        if (!dbUser || !dbUser.isActive) {
          return null;
        }

        // Update token with fresh data from the database
        token.name = dbUser.name;
        token.role = dbUser.role;
        token.image = dbUser.image;
        token.isActive = dbUser.isActive;
        // Extend the session expiration on activity
        token.exp = now + maxAge;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as any).name = token.name;
        (session.user as any).role = token.role;
        session.user.image = token.image as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
