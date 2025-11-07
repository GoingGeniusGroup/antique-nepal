"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavigationLink } from "@/components/navigation-link";
import { motion } from "framer-motion";

import paperTexture from "@/public/paper-texture.jpg";
import hempField from "@/public/hemp-field.jpg";
import workshop from "@/public/workshop.jpg";
import artisanHands from "@/public/artisan-hands.jpg";

const storyCategories = [
  {
    title: "Our Heritage",
    description: "Centuries of tradition",
    image: hempField,
    href: "/our-heritage",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Artisan Stories",
    description: "Meet our craftspeople",
    image: artisanHands,
    href: "/artisans",
    gradient: "from-blue-500/20 to-purple-500/20",
  },
  {
    title: "Sustainability",
    description: "Our eco commitment",
    image: hempField,
    href: "/sustainability",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Our Workshop",
    description: "Where tradition meets craft",
    image: workshop,
    href: "/workshop",
    gradient: "from-rose-500/20 to-pink-500/20",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

export default function StoriesHub() {
  return (
    <div className="min-h-screen bg-background">
      <ThemeToggle variant="fixed" position="right-4 top-24" />

      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image
            src={paperTexture}
            alt="Paper background texture"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className="container relative">
          <motion.div
            className="max-w-4xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              Our Journey
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl text-foreground font-bold tracking-tight">
              Our Stories
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Discover the heart and soul behind every handcrafted piece. From
              ancient traditions to sustainable practices, explore the stories
              that make us who we are.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {storyCategories.map((story) => (
              <motion.div key={story.href} variants={itemVariants}>
                <NavigationLink href={story.href}>
                  <Card className="overflow-hidden border-border/50 hover:shadow-elegant transition-all duration-500 group cursor-pointer h-full">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-subtle">
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${story.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />
                    </div>

                    <div className="p-8 space-y-2">
                      <h3 className="font-serif text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {story.title}
                      </h3>
                      <p className="text-lg text-muted-foreground">
                        {story.description}
                      </p>
                    </div>
                  </Card>
                </NavigationLink>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            className="max-w-3xl mx-auto text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground">
              Every Bag Tells a Story
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Behind every thread, every stitch, and every design lies a rich
              tapestry of culture, craftsmanship, and care. These are the
              stories that transform our bags from products into treasured
              pieces of heritage.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}