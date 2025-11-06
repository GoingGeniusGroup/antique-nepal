import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { email } from "zod";

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
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user?.password) {
          return null;
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
    async jwt({ token, user }) {
      const now = Math.floor(Date.now() / 1000);
      const maxAge = 60 * 60;
      // If token is older than 1 hour, force re-login
      if (token.exp && now > token.exp) {
        return {}; // Expired, will trigger logout
      }

      if (user) {
        token.id = user.id;
        token.name = (user as any).name;
        token.role = (user as any).role;
        token.image = user.image;
        token.exp = now + maxAge;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
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
