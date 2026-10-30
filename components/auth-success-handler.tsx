"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

export function AuthSuccessHandler() {
  const { status } = useSession();
  const pathname = usePathname();
  const previousStatus = useRef(status);
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Detect transition from loading/unauthenticated to authenticated
    if (
      status === "authenticated" &&
      previousStatus.current !== "authenticated"
    ) {
      const sessionFlag = sessionStorage.getItem("loginSuccessToastShown");
      const isAdminRoute = pathname?.startsWith("/admin");

      // Only show toast if on admin route and we haven't shown it yet
      if (!hasShownToast.current && !sessionFlag && isAdminRoute) {
        // Small delay to ensure UI has updated after OAuth redirect
        setTimeout(() => {
          toast.success("Logged in successfully!");
          sessionStorage.setItem("loginSuccessToastShown", "true");
          hasShownToast.current = true;
        }, 100);
      }
    }

    // Clear the flag when user logs out
    if (status === "unauthenticated") {
      sessionStorage.removeItem("loginSuccessToastShown");
      hasShownToast.current = false;
    }

    // Update previous status
    previousStatus.current = status;
  }, [status, pathname]);

  return null; // This component does not render any UI.
}
