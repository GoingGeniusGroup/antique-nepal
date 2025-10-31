"use client";

import { PropsWithChildren } from "react";
import { useTheme } from "@/contexts/theme-context";
import { motion, AnimatePresence } from "framer-motion";

export function ClientRoot({ children }: PropsWithChildren) {
  const { isReady } = useTheme();

  return (
    <div className="relative">
      {children}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-100 bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-white text-3xl tracking-[0.18em]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ANTIQUE NEPAL
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
