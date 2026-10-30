"use client";

import { useTheme } from "@/contexts/theme-context";
import Image from "next/image";

interface ProductsBannerSectionProps {
  title: string;
  subtitle: string;
  imageSrc?: string; // optional, defaults to your current banner
}

export default function ProductsBannerSection({
  title,
  subtitle,
  imageSrc = "/hero-mountains.jpg",
}: ProductsBannerSectionProps) {
  const { theme, isReady } = useTheme();
  const isDark = isReady && theme === "dark";

  return (
    <section className="relative w-full h-[20vh] md:h-[200px] lg:h-[220px] flex items-center justify-center text-center">
      {/* Optimized image */}
      <Image
        src={imageSrc}
        alt="Products Banner"
        fill
        className="object-cover"
        priority
        placeholder="blur"
        style={{ objectPosition: "center 25%" }}
        blurDataURL="/ProductsSectionBanner_blur.png" // small, tiny blurred image (1–5 KB)
      />

      {/* Overlay */}
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
