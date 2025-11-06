"use server";

import prisma from "@/lib/prisma";

export async function verifyEmail(token: string) {
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationExpiry: { gte: new Date() },
    },
  });

  if (!user) return { success: false, message: "Invalid or expired token" };

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: null,
      verificationExpiry: null,
      emailVerified: new Date(),
    },
  });

  return { success: true, message: "Email verified successfully" };
}
