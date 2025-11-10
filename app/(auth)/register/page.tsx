"use client";

import { motion } from "framer-motion";
import SideContent from "@/components/form-side-content";
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
    <div className="relative w-full min-h-screen">
      {/* Theme Toggle */}
      <ThemeToggle variant="fixed" position="right-4 top-4" zIndex={50} />

      <div className="relative flex flex-col md:flex-row w-full h-full">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hemp-field.png')" }}
          {...backgroundFade}
        />

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
          className="flex-1 flex flex-col justify-start items-center p-6 md:p-12 shadow-xl
                     backdrop-blur-sm
                     bg-gradient-to-l from-[#AD8259]/80 to-[#AD8259]/30
                     dark:from-gray-800/80 dark:to-gray-900/50
                     min-h-full rounded-2xl transition-colors duration-300"
          {...fadeInUp}
          transition={{ ...fadeInUp.transition, delay: 0.4 }}
        >
          {/* Form Container */}
          <div className="w-full max-w-md md:max-w-lg">
            <SignupForm />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
