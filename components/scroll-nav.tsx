"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ScrollNavProps {
  className?: string;
  zIndex?: number;
}

export function ScrollNav({ className, zIndex = 40 }: ScrollNavProps = {}) {
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight || document.documentElement.clientHeight;

      // Only show scroll controls if page has reasonable scrollable height
      const isScrollable = scrollHeight > clientHeight + 250;

      // Show scroll to top if scrolled past 250px
      setShowScrollTop(scrollY > 250);

      // Show scroll to bottom if there's remaining content below
      setShowScrollBottom(isScrollable && scrollY + clientHeight < scrollHeight - 200);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const buttonBaseClass = cn(
    "group flex items-center justify-center rounded-full p-2.5 md:p-3 backdrop-blur-md transition-all duration-200 border cursor-pointer select-none",
    isDark
      ? "bg-stone-900/80 text-stone-200 border-stone-700/60 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:bg-stone-800 hover:border-stone-600 hover:text-white"
      : "bg-white/80 text-[#2d2520] border-[#e8e0d8] shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:bg-white hover:border-[#d4c8bc] hover:text-black"
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "fixed right-4 md:right-8 bottom-6 md:bottom-8 flex flex-col gap-2 pointer-events-none",
          className
        )}
        style={{ zIndex }}
      >
        <AnimatePresence>
          {showScrollTop && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  key="scroll-top"
                  onClick={scrollToTop}
                  initial={{ opacity: 0, scale: 0.6, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: 15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  className={cn(buttonBaseClass, "pointer-events-auto")}
                  aria-label="Scroll to top"
                >
                  <ChevronUp className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 group-hover:-translate-y-0.5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className={cn(
                  "backdrop-blur-md border px-2.5 py-1 text-xs font-medium shadow-lg rounded-lg",
                  isDark
                    ? "bg-stone-900/90 text-stone-200 border-stone-700/60"
                    : "bg-white/95 text-[#2d2520] border-[#e8e0d8]"
                )}
              >
                Scroll to top
              </TooltipContent>
            </Tooltip>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScrollBottom && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  key="scroll-bottom"
                  onClick={scrollToBottom}
                  initial={{ opacity: 0, scale: 0.6, y: -15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: -15 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  className={cn(buttonBaseClass, "pointer-events-auto")}
                  aria-label="Scroll to bottom"
                >
                  <ChevronDown className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-200 group-hover:translate-y-0.5" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                className={cn(
                  "backdrop-blur-md border px-2.5 py-1 text-xs font-medium shadow-lg rounded-lg",
                  isDark
                    ? "bg-stone-900/90 text-stone-200 border-stone-700/60"
                    : "bg-white/95 text-[#2d2520] border-[#e8e0d8]"
                )}
              >
                Scroll to bottom
              </TooltipContent>
            </Tooltip>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
