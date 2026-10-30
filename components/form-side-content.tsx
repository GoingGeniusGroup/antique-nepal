"use client";
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
            className="ml-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="font-cinzel text-xl font-semibold">Alena Collection</span>
          </motion.div>
        </motion.div>

        <h2 className="text-2xl font-cinzel font-semibold leading-relaxed text-black dark:text-white">
          Elevate your style with thoughtfully curated dresses, co-ord sets, and modern layers.
        </h2>

        <p className="text-sm font-inter text-gray-700 dark:text-gray-200">
          Sign in to start your journey with{" "}
          <span className="font-medium font-cinzel text-black dark:text-white">
            Alena Collection
          </span>
          .
        </p>
      </div>
    </div>
  );
};

export default SideContent;
