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
    strategy: "database",
    maxAge: 60 * 60, // 1 hour
    updateAge: 60 * 5, // Update session every 5 minutes
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
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
          where: { email },
        });

        if (!user?.password) {
          return null;
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          return null;
        }

        if (!user.isActive) {
          throw new Error("Account is deactivated");
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
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
        (session.user as any).role = (user as any).role;
        (session.user as any).phone = (user as any).phone;
        (session.user as any).isActive = (user as any).isActive;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log user sign-in activity
      if (user.id) {
        await prisma.activityLog
          .create({
            data: {
              userId: user.id,
              action: isNewUser ? "USER_REGISTERED" : "USER_LOGIN",
              entityType: "User",
              entityId: user.id,
              changes: {
                provider: account?.provider || "credentials",
                timestamp: new Date().toISOString(),
                isNewUser,
              },
              // You can add these if you have access to request headers
              // ipAddress: request?.headers?.get("x-forwarded-for") || null,
              // userAgent: request?.headers?.get("user-agent") || null,
            },
          })
          .catch((err) => console.error("Failed to log activity:", err));
      }
    },
  },
  pages: {
    signIn: "/login",
  },
});
