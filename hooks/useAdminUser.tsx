"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const useAdminUser = () => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (!session) return;

    if ((session.user as any).role === "ADMIN") {
      router.push("/admin"); // redirect admin
    } else {
      router.push("/"); // redirect normal users
    }
  }, [session, router]);
};
