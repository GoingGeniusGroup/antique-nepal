"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { ProductCard } from "@/components/product-card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as any,
    },
  },
};

export function FeaturedCollection() {
  const { theme, isReady } = useTheme();

  return (
    <section
      className={`relative py-20 overflow-hidden ${
        !isReady
          ? "bg-[#f0ebe5]"
          : theme === "dark"
          ? "bg-[#111111]"
          : "bg-[#f0ebe5]"
      }`}
    >
      {/* Mountain Silhouette Bottom */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-32 pointer-events-none ${
          !isReady
            ? "opacity-15"
            : theme === "dark"
            ? "opacity-10"
            : "opacity-15"
        }`}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 150"
          preserveAspectRatio="none"
        >
          <path
            d="M0,150 L0,100 L200,50 L400,80 L600,30 L800,70 L1000,40 L1200,90 L1200,150 Z"
            fill="currentColor"
            className={theme === "dark" ? "text-white/20" : "text-[#2d2520]/25"}
          />
        </svg>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: false, margin: "-100px", amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className={`text-center text-4xl sm:text-5xl tracking-[0.08em] font-cinzel font-semibold mb-3 ${
              !isReady
                ? "text-[#2d2520]"
                : theme === "dark"
                ? "text-white"
                : "text-[#2d2520]"
            }`}
          >
            FEATURED COLLECTION
          </h2>
          <p
            className={`text-center text-xl font-inter mb-12 ${
              !isReady
                ? "text-neutral-600"
                : theme === "dark"
                ? "text-neutral-400"
                : "text-neutral-600"
            }`}
          >
            Discover our most beloved pieces, each crafted with centuries of
            tradition
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-sm md:max-w-none font-inter mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-50px", amount: 0.2 }}
        >
          <motion.div variants={itemVariants}>
            <ProductCard
              title="Traditional Weave Tote"
              price="300"
              img="/hemp-bag-1%201.png"
              tag="Best Seller"
              description="Handwoven with traditional patterns"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ProductCard
              title="Minimalist Hemp Bag"
              price="300"
              img="/hemp-bag-2%201.png"
              tag="New"
              description="Clean lines, maximum durability"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ProductCard
              title="Mountain Explorer Pack"
              price="300"
              img="/hemp-bag-3%201.png"
              tag="Popular"
              description="Perfect for your adventures"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.a
            href="#"
            className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 text-sm font-medium shadow-lg shadow-emerald-500/20 group cursor-pointer"
            whileHover={{
              scale: 1.08,
              boxShadow: "0 15px 40px rgba(107,74,50,0.4)",
              y: -3,
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            View Full Collection
            <motion.svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: [0, 5, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
