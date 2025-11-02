import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type SettingsPayload = {
  general?: { siteName?: string; logo?: string };
  hero?: { title?: string; subtitle?: string };
  banner?: { text?: string };
  footer?: { text?: string };
};

const KEYS = ["general", "hero", "banner", "footer"] as const;

export async function GET() {
  const rows = await prisma.siteSetting.findMany({ where: { key: { in: KEYS as unknown as string[] } } });
  const data: Record<string, any> = {};
  for (const r of rows) data[r.key] = r.value;
  return NextResponse.json({
    general: data.general || {},
    hero: data.hero || {},
    banner: data.banner || {},
    footer: data.footer || {},
  });
}

export async function PATCH(req: Request) {
  const body = (await req.json()) as SettingsPayload;
  const ops = [] as any[];
  for (const key of KEYS) {
    if ((body as any)[key]) {
      ops.push(
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: (body as any)[key] },
          create: { key, value: (body as any)[key] },
        })
      );
    }
  }
  if (ops.length === 0) return NextResponse.json({ ok: true });
  await prisma.$transaction(ops);
  return NextResponse.json({ ok: true });
}
