"use client";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Leaf, Droplets, Recycle, Sun, TreePine, Wind } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";
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
                Style Edit
              </AnimatedBadge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-serif text-5xl md:text-7xl text-foreground font-bold tracking-tight"
            >
              A Wardrobe with Possibilities
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              Discover modern styles and versatile essentials selected to make
              everyday dressing feel effortless and personal.
            </motion.p>
          </motion.div>
        </div>
      </motion.section>

      {/* Collection highlights */}
      <AnimatedSection className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-12">
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Pieces to Wear Your Way
              </h2>
              <p className="text-lg text-muted-foreground">
                Build looks for workdays, weekends, and every moment in between.
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
                  Easy to Wear
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Find flattering silhouettes and comfortable styles that feel
                  natural in your everyday wardrobe.
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
                  Made to Mix
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Pair coordinated sets, dresses, and layers to create looks
                  that feel polished and personal.
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
                  Thoughtful Details
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Discover considered finishes and details that bring each
                  outfit together.
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
                  Style for Every Occasion
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Explore versatile pieces for daily plans, special moments,
                  and everything in between.
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
                The Alena Collection Edit
              </h2>
              <p className="text-lg text-muted-foreground">
                Modern silhouettes, everyday essentials, and polished occasion
                styles.
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
                  src={paperTexture}
                  alt="Alena Collection design texture"
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
                      Everyday Essentials
                    </h3>
                    <p className="text-muted-foreground">
                      Discover easy-to-style pieces that help you create
                      effortless looks for your day.
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
                      Modern Silhouettes
                    </h3>
                    <p className="text-muted-foreground">
                      Find flattering shapes and coordinated styles that feel
                      polished for any occasion.
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
                      Thoughtful Finishing Touches
                    </h3>
                    <p className="text-muted-foreground">
                      Explore details and layers that make it easy to express
                      your personal style.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Style categories */}
      <AnimatedSection className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={itemVariants}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Explore the Collection
              </h2>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center"
            >
              {[
                { number: "01", text: "Dresses & Sets" },
                { number: "02", text: "Everyday Essentials" },
                { number: "03", text: "Statement Layers" },
                { number: "04", text: "Finishing Details" },
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

      {/* Brand message */}
      <AnimatedSection className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div variants={itemVariants}>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Discover Your Style
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground"
            >
              Find a considered edit of modern womenswear, curated for the way
              you want to feel.
            </motion.p>

            <motion.div
              variants={containerVariants}
              className="flex flex-wrap justify-center gap-6 pt-8"
            >
              {[
                "Dresses",
                "Co-ord Sets",
                "Outerwear",
                "Wardrobe Essentials",
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
