"use client";

import { useTheme } from "@/contexts/theme-context";
import { useState, useEffect } from "react";

interface ProductsBannerSectionProps {
  title: string;
  subtitle: string;
}

export default function ProductsBannerSection({
  title,
  subtitle,
}: ProductsBannerSectionProps) {
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";

  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.src = "/ProductsSectionBanner.png";
    img.onload = () => setIsImageLoaded(true);
  }, []);

  return (
    <section
      className="relative w-full h-[20vh] md:h-[200px] lg:h-[220px] flex items-center justify-center text-center bg-cover transition-all duration-500"
      style={{
        backgroundImage: isImageLoaded
          ? "url('/ProductsSectionBanner.png')"
          : undefined,
        backgroundPosition: "center 25%",
      }}
    >
      {/* Fallback / overlay */}
      {!isImageLoaded && (
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            isDark ? "bg-black/70" : "bg-gray-300"
          }`}
        ></div>
      )}

      <div
        className={`absolute inset-0 ${isDark ? "bg-black/70" : "bg-black/50"}`}
      />

      <div className="relative z-10 text-white px-4">
        <h2 className="text-3xl md:text-5xl font-semibold mb-3 font-cinzel">
          {title}
        </h2>
        <p className="text-sm md:text-lg max-w-2xl mx-auto font-inter text-white/95">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
