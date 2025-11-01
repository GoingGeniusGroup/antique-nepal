"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Leaf, Heart, Sparkles } from "lucide-react";
import hempBag from "@/public/hemp-bag-1 1.png";
import { motion } from "framer-motion";

export default function ProductShowcase() {
  const features = [
    {
      icon: Leaf,
      title: "100% Natural Hemp",
      description:
        "Sustainable and eco-friendly material sourced from the Himalayan region",
    },
    {
      icon: Heart,
      title: "Handcrafted with Love",
      description: "Each bag is uniquely crafted by skilled Nepali artisans",
    },
    {
      icon: Sparkles,
      title: "Traditional Design",
      description:
        "Inspired by ancient Nepali paper-making and weaving traditions",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-paper">
      <div className="container px-4">
        {/* Section Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            Our Signature Collection
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every piece tells a story of heritage, sustainability, and
            craftsmanship
          </p>
        </motion.div>

        {/* Image and Features */}
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-[#f3f0ed]  rounded-3xl flex items-center justify-center shadow-inner">
              <Image
                src={hempBag}
                alt="Handcrafted hemp bag with traditional Nepali patterns"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05, boxShadow: '0 8px 30px hsl(28 35% 15% / 0.12)' }}>
                  <Card className="p-6 bg-card border-border hover:shadow-soft transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-secondary rounded-lg">
                        <Icon className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2 text-foreground">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
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
    </section>
  );
}
