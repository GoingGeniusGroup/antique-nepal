"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Leaf, Users, Award, ShoppingBag, ArrowRight } from "lucide-react";
import { NavigationLink } from "@/components/navigation-link";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { useHeroSettings, useBannerSettings } from "@/contexts/settings-context";
import { ThemeToggle } from "@/components/theme-toggle";

// Prayer flag colors
const PRAYER_FLAG_COLORS = [
  { bg: "bg-blue-500/60", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.5)]" },
  { bg: "bg-white/60", shadow: "shadow-[0_0_20px_rgba(255,255,255,0.5)]" },
  { bg: "bg-red-500/60", shadow: "shadow-[0_0_20px_rgba(239,68,68,0.5)]" },
  { bg: "bg-emerald-500/60", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.5)]" },
  { bg: "bg-amber-400/60", shadow: "shadow-[0_0_20px_rgba(251,191,36,0.5)]" },
] as const;

// Feature cards data
interface FeatureCard {
  icon: LucideIcon;
  iconColor: string;
  hoverGradient: string;
  title: string;
  description: string;
  delay: number;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    icon: Leaf,
    iconColor: "text-emerald-400",
    hoverGradient: "from-emerald-400/20",
    title: "100% Eco-Friendly",
    description: "Sustainable hemp fiber",
    delay: 0.1,
  },
  {
    icon: Users,
    iconColor: "text-blue-400",
    hoverGradient: "from-blue-400/20",
    title: "Fair Trade",
    description: "Supporting local artisans",
    delay: 0.2,
  },
  {
    icon: Award,
    iconColor: "text-amber-400",
    hoverGradient: "from-amber-400/20",
    title: "Quality Crafted",
    description: "15+ years tradition",
    delay: 0.3,
  },
];

// Animation constants
const ANIMATION_CONFIG = {
  fadeInUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    viewport: { once: true },
  },
  hoverScale: {
    whileHover: { scale: 1.05, y: -2 },
    whileTap: { scale: 0.95 },
  },
} as const;

// Floating particles with fixed positions to avoid hydration errors
const particles = [
  { id: 0, x: 15.2, y: 23.5, size: 3.2, duration: 25, delay: 0.5 },
  { id: 1, x: 78.6, y: 45.8, size: 4.8, duration: 28, delay: 1.2 },
  { id: 2, x: 42.3, y: 67.2, size: 2.5, duration: 22, delay: 2.1 },
  { id: 3, x: 88.9, y: 12.4, size: 5.5, duration: 30, delay: 0.8 },
  { id: 4, x: 25.7, y: 89.3, size: 3.8, duration: 26, delay: 1.8 },
  { id: 5, x: 63.4, y: 34.6, size: 4.2, duration: 24, delay: 2.5 },
  { id: 6, x: 9.8, y: 56.7, size: 2.8, duration: 27, delay: 1.5 },
  { id: 7, x: 51.2, y: 78.9, size: 5.2, duration: 29, delay: 0.3 },
  { id: 8, x: 72.5, y: 21.3, size: 3.5, duration: 23, delay: 2.8 },
  { id: 9, x: 34.8, y: 92.1, size: 4.5, duration: 25, delay: 1.1 },
  { id: 10, x: 91.3, y: 48.7, size: 2.2, duration: 28, delay: 2.3 },
  { id: 11, x: 18.6, y: 65.4, size: 5.8, duration: 22, delay: 0.6 },
  { id: 12, x: 56.9, y: 8.2, size: 3.1, duration: 26, delay: 1.9 },
  { id: 13, x: 82.1, y: 73.5, size: 4.1, duration: 24, delay: 2.6 },
  { id: 14, x: 7.4, y: 41.8, size: 2.9, duration: 29, delay: 0.9 },
  { id: 15, x: 45.7, y: 15.6, size: 5.4, duration: 27, delay: 1.4 },
  { id: 16, x: 68.2, y: 84.3, size: 3.6, duration: 23, delay: 2.2 },
  { id: 17, x: 29.5, y: 52.9, size: 4.9, duration: 25, delay: 0.7 },
  { id: 18, x: 95.8, y: 29.1, size: 2.6, duration: 28, delay: 1.6 },
  { id: 19, x: 12.3, y: 96.4, size: 5.1, duration: 26, delay: 2.4 },
];

