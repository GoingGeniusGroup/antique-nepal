"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  /** Position variant */
  variant?: "fixed" | "absolute" | "relative";
  /** Position classes */
  position?: string;
  /** Custom animation delay */
  animationDelay?: number;
  /** Animation type */
  animationType?: "slide" | "scale";
  /** Custom className */
  className?: string;
  /** Z-index value */
  zIndex?: number;
}

export function ThemeToggle({
  variant = "fixed",
  position = "right-4 md:right-8 top-1/2 -translate-y-1/2",
  animationDelay = 0.3,
  animationType = "slide",
  className,
  zIndex = 50,
}: ThemeToggleProps = {}) {
  const { theme, isReady, toggleTheme } = useTheme();
  const isDark = isReady && theme === "dark";

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={toggleTheme}
            initial={
              animationType === "slide"
                ? { opacity: 0, x: 30 }
                : { opacity: 0, scale: 0.8 }
            }
            animate={
              animationType === "slide"
                ? { opacity: 1, x: 0 }
                : { opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.5, delay: animationDelay, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className={cn(
              variant === "fixed" && "fixed",
              variant === "absolute" && "absolute",
              variant === "relative" && "relative",
              position,
              "group rounded-full p-3 md:p-3.5 backdrop-blur-md transition-colors duration-200 border cursor-pointer select-none",
              isDark
                ? "bg-stone-900/80 text-amber-300 border-stone-700/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:bg-stone-800 hover:border-stone-600"
                : "bg-white/80 text-[#2d2520] border-[#e8e0d8] shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:bg-white hover:border-[#d4c8bc]",
              className
            )}
            style={{ zIndex }}
            aria-label={
              isDark ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <AnimatePresence mode="wait" initial={false}>
              {isReady && theme === "dark" ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-5 w-5 md:h-6 md:w-6 text-amber-300" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, opacity: 0, scale: 0.7 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-5 w-5 md:h-6 md:w-6 text-[#2d2520]" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          className={cn(
            "backdrop-blur-md border px-3 py-1.5 text-xs font-medium shadow-lg rounded-lg",
            isDark
              ? "bg-stone-900/90 text-stone-200 border-stone-700/60"
              : "bg-white/95 text-[#2d2520] border-[#e8e0d8]"
          )}
        >
          {isDark ? "Switch to Light mode" : "Switch to Dark mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

