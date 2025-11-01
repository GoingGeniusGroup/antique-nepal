"use client";

import { motion } from "framer-motion";
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
  position = "right-4 md:right-8 top-24 md:top-28",
  animationDelay = 0.3,
  animationType = "scale",
  className,
  zIndex = 30,
}: ThemeToggleProps = {}) {
  const { theme, isReady, toggleTheme } = useTheme();
  const isDark = isReady && theme === "dark";

  const animationProps =
    animationType === "slide"
      ? {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.6, delay: animationDelay },
        }
      : {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.3, delay: animationDelay },
        };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={toggleTheme}
            {...animationProps}
            className={cn(
              variant === "fixed" && "fixed",
              variant === "absolute" && "absolute",
              variant === "relative" && "relative",
              position,
              "rounded-full p-3 backdrop-blur-md shadow-lg border transition-all",
              isDark
                ? "bg-white/20 border-white/30 hover:bg-white/30"
                : "bg-[#f7f5f2]/80 border-[#e8e0d8] hover:bg-white/90",
              className
            )}
            style={{ zIndex }}
            aria-label={
              isDark ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isReady ? (
              theme === "dark" ? (
                <Moon className="h-5 w-5 md:h-6 md:w-6 text-amber-300" />
              ) : (
                <Sun className="h-5 w-5 md:h-6 md:w-6 text-[#2d2520]" />
              )
            ) : (
              <Sun className="h-5 w-5 md:h-6 md:w-6" />
            )}
          </motion.button>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          className={cn(
            "backdrop-blur-md border",
            isDark
              ? "bg-white/20 text-white border-white/30"
              : "bg-white/80 text-[#2d2520] border-[#e8e0d8]"
          )}
        >
          {isDark ? "Light mode" : "Dark mode"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

