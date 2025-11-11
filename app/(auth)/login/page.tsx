"use client";

import { motion } from "framer-motion";
import SigninForm from "@/components/form/signin-form";
import SideContent from "@/components/form-side-content";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] as any },
};

const backgroundFade = {
  initial: { opacity: 0.7, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1.2, ease: [0.42, 0, 0.58, 1] as any },
};

const LoginPage = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error) {
      let errorMessage = "An unknown login error occurred. Please try again.";
      switch (error) {
        case "OAuthAccountNotLinked":
          errorMessage =
            "This email is already linked to an account. Please sign in with the original method.";
          break;
        case "CredentialsSignin":
          errorMessage =
            "Invalid email or password. Please check your credentials and try again.";
          break;
        case "AccessDenied":
          errorMessage =
            "Access Denied. You do not have permission to sign in.";
          break;
      }
      toast.error(errorMessage);
    }
  }, [error]);

  return (
    <div className="overflow-hidden bg-background dark:bg-gray-950 transition-colors duration-300">
      <ThemeToggle variant="fixed" position="right-4 top-4" zIndex={50} />
      <div className="relative flex flex-col md:flex-row w-full h-screen">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hemp-field.webp')" }}
          {...backgroundFade}
        />

        {/* Content Container */}
        <div className="relative z-10 flex flex-1 w-full h-full items-center justify-center">
          {/* Left Section */}
          <motion.div
            className="flex-1 hidden md:flex items-center justify-center p-8 md:p-16 text-white"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
          >
            <SideContent />
          </motion.div>

          {/* Right Section */}
          <motion.div
            className="flex-1 flex items-center justify-center p-8 md:p-16 shadow-xl backdrop-blur-sm 
             bg-linear-to-l from-[#AD8259]/80 to-[#AD8259]/30 
             dark:from-gray-800/80 dark:to-gray-900/50 min-h-full rounded-2xl transition-colors duration-300"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.4 }}
          >
            <div className="w-full max-w-md md:max-w-lg">
              <SigninForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
