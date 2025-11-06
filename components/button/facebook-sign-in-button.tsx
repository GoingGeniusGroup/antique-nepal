"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FaFacebook } from "react-icons/fa";
import { usePathname } from "next/navigation";

const FacebookSigninButton = () => {
  const pathname = usePathname();
  
  const handleFacebookSignIn = async () => {
    try {
      // Redirect to homepage after login, unless already on a different page
      const isAuthPage = pathname === "/login" || pathname === "/register";
      const callbackUrl = isAuthPage ? "/" : pathname;
      
      await signIn("facebook", { 
        callbackUrl: callbackUrl || "/",
        redirect: true // Keep redirect true for OAuth flow
      });
    } catch (error) {
      console.error("Facebook Sign-in failed:", error);
    }
  };

  return (
    <div>
      <Button
        type="button"
        onClick={handleFacebookSignIn}
        className="w-full bg-[#1877F2] text-white hover:bg-[#166FE0] flex items-center justify-center gap-2 font-medium cursor-pointer"
      >
        <FaFacebook className="w-5 h-5 text-white" />
        Continue with Facebook
      </Button>
    </div>
  );
};

export default FacebookSigninButton;
