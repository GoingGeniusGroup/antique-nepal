"use client";

import NextTopLoader from "nextjs-toploader";
import { useTheme } from "@/contexts/theme-context";
import { useEffect, useState } from "react";

export function ThemeAwareTopLoader() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const color = theme === "dark" ? "#ffffff" : "#000000";
  const shadow = theme === "dark" 
    ? "0 0 10px #ffffff,0 0 5px #ffffff" 
    : "0 0 10px #000000,0 0 5px #000000";

  return (
    <NextTopLoader
      color={color}
      initialPosition={0.08}
      crawlSpeed={200}
      height={3}
      crawl={true}
      showSpinner={false}
      easing="ease"
      speed={200}
      shadow={shadow}
      key={theme} // Force re-render when theme changes
    />
  );
}
