"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";

const AuthButton = () => {
  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);
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
