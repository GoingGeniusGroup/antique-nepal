"use client";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProfileView from "./components/ProfileView";
import { useSession } from "next-auth/react";

export default async function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      addresses: true,
    },
  });

  if (!user) redirect("/login");

  return <ProfileView user={user} />;
}
