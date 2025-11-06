"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export function AuthSuccessHandler() {
  const { status } = useSession();
  const previousStatus = useRef(status);
  const hasShownToast = useRef(false);

  useEffect(() => {
    // Detect transition from loading/unauthenticated to authenticated
    if (
      status === "authenticated" &&
      previousStatus.current !== "authenticated"
    ) {
      const sessionFlag = sessionStorage.getItem("loginSuccessToastShown");

      // Only show toast if we haven't shown it yet (both in component and session)
      if (!hasShownToast.current && !sessionFlag) {
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
  }, [status]);

  return null; // This component does not render any UI.
}
