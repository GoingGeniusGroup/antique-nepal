"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export function AuthSuccessHandler() {
  const { status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "authenticated") {
      const hasShown = sessionStorage.getItem("loginSuccessToastShown");
      const isAdminRoute = pathname?.startsWith("/admin");
      
      // Only show toast if on admin route and hasn't been shown yet
      if (!hasShown && isAdminRoute) {
        toast.success("Logged in successfully!");
        sessionStorage.setItem("loginSuccessToastShown", "true");
      }
    }

    if (status === "unauthenticated") {
      sessionStorage.removeItem("loginSuccessToastShown");
    }
  }, [status, pathname]);

  return null; // This component does not render any UI.
}
