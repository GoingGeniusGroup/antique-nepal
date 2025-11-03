"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

const GoogleSigninButton = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google Sign-in failed:", error);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      className="w-full bg-background border border-border text-foreground hover:shadow-md flex items-center justify-center gap-2 font-medium cursor-pointer"
    >
      <FcGoogle className="w-5 h-5" />
      Continue with Google
    </Button>
  );
};

export default GoogleSigninButton;
