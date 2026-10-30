"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Heart, Sparkles, Shirt } from "lucide-react";
import fashionPlaceholder from "@/public/product_placeholder.jpeg";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import {
  containerVariants,
  itemVariants,
  viewportConfig,
  viewportConfigHeader,
  fadeInUp,
  hoverScale,
  getThemeClass,
} from "./landing-utils";

// Feature cards data
const features = [
    {
      icon: Shirt,
      title: "Everyday Dresses",
      description: "Easy, polished silhouettes for workdays and weekends",
    },
    {
      icon: Heart,
      title: "Co-ord Sets",
      description: "Put-together matching looks with effortless versatility",
    },
    {
      icon: Sparkles,
      title: "Modern Layers",
      description: "Considered outerwear to complete your everyday wardrobe",
    },
  ];

export default function ProductShowcase() {
  const { theme, isReady } = useTheme();

  return (
    <section
      className={`py-20 ${getThemeClass(theme, isReady, "bg-gradient-paper", "bg-[#1a1a1a]")}`}
    >
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
            viewport={viewportConfigHeader}
          >
            <h2
              className={`text-4xl md:text-5xl font-bold mb-4 ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Our Signature Collection
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
            >
              Discover versatile pieces selected to make getting dressed effortless
            </p>
          </motion.div>

          {/* Image and Features */}
          <div className="grid md:grid-cols-2 gap-12 items-center justify-center mb-16">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportConfig}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="w-full flex justify-center"
            >
              <div
                className={`rounded-3xl flex items-center justify-center shadow-inner w-full max-w-md ${getThemeClass(theme, isReady, "bg-[#f3f0ed]", "bg-[#1a1a1a]")}`}
              >
                <Image
                  src={fashionPlaceholder}
                  alt="Alena Collection fashion placeholder"
                  className="w-full h-full object-cover rounded-3xl transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              className="space-y-6 flex flex-col items-center justify-center"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
            >
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={hoverScale}
                    className="w-full max-w-md"
                  >
                    <Card
                      className={`p-6 border hover:shadow-lg transition-all duration-300 ${getThemeClass(theme, isReady, "bg-card border-border", "bg-[#1a1a1a] border-white/10 hover:border-white/20")}`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-lg shrink-0 ${getThemeClass(theme, isReady, "bg-secondary", "bg-emerald-500/20")}`}
                        >
                          <Icon
                            className={`w-6 h-6 ${getThemeClass(theme, isReady, "text-secondary-foreground", "text-emerald-400")}`}
                          />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3
                            className={`text-xl font-semibold mb-2 ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                          >
                            {feature.title}
                          </h3>
                          <p
                            className={getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}
                          >
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
