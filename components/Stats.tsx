"use client";

import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariantsWithScale,
  viewportConfig,
  hoverScale,
} from "./landing-utils";

// Statistics data
const stats = [
  { value: "200+", label: "Artisan Families" },
  { value: "15", label: "Years of Heritage" },
  { value: "10K+", label: "Happy Customers" },
  { value: "100%", label: "Natural Materials" },
];

export const Stats = () => {
  return (
    <section
      className="py-20 text-primary-foreground"
      style={{ background: "var(--gradient-mountain)" }}
    >
      <div className="container px-4 mx-auto">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={itemVariantsWithScale}
              whileHover={{ ...hoverScale, scale: 1.1 }}
            >
              <div
                className="text-5xl md:text-6xl font-bold mb-2"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                {stat.value}
              </div>
              <div className="text-lg text-primary-foreground/80">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
