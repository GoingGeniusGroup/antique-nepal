"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import {
  viewportConfigHeader,
  viewportConfig,
  fadeInUp,
} from "./landing-utils";
import Link from "next/link";

export const CallToAction = () => {
  return (
    <section className="py-20 bg-primary dark:bg-[#0f0f0f] text-primary-foreground dark:text-white">
      <div className="container px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <motion.div
            className="text-center mb-16"
            {...fadeInUp}
            viewport={viewportConfigHeader}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Begin Your Journey
            </h2>
            <p className="text-xl font-inter mb-8 text-primary-foreground/90 dark:text-slate-300">
              Explore our collection of handcrafted hemp bags and bring a piece
              of Himalayan heritage into your life.
            </p>
            <motion.div
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Link href="/products">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-10 py-6 font-inter shadow-medium hover:shadow-soft transition-all"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            className="bg-primary-foreground/10 dark:bg-slate-700/50 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-primary-foreground/20 dark:border-slate-600"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Mail className="w-12 h-12 mx-auto mb-4 text-primary-foreground dark:text-slate-300" />
              </motion.div>
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Stay Connected
              </h3>
              <p className="text-primary-foreground/80 dark:text-slate-400 font-inter">
                Subscribe to receive updates on new collections and artisan
                stories
              </p>
            </motion.div>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground dark:bg-slate-900 font-inter text-primary dark:text-white border-none dark:border-slate-600 flex-1"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  type="submit"
                  variant="secondary"
                  className="whitespace-nowrap font-inter"
                >
                  Subscribe
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
