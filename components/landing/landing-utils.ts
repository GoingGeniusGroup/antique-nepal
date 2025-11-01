import { Variants } from "framer-motion";

/**
 * Shared utilities for landing page components
 * Reduces code duplication and ensures consistent animations across sections
 */

// Container animation with stagger for child elements
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Common item animation - slide up
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Item animation with scale
export const itemVariantsWithScale: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Common viewport configuration
export const viewportConfig = {
  once: false,
  margin: "-50px",
  amount: 0.2,
} as const;

export const viewportConfigHeader = {
  once: false,
  margin: "-100px",
  amount: 0.3,
} as const;

// Common fade-in-up animation props
export const fadeInUp = {
  initial: { opacity: 0, y: -20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

// Common hover animation
export const hoverScale = {
  y: -8,
  scale: 1.02,
  transition: { duration: 0.3, ease: "easeOut" as const },
};

/**
 * Get theme-aware className helper
 */
export function getThemeClass(
  theme: string | undefined,
  isReady: boolean,
  lightClass: string,
  darkClass: string,
  fallbackClass?: string
): string {
  if (!isReady) return fallbackClass || lightClass;
  return theme === "dark" ? darkClass : lightClass;
}

