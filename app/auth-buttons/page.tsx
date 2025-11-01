"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Loader2 } from "lucide-react"; // Optional: for loading icon
import Link from "next/link";

const AuthButton = () => {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session, status } = useSession();

  console.log(status);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut({ callbackUrl: "/auth-buttons" });
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center gap-4">
        <div className="h-10 w-32 animate-pulse bg-muted rounded" />
      </div>
    );
  }

  // Authenticated state
  if (status === "authenticated" && session?.user) {
    const { name, email } = session.user;

    return (
      <div className="flex items-center gap-4">
        <div className="text-left">
          <div className="font-semibold text-primary">{name || "User"}</div>
          {email && (
            <div className="text-sm text-muted-foreground">{email}</div>
          )}
        </div>
        <button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="border px-3 py-1 rounded bg-paper hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSigningOut && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSigningOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    );
  }

  // Unauthenticated state
  return (
    <>
      <div className="flex gap-3">
        <Link href={"/login"}>
          <button className="border px-4 py-2 rounded hover:bg-muted transition-colors">
            Sign In
          </button>
        </Link>
        <Link href={"/register"}>
          <button className="border px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Sign Up
          </button>
        </Link>
      </div>
    </>
  );
};

export default AuthButton;
