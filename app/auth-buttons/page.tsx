"use client";

import { useState } from "react";
import SignIn from "@/components/form/signin-form";
import SignUp from "@/components/form/signup-form";
import { useSession, signOut } from "next-auth/react";

const AuthButton = () => {
  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
  const { data: session, status } = useSession();

  if (status === "authenticated" && session?.user) {
    const user = session.user as any;
    return (
      <div className="flex items-center gap-4">
        <div className="text-left">
          <div className="font-semibold text-primary">{user.name ?? "—"}</div>
          <div className="text-sm text-muted-foreground">
            {user.email ?? "—"}
          </div>
          {user.phone && (
            <div className="text-sm text-muted-foreground">{user.phone}</div>
          )}
        </div>
        <div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="border px-3 py-1 rounded bg-paper"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-3">
        <button
          onClick={() => setSignInOpen(true)}
          className="border px-4 py-2 rounded"
        >
          Sign In
        </button>
        <button
          onClick={() => setSignUpOpen(true)}
          className="border px-4 py-2 rounded"
        >
          Sign Up
        </button>
      </div>

      {/* Dialogs */}
      <SignIn open={isSignInOpen} onOpenChange={setSignInOpen} />
      <SignUp open={isSignUpOpen} onOpenChange={setSignUpOpen} />
    </>
  );
};

export default AuthButton;
