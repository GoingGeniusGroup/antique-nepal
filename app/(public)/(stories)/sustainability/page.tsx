"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Leaf, Droplets, Recycle, Sun, TreePine, Wind } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";
import hempField from "@/public/hemp-field.jpg";
import { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

// Framer Motion imports

import { backOut, easeInOut, easeOut, motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      duration: 0.8,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: easeOut,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: easeInOut,
    },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: easeOut,
    },
  },
};

const numberVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: backOut,
    },
  },
};

// Animated components
const AnimatedBadge = motion(Badge);
const AnimatedCard = motion(Card);
const AnimatedImage = motion(Image);

// Reusable animated section component

const AnimatedSection = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SustainabilityPage = () => {
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <ThemeToggle variant="fixed" position="right-4 top-24" />
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative pt-32 pb-20 overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 opacity-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1.5 }}
        >
          <Image src={paperTexture} alt="" className="object-cover" fill />
        </motion.div>

        <div className="container relative">
          <motion.div
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <motion.div variants={itemVariants}>
              <AnimatedBadge
                variant="secondary"
                className="mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Sustainability
              </AnimatedBadge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl md:text-7xl text-foreground font-bold tracking-tight"
            >
              Our Eco Commitment
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              Every thread tells a story of responsibility, from seed to
              finished product. We're committed to protecting the planet that
              sustains us.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Hemp Benefits Section */}
      <AnimatedSection className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Why Hemp?
              </h2>
              <p className="text-lg text-muted-foreground">
                Hemp is one of the most sustainable materials on Earth
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-2 gap-8"
            >
              <AnimatedCard
                variants={cardVariants}
                whileHover="hover"
                className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Droplets className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="font-serif text-2xl font-semibold">
                  Water Efficient
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hemp requires 50% less water than cotton and grows naturally
                  without irrigation in most climates.
                </p>
              </AnimatedCard>

              <AnimatedCard
                variants={cardVariants}
                whileHover="hover"
                className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <TreePine className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="font-serif text-2xl font-semibold">
                  Carbon Negative
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Hemp absorbs more CO2 per hectare than any forest or
                  commercial crop, making it carbon negative.
                </p>
              </AnimatedCard>

              <AnimatedCard
                variants={cardVariants}
                whileHover="hover"
                className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Leaf className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="font-serif text-2xl font-semibold">
                  No Pesticides
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our hemp is grown organically without harmful pesticides or
                  herbicides, protecting soil and water.
                </p>
              </AnimatedCard>

              <AnimatedCard
                variants={cardVariants}
                whileHover="hover"
                className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Recycle className="w-12 h-12 text-primary" />
                </motion.div>
                <h3 className="font-serif text-2xl font-semibold">
                  Biodegradable
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Unlike synthetic materials, hemp naturally biodegrades,
                  leaving no harmful microplastics behind.
                </p>
              </AnimatedCard>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Our Practices Section */}
      <AnimatedSection className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Our Sustainable Practices
              </h2>
              <p className="text-lg text-muted-foreground">
                From farm to finished product, sustainability guides every
                decision
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-2 gap-12 items-center mb-16"
            >
              <motion.div
                variants={imageVariants}
                className="relative aspect-video rounded-lg overflow-hidden shadow-elegant"
              >
                <Image
                  src={hempField}
                  alt="Hemp field"
                  className="object-cover"
                  fill
                />
              </motion.div>

              <motion.div variants={containerVariants} className="space-y-6">
                <motion.div variants={itemVariants} className="flex gap-4">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Sun className="w-8 h-8 text-primary shrink-0" />
                  </motion.div>
                  <div>
                    <h3 className="font-serif text-2xl font-semibold mb-2">
                      Organic Farming
                    </h3>
                    <p className="text-muted-foreground">
                      Our hemp is grown in the pristine Himalayan foothills
                      using traditional organic methods passed down through
                      generations.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex gap-4">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Droplets className="w-8 h-8 text-primary shrink-0" />
                  </motion.div>
                  <div>
                    <h3 className="font-serif text-2xl font-semibold mb-2">
                      Natural Dyeing
                    </h3>
                    <p className="text-muted-foreground">
                      We use only plant-based dyes made from flowers, roots, and
                      bark. No synthetic chemicals touch our fabrics.
                    </p>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants} className="flex gap-4">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Wind className="w-8 h-8 text-primary shrink-0" />
                  </motion.div>
                  <div>
                    <h3 className="font-serif text-2xl font-semibold mb-2">
                      Zero Waste
                    </h3>
                    <p className="text-muted-foreground">
                      Every scrap of fabric is used. Offcuts become smaller
                      items, and natural fibers return to the soil as compost.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Impact Numbers */}
      <AnimatedSection className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Our Impact in 2024
              </h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
            >
              {[
                { number: "15,000kg", text: "CO2 Offset" },
                { number: "2M", text: "Liters Water Saved" },
                { number: "Zero", text: "Synthetic Chemicals" },
                { number: "100%", text: "Biodegradable" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={numberVariants}
                  whileHover={{ scale: 1.05 }}
                  className="space-y-3"
                >
                  <div className="text-5xl font-bold text-primary">
                    {item.number}
                  </div>
                  <p className="text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Certifications */}
      <AnimatedSection className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div variants={itemVariants}>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Certified Sustainable
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground"
            >
              Our commitment to sustainability is verified by leading
              certification bodies
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="flex flex-wrap justify-center gap-6 pt-8"
            >
              {[
                "GOTS Certified",
                "Fair Trade",
                "Organic Hemp",
                "Carbon Neutral",
              ].map((cert, index) => (
                <motion.div
                  key={cert}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    y: -2,
                    transition: { type: "spring", stiffness: 400 },
                  }}
                >
                  <Badge variant="outline" className="text-lg py-3 px-6">
                    {cert}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default SustainabilityPage;
