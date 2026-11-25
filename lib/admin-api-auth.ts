import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

type AdminAuthResult =
  | { userId: string; response: null }
  | { userId: null; response: NextResponse };

export async function requireAdminApi(): Promise<AdminAuthResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      userId: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if ((session.user as { role?: string }).role !== "ADMIN") {
    return {
      userId: null,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { userId: session.user.id, response: null };
}
