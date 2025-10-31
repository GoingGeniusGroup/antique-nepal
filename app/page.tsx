"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";

export default function Home() {
  const [isSignInOpen, setSignInOpen] = useState(false);
  const [isSignUpOpen, setSignUpOpen] = useState(false);

  return (
    <div className="p-6 flex flex-col gap-4">
      <div className="flex gap-2">
        <Button variant="destructive" onClick={() => alert("button clicked")}>
          Click me
        </Button>
        <Button variant="outline" onClick={() => alert("button clicked")}>
          Click Aj
        </Button>
        <Button variant="ghost" onClick={() => alert("button clicked")}>
          Click Sushant
        </Button>
      </div>

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
    </div>
  );
}
