"use client";

import { motion } from "framer-motion";
import SideContent from "@/components/from-side-content";
import SignupForm from "@/components/form/signup-form";
import { ThemeToggle } from "@/components/theme-toggle";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] as any }, // cubic-bezier easeOut
};

const backgroundFade = {
  initial: { opacity: 0.7, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1.2, ease: [0.42, 0, 0.58, 1] as any },
};

const RegisterPage = () => {
  return (
    <div className="overflow-hidden">
      {/* Theme Toggle */}
      <ThemeToggle variant="fixed" position="right-4 top-4" zIndex={50} />
      <div className="relative flex flex-col md:flex-row w-full h-screen">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hemp-field.png')" }}
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
            className="flex-1 flex items-center justify-center p-8 md:p-16 shadow-xl backdrop-blur-sm bg-linear-to-l from-[#D4BE96]/95 to-[#D4BE96]/30 min-h-full"
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.4 }}
          >
            <div className="w-full max-w-md md:max-w-lg mt-20">
              <SignupForm />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
