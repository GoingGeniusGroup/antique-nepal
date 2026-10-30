/**
 * Page Transition Component
 * 
 * Provides smooth transitions between admin pages
 * Uses optimized animations for better perceived performance
 */

"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className = "" }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ 
        duration: 0.12, 
        ease: [0.25, 0.1, 0.25, 1] // Custom easing for smoother feel
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
