import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  const record = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!record || record.expires < new Date()) {
    return Response.json(
      { error: "Token invalid or expired" },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: record.email },
    data: { password: hashed },
  });

  // delete token after use
  await prisma.passwordResetToken.delete({ where: { token } });

  return NextResponse.json({ message: "Password updated successfully" });
}