export function Hero() {
  const { theme, isReady } = useTheme();
  const { hero, loading: heroLoading } = useHeroSettings();
  const { banner, loading: bannerLoading } = useBannerSettings();
  return (
    <section className="relative background-cover min-h-screen w-full overflow-hidden">
      {/* Original Image Background */}
      <Image
        src="/hero-mountains%201.png"
        alt="Himalayan mountains"
        fill
        priority
        className="object-cover opacity-100"
      />

      {(() => {
        const overlayClass = !isReady
          ? "bg-black/60"
          : theme === "dark"
          ? "bg-black/65"
          : "bg-black/50";
        return <div className={`absolute inset-0 ${overlayClass}`} />;
      })()}

      {/* Theme Toggle - Right side floating */}
      <ThemeToggle
        variant="absolute"
        position="right-4 md:right-8 top-1/2 -translate-y-1/2"
        animationType="slide"
        animationDelay={0.6}
        zIndex={20}
        className="p-3 md:p-3.5 shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
      />

      {/* Prayer Flags Animation - Enhanced */}
      <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden pointer-events-none z-10 flex items-start justify-between px-2">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="relative w-16 h-12 -mt-2.5"
            animate={{
              y: [0, 8, 0],
              rotate: [0, 3, 0, -3, 0],
            }}
            transition={{
              duration: 0.6 + i * 0.08,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.04,
            }}
          >
            <div
              className={`w-full h-full ${PRAYER_FLAG_COLORS[i % 5].bg} ${
                PRAYER_FLAG_COLORS[i % 5].shadow
              } backdrop-blur-sm border border-white/30 shadow-lg`}
            />
          </motion.div>
        ))}
        <motion.div
          className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-white/50 to-transparent shadow-[0_0_10px_rgba(255,255,255,0.5)]"
          animate={{ scaleX: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>

      {/* Mountain Silhouette Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none z-10">
        <svg
          className="absolute bottom-0 w-full h-full opacity-20"
          viewBox="0 0 1200 300"
          preserveAspectRatio="none"
        >
          <motion.path
            d="M0,300 L0,200 L200,100 L400,150 L600,50 L800,120 L1000,80 L1200,150 L1200,300 Z"
            fill="url(#mountainGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 2 }}
          />
          <defs>
            <linearGradient
              id="mountainGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#1a1a1a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Particles (Snow/Dust) */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/30 backdrop-blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 min-h-screen flex flex-col pt-32">
        {/* Dynamic Banner at top */}
        {(banner?.isVisible !== false && (banner?.text || !bannerLoading)) && (
          <div className="flex justify-center mb-8">
            <motion.div
              className="rounded-full bg-white/18 border border-white/35 text-white backdrop-blur-md px-6 py-2.5 inline-flex items-center gap-2 shadow-[0_10px_28px_rgba(0,0,0,0.28)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Leaf className="h-4 w-4 text-emerald-300" />
              <span className="text-sm font-inter">
                {banner?.text || "100% Sustainable • Handcrafted in Nepal • Est. 2010"}
              </span>
            </motion.div>
          </div>
        )}

        {/* Main content centered */}
        <div className="flex-1 flex flex-col items-center justify-center text-center text-white">
          <div className="space-y-4 mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative text-4xl sm:text-8xl md:text-8xl lg:text-8xl tracking-[0.18em] font-bold"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              <motion.span
                className="bg-linear-to-r from-primary-foreground via-white to-amber-100 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{
                  backgroundSize: "200% 200%",
                }}
              >
                {hero?.title || "ANTIQUE NEPAL"}
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-3xl sm:text-3xl md:text-3xl font-inter font-light text-white"
            >
              {hero?.subtitle || "Handcrafted Hemp Bags Woven with Himalayan Heritage"}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-lg font-inter font-light sm:text-lg text-white/85 leading-relaxed px-4"
            >
              {hero?.description || "Every bag tells a story. Crafted by master artisans using centuries-old techniques, sustainable hemp, and adorned with traditional Nepali paper art. Experience the perfect blend of ancient wisdom and modern design."}
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <motion.div {...ANIMATION_CONFIG.hoverScale}>
              <NavigationLink href="/products">
                <Button className="relative overflow-hidden rounded-md h-11 px-7 text-lg font-inter font-medium group text-white bg-primary hover:bg-[#b44f36] dark:bg-emerald-600 dark:hover:bg-emerald-500">
                  <span className="relative flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Explore Collection
                    <motion.span
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </motion.span>
                  </span>
                </Button>
              </NavigationLink>
            </motion.div>
            <motion.div {...ANIMATION_CONFIG.hoverScale}>
              <Button
                variant="outline"
                className="relative overflow-hidden rounded-md h-11 px-7 text-lg font-medium border-white/50 bg-white/5 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm"
              >
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative font-inter">Discover Our Story</span>
              </Button>
            </motion.div>
          </div>

          {/* Dynamic Feature Cards */}
          <div className="max-w-5xl w-full px-6 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {FEATURE_CARDS.map((card, index) => {
                const Icon = card.icon;
                const dynamicFeature = index === 0 ? hero?.features?.feature1 : 
                                     index === 1 ? hero?.features?.feature2 : 
                                     hero?.features?.feature3;
                
                return (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: card.delay, duration: 0.6 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8, scale: 1.05 }}
                    className="relative rounded-xl bg-white/10 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.3)] border border-white/20 p-6 flex flex-col items-center text-center group cursor-pointer overflow-hidden"
                  >
                    <motion.div
                      className={`absolute inset-0 bg-linear-to-br ${card.hoverGradient} to-transparent opacity-0 group-hover:opacity-100`}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="mb-3 h-12 w-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center relative z-10"
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Icon className={`h-6 w-6 ${card.iconColor}`} />
                    </motion.div>
                    <div className="text-white relative z-10">
                      <div className="text-lg font-semibold font-inter text-white mb-1">
                        {dynamicFeature?.title || card.title}
                      </div>
                      <div className="text-sm font-inter text-white/80">
                        {dynamicFeature?.description || card.description}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
