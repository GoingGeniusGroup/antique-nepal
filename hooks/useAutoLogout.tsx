"use client";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export function useAutoLogout() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return; // not logged in yet

    const expiresAt = new Date(session.expires).getTime();
    const now = Date.now();
    const timeout = expiresAt - now;

    if (timeout > 0) {
      const timer = setTimeout(() => {
        signOut({ callbackUrl: "/" }); // logout and redirect
      }, timeout);

      return () => clearTimeout(timer);
    } else {
      // already expired
      signOut({ callbackUrl: "/" });
    }
  }, [session]);
}
