"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

const GoogleSigninButton = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false, // Don't auto-redirect to handle errors
      });

      if (result?.error) {
        toast.error("Failed to sign in with Google");
        console.error("Google Sign-in error:", result.error);
      } else if (result?.url) {
        // Redirect manually on success
        window.location.href = result.url;
      }
    } catch (error) {
      console.error("Google Sign-in failed:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full bg-background border border-border text-foreground hover:shadow-md flex items-center justify-center gap-2 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          Signing in...
        </>
      ) : (
        <>
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </>
      )}
    </Button>
  );
};

export default GoogleSigninButton;
