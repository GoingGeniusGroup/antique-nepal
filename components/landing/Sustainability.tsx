"use client";

import { Card } from "@/components/ui/card";
import { Sprout, Droplet, Wind, TreePine, Leaf, Mountain } from "lucide-react";
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

// Environmental impact metrics
const impacts = [
    {
      icon: Sprout,
      metric: "80%",
      label: "Less CO2 than Cotton",
      description: "Hemp absorbs CO2 as it grows, making it carbon-negative",
    },
    {
      icon: Droplet,
      metric: "500L",
      label: "Water Saved per Bag",
      description: "Hemp requires 50% less water than cotton production",
    },
    {
      icon: Wind,
      metric: "Zero",
      label: "Pesticide Use",
      description: "Naturally pest-resistant, no harmful chemicals needed",
    },
    {
      icon: TreePine,
      metric: "5x",
      label: "Stronger than Cotton",
      description: "More durable, lasts longer, reduces waste",
    },
  ];

export const Sustainability = () => {
  const { theme, isReady } = useTheme();

  return (
    <section
      id="sustainability"
      className={`py-20 relative overflow-hidden ${getThemeClass(theme, isReady, "bg-gradient-paper", "bg-[#0f0f0f]")}`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-24 left-10 opacity-5 pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf
            className={`w-16 h-16 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
          />
        </motion.div>
      </div>
      <div className="absolute bottom-24 right-10 opacity-5 pointer-events-none">
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mountain
            className={`w-16 h-16 ${getThemeClass(theme, isReady, "text-slate-600", "text-slate-400")}`}
          />
        </motion.div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
            viewport={viewportConfigHeader}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sprout
                  className={`w-8 h-8 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
                />
              </motion.div>
              <h2
                className={`text-4xl md:text-5xl font-bold ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Our Environmental Commitment
              </h2>
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <TreePine
                  className={`w-8 h-8 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
                />
              </motion.div>
            </div>
            <p
              className={`text-xl max-w-2xl mx-auto ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
            >
              Every bag you carry makes a positive impact on our planet
            </p>
          </motion.div>

          {/* Impact Cards */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 justify-items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {impacts.map((impact, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ ...hoverScale, scale: 1.05 }}
                className="w-full max-w-sm"
              >
                <Card
                  className={`p-6 border text-center transition-all duration-300 relative overflow-hidden ${getThemeClass(theme, isReady, "bg-card border-border hover:shadow-soft", "bg-[#1a1a1a] border-white/10 hover:border-white/20 hover:shadow-lg")}`}
                >
                  <div className="absolute top-2 right-2 opacity-5">
                    {index % 2 === 0 ? (
                      <Leaf
                        className={`w-12 h-12 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
                      />
                    ) : (
                      <Mountain
                        className={`w-12 h-12 ${getThemeClass(theme, isReady, "text-slate-600", "text-slate-400")}`}
                      />
                    )}
                  </div>
                  <div className="relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${getThemeClass(theme, isReady, "bg-secondary/20", "bg-emerald-500/20")}`}
                    >
                      <impact.icon
                        className={`w-6 h-6 ${getThemeClass(theme, isReady, "text-secondary", "text-emerald-400")}`}
                      />
                    </div>
                    <div
                      className={`text-4xl font-bold mb-2 ${getThemeClass(theme, isReady, "text-primary", "text-emerald-400")}`}
                      style={{ fontFamily: "Cinzel, serif" }}
                    >
                      {impact.metric}
                    </div>
                    <div
                      className={`font-semibold mb-2 ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                    >
                      {impact.label}
                    </div>
                    <p
                      className={`text-sm ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
                    >
                      {impact.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Feature Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center"
          >
            <Card
              className={`p-10 border relative overflow-hidden max-w-5xl w-full ${getThemeClass(theme, isReady, "bg-card border-border shadow-soft", "bg-[#1a1a1a] border-white/10 shadow-lg")}`}
            >
              <div className="absolute top-4 right-4 opacity-5">
                <TreePine
                  className={`w-24 h-24 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                <div>
                  <h3
                    className={`text-3xl font-bold mb-4 ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                    style={{ fontFamily: "Cinzel, serif" }}
                  >
                    Hemp: Nature's Miracle Fiber
                  </h3>
                  <p
                    className={`leading-relaxed mb-4 ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
                  >
                    Hemp is one of the most sustainable materials on Earth. It
                    grows quickly, improves soil health, and requires minimal
                    resources. The plant naturally resists pests and diseases,
                    eliminating the need for harmful pesticides.
                  </p>
                  <p
                    className={`leading-relaxed ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
                  >
                    By choosing hemp products, you're supporting regenerative
                    agriculture and helping to reduce the fashion industry's
                    environmental footprint. Each bag represents a step toward a
                    more sustainable future.
                  </p>
                </div>
                <div
                  className={`rounded-2xl p-8 ${getThemeClass(theme, isReady, "bg-secondary/10", "bg-emerald-500/10")}`}
                >
                  <h4
                    className={`text-xl font-semibold mb-6 ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                  >
                    Environmental Benefits
                  </h4>
                  <ul
                    className={`space-y-3 ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
                  >
                    {[
                      "Biodegradable and compostable at end of life",
                      "Improves soil structure for future crops",
                      "Produces more fiber per acre than trees",
                      "Natural UV protection and antimicrobial properties",
                    ].map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${getThemeClass(theme, isReady, "bg-secondary", "bg-emerald-400")}`}
                        />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
