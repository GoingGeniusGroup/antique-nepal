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
      question: "What makes Alena Collection special?",
      answer:
        "We curate versatile womenswear with thoughtful details, flattering silhouettes, and easy-to-style pieces for everyday wear and special occasions.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Domestic orders typically arrive within 3-5 business days. International shipping takes 7-14 business days depending on your location. All orders are carefully packaged using eco-friendly materials. You'll receive a tracking number once your order ships.",
    },
    {
      question: "How do I choose the right size?",
      answer:
        "Check the size guide on each product page for garment measurements and fit notes. If you need help choosing, contact our support team and include the style you are interested in.",
    },
    {
      question: "How should I care for my clothing?",
      answer:
        "Care instructions vary by fabric. Follow the care label on each garment to help maintain its color, shape, and finish.",
    },
    {
      question: "What styles do you offer?",
      answer:
        "Explore dresses, co-ord sets, outerwear, and versatile tops selected for workdays, weekends, and special occasions.",
    },
    {
      question: "How can I get help with an order?",
      answer:
        "Email hello@alenacollection.com with your order number and question, and our team will be happy to assist.",
    },
    {
      question: "What is your return policy?",
      answer:
        "Eligible items can be returned within 30 days in unused condition with original tags. See our Returns & Exchanges page for the full policy.",
    },
    {
      question: "How do I care for my clothes?",
      answer:
        "Care instructions vary by fabric. Follow the care label on each garment to help maintain its color, shape, and finish.",
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
              Everything you need to know about shopping Alena Collection
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
              Still have questions? We&apos;re here to help!
            </p>
            <motion.a
              href="mailto:support@alenacollection.com"
              className={`font-semibold hover:underline ${getThemeClass(theme, isReady, "text-primary", "text-emerald-400")}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              support@alenacollection.com
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
