"use client";

import { signIn } from "next-auth/react";
import { Chrome as Google } from "lucide-react";

const GoogleSignin = () => {
  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Google Sign-in failed:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      type="button"
      className="w-full bg-hemp hover:bg-opacity-80 text-primary font-sans font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-primary border-opacity-20"
    >
      <Google className="w-5 h-5" />
      Continue with Google
    </button>
  );
};

export default GoogleSignin;
