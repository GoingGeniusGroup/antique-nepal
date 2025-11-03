"use client";

import { useTheme } from "@/contexts/theme-context";

type Banner = {
  title: string;
  subtitle: string;
};

export default function ProductsBannerSection({ title, subtitle }: Banner) {
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";

  return (
    <section
      className="relative w-full h-[20vh] md:h-[200px] lg:h-[220px] flex items-center justify-center text-center bg-cover"
      style={{
        backgroundImage: "url('/ProductsSectionBanner.png')",
        backgroundPosition: "center 25%",
      }}
    >
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
