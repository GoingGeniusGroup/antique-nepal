"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import toast from "react-hot-toast";

export function useAutoLogout() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return; // not logged in yet

    const expiresAt = new Date(session.expires).getTime();
    const now = Date.now();
    const timeout = expiresAt - now;

    if (timeout > 0) {
      const timer = setTimeout(async () => {
        await signOut({ redirect: false });
        sessionStorage.removeItem("loginSuccessToastShown");
        toast.error("Session expired. Please login again.", {
          duration: 3000,
          position: "bottom-right",
        });
      }, timeout);

      return () => clearTimeout(timer);
    } else {
      // already expired
      (async () => {
        await signOut({ redirect: false });
        sessionStorage.removeItem("loginSuccessToastShown");
        toast.error("Session expired. Please login again.", {
          duration: 3000,
          position: "bottom-right",
        });
      })();
    }
  }, [session]);
}
