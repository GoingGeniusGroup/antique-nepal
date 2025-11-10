"use client";
import logo from "@/public/logo/Antique-Nepal-Logo-White-Png-3.png";
import logotxt from "@/public/logo/Antique-Nepal-Logo-White-Png-2.png";
import Image from "next/image";
import { motion } from "framer-motion";

const SideContent = () => {
  return (
    <div>
      {/* background overlay */}
      <div className="absolute inset-0 bg-white/30 dark:bg-black/50"></div>

      {/* text section */}
      <div className="relative z-10 flex flex-col justify-center p-12 text-black dark:text-white space-y-6 max-w-md">
        <motion.div
          className="mb-4 flex justify-start items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Image src={logo} alt="Logo" className="block mb-2 w-24" />
          </motion.div>

          <motion.div
            className="ml-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Image src={logotxt} alt="Logo Text" className="h-5 w-44" />
          </motion.div>
        </motion.div>

        <h2 className="text-2xl font-cinzel font-semibold leading-relaxed text-black dark:text-white">
          Elevate your style with our exclusive range of handcrafted bags.
        </h2>

        <p className="text-sm font-inter text-gray-700 dark:text-gray-200">
          Sign in to start your journey with{" "}
          <span className="font-medium font-cinzel text-black dark:text-white">
            Antique Nepal
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default SideContent;
