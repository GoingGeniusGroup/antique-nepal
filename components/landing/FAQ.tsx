"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/theme-context";
import { Leaf, Mountain } from "lucide-react";
import {
  containerVariants,
  itemVariants,
  viewportConfig,
  viewportConfigHeader,
  fadeInUp,
  getThemeClass,
} from "./landing-utils";

// FAQ data
const faqs = [
    {
      question: "What makes your hemp bags special?",
      answer:
        "Our hemp bags are handcrafted by skilled Nepali artisans using 100% organic hemp fiber sourced from the Himalayan region. Each bag is woven using traditional techniques passed down through generations, featuring authentic Nepali paper accents and natural dyes. Every piece is unique and tells a story of heritage and sustainability.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Domestic orders typically arrive within 3-5 business days. International shipping takes 7-14 business days depending on your location. All orders are carefully packaged using eco-friendly materials. You'll receive a tracking number once your order ships.",
    },
    {
      question: "Are the bags durable and water-resistant?",
      answer:
        "Absolutely! Hemp is naturally one of the strongest natural fibers, making our bags incredibly durable. They're naturally water-resistant and become stronger with age. With proper care, your Antique Nepal bag will last for many years while developing a beautiful, unique patina.",
    },
    {
      question: "How should I care for my hemp bag?",
      answer:
        "Hemp bags require minimal maintenance. Spot clean with a damp cloth and mild soap when needed. Air dry away from direct sunlight. Avoid machine washing. The natural hemp fiber will soften over time while maintaining its strength and durability.",
    },
    {
      question: "Do you support fair trade practices?",
      answer:
        "Yes, we're committed to fair trade and ethical production. We work directly with artisan communities in Nepal, ensuring fair wages, safe working conditions, and supporting traditional craftsmanship. Your purchase directly empowers local families and preserves cultural heritage.",
    },
    {
      question: "Can I customize or request specific designs?",
      answer:
        "We offer custom orders for bulk purchases and special occasions. Contact us at custom@antiquenepal.com with your requirements. Please note that custom orders require 3-4 weeks for production as each piece is handcrafted to order.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day satisfaction guarantee. If you're not completely satisfied with your purchase, you can return it for a full refund or exchange. The bag must be in unused condition with original tags. Return shipping costs are covered for defective items.",
    },
    {
      question: "Are the bags eco-friendly?",
      answer:
        "Yes! Hemp is one of the most sustainable crops on Earth, requiring minimal water, no pesticides, and enriching the soil. Our bags are 100% biodegradable, use natural dyes, and are packaged in recycled materials. Choosing hemp helps reduce plastic waste and supports sustainable fashion.",
    },
  ];

// Custom container variant with faster stagger
const containerVariantsCustom = {
  ...containerVariants,
  visible: {
    ...containerVariants.visible,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Custom item variant with y: 20
const itemVariantsCustom = {
  ...itemVariants,
  hidden: { ...itemVariants.hidden, y: 20 },
};

export const FAQ = () => {
  const { theme, isReady } = useTheme();

  return (
    <section
      className={`py-20 relative overflow-hidden ${getThemeClass(theme, isReady, "bg-gradient-paper", "bg-[#1a1a1a]")}`}
    >
      {/* Decorative Elements */}
      <div className="absolute top-20 left-8 opacity-5 pointer-events-none">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf
            className={`w-20 h-20 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
          />
        </motion.div>
      </div>
      <div className="absolute bottom-20 right-8 opacity-5 pointer-events-none">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Mountain
            className={`w-16 h-16 ${getThemeClass(theme, isReady, "text-slate-600", "text-slate-400")}`}
          />
        </motion.div>
      </div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Heading */}
          <motion.div
            className="text-center mb-12"
            {...fadeInUp}
            viewport={viewportConfigHeader}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Leaf
                  className={`w-6 h-6 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
                />
              </motion.div>
              <h2
                className={`text-4xl md:text-5xl font-bold ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Frequently Asked Questions
              </h2>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <Mountain
                  className={`w-6 h-6 ${getThemeClass(theme, isReady, "text-slate-600", "text-slate-400")}`}
                />
              </motion.div>
            </div>
            <p
              className={`text-lg ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
            >
              Everything you need to know about our handcrafted hemp bags
            </p>
          </motion.div>

          {/* Accordion */}
          <motion.div
            variants={containerVariantsCustom}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="w-full flex flex-col items-center"
          >
            <div className="w-full max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariantsCustom}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AccordionItem
                      value={`item-${index}`}
                      className={`border relative overflow-hidden ${getThemeClass(theme, isReady, "border-border/50", "border-white/10")}`}
                    >
                      <div className="absolute top-2 right-2 opacity-5">
                        {index % 2 === 0 ? (
                          <Leaf
                            className={`w-8 h-8 ${getThemeClass(theme, isReady, "text-emerald-600", "text-emerald-400")}`}
                          />
                        ) : (
                          <Mountain
                            className={`w-8 h-8 ${getThemeClass(theme, isReady, "text-slate-600", "text-slate-400")}`}
                          />
                        )}
                      </div>
                      <AccordionTrigger className="text-left hover:no-underline relative z-10">
                        <span
                          className={`font-semibold font-inter ${getThemeClass(theme, isReady, "text-foreground", "text-white")}`}
                        >
                          {faq.question}
                        </span>
                      </AccordionTrigger>

                      <AccordionContent
                        className={`overflow-hidden font-inter leading-relaxed data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
                      >
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className={`mt-12 text-center p-6 rounded-lg border ${getThemeClass(theme, isReady, "bg-card border-border/50", "bg-[#1a1a1a] border-white/10")}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportConfig}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.02 }}
          >
            <p
              className={`mb-4 ${getThemeClass(theme, isReady, "text-muted-foreground", "text-neutral-400")}`}
            >
              Still have questions? We're here to help!
            </p>
            <motion.a
              href="mailto:support@antiquenepal.com"
              className={`font-semibold hover:underline ${getThemeClass(theme, isReady, "text-primary", "text-emerald-400")}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              support@antiquenepal.com
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
