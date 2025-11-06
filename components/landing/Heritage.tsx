"use client";

import Image from "next/image";
import paperTexture from "@/public/paper-texture.jpg";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { Leaf, Mountain } from "lucide-react";
import {
  containerVariants,
  itemVariants,
  viewportConfig,
  viewportConfigHeader,
  fadeInUp,
  hoverScale,
  getThemeClass,
} from "./landing-utils";

export default function Heritage() {
  const { theme, isReady } = useTheme();

  return (
    <section
      id="heritage"
      className={`py-20 relative overflow-hidden ${getThemeClass(theme, isReady, "bg-background", "bg-[#141414]")}`}
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src={paperTexture}
          alt="Paper texture background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-10 pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf
            className={`w-16 h-16 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
          />
        </motion.div>
      </div>
      <div className="absolute top-32 right-10 opacity-10 pointer-events-none">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mountain
            className={`w-12 h-12 ${getThemeClass(theme, isReady, "text-slate-600", "text-slate-400")}`}
          />
        </motion.div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
            viewport={viewportConfigHeader}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Leaf
                  className={`w-8 h-8 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
                />
              </motion.div>
              <h2
                className={`text-4xl md:text-5xl font-bold ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Rooted in Nepali Heritage
              </h2>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              >
                <Mountain
                  className={`w-8 h-8 ${getThemeClass(theme, isReady, "text-slate-600", "text-slate-400")}`}
                />
              </motion.div>
            </div>
            <div
              className={`w-24 h-1 mx-auto mb-8 ${getThemeClass(theme, isReady, "bg-accent", "bg-emerald-400")}`}
            />
          </motion.div>

          {/* Two-Column Section */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 items-center justify-center max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Traditional Craftsmanship Card */}
            <motion.div
              variants={itemVariants}
              whileHover={hoverScale}
              className="w-full"
            >
              <div
                className={`bg-card p-8 rounded-2xl shadow-soft border border-border relative overflow-hidden ${getThemeClass(theme, isReady, "bg-card", "bg-[#1a1a1a] border-white/10")}`}
              >
                <div className="absolute top-4 right-4 opacity-5">
                  <Leaf
                    className={`w-20 h-20 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
                  />
                </div>
                <div className="relative z-10">
                  <h3
                    className={`text-2xl font-semibold mb-4 ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                    style={{ fontFamily: "Cinzel, serif" }}
                  >
                    Traditional Craftsmanship
                  </h3>
                  <p
                    className={`leading-relaxed mb-4 ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
                  >
                    Our bags are crafted using techniques passed down through
                    generations of Nepali artisans. Each stitch and weave reflects
                    the rich cultural heritage of the Himalayan region.
                  </p>
                  <p
                    className={`leading-relaxed ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
                  >
                    The natural hemp fiber, combined with traditional Nepali
                    paper-making aesthetics, creates products that are both timeless
                    and contemporary.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sustainable by Nature Card */}
            <motion.div
              variants={itemVariants}
              whileHover={hoverScale}
              className="w-full"
            >
              <div
                className={`bg-card p-8 rounded-2xl shadow-soft border border-border relative overflow-hidden ${getThemeClass(theme, isReady, "bg-card", "bg-[#1a1a1a] border-white/10")}`}
              >
                <div className="absolute top-4 right-4 opacity-5">
                  <Mountain
                    className={`w-20 h-20 ${getThemeClass(theme, isReady, "text-slate-600", "text-slate-400")}`}
                  />
                </div>
                <div className="relative z-10">
                  <h3
                    className={`text-2xl font-semibold mb-4 ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                    style={{ fontFamily: "Cinzel, serif" }}
                  >
                    Sustainable by Nature
                  </h3>
                  <p
                    className={`leading-relaxed mb-4 ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
                  >
                    Hemp grows naturally in the mountain regions of Nepal, requiring
                    minimal water and no pesticides. It's one of the most
                    sustainable materials on Earth.
                  </p>
                  <p
                    className={`leading-relaxed ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
                  >
                    By choosing our hemp bags, you're supporting both environmental
                    sustainability and the livelihoods of Nepali artisan
                    communities.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Quote Section */}
          <motion.div
            className="mt-16 text-center text-primary-foreground p-10 rounded-2xl max-w-4xl mx-auto relative overflow-hidden"
            style={{ background: "var(--gradient-mountain)" }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute top-2 right-4 opacity-10">
              <Mountain className="w-16 h-16 text-white" />
            </div>
            <div className="absolute bottom-2 left-4 opacity-10">
              <Leaf className="w-12 h-12 text-white" />
            </div>
            <p
              className="text-xl md:text-2xl leading-relaxed relative z-10"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              "Every bag carries the spirit of the mountains and the warmth of
              Nepali craftsmanship."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
