"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Hammer, Heart } from "lucide-react";
import collectionTexture from "@/public/paper-texture.jpg";
import { ThemeToggle } from "@/components/theme-toggle";

const Workshop = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <ThemeToggle variant="fixed" position="right-4 top-24" />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src={collectionTexture}
          alt="Alena Collection design texture"
          className="object-cover"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold font-cinzel text-white mb-4">
            Behind the Collection
          </h1>
          <p className="text-xl md:text-2xl font-inter text-white/90 max-w-2xl mx-auto">
            A considered edit of modern, feminine pieces
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold font-cinzel mb-6">
            The Alena Edit
          </h2>
          <p className="text-lg text-muted-foreground font-inter leading-relaxed">
            Explore versatile dresses, coordinated sets, and statement layers
            selected to make everyday dressing feel polished and personal.
            Discover thoughtful details and easy-to-style pieces for every
            occasion.
          </p>
        </div>
      </section>

      {/* Workshop Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Versatile Silhouettes",
                desc: "Explore flattering shapes and modern styles that work across your wardrobe.",
              },
              {
                icon: Hammer,
                title: "Considered Details",
                desc: "Find polished finishes and thoughtful touches that bring each look together.",
              },
              {
                icon: Heart,
                title: "Effortless Styling",
                desc: "Build looks for workdays, weekends, and special moments with pieces that are easy to make your own.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-8 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-cinzel font-bold mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-inter">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold font-cinzel text-center mb-16">
            From Inspiration to Your Wardrobe
          </h2>

          <div className="space-y-20">
            {[
              {
                step: "Step 01",
                title: "Discover Your Style",
                desc: "Start with a considered edit of dresses, co-ord sets, outerwear, and wardrobe essentials.",
                image: collectionTexture,
                reverse: true,
              },
              {
                step: "Step 02",
                title: "Choose Versatile Pieces",
                desc: "Pair modern silhouettes and coordinated styles to create looks that feel polished from morning to evening.",
                image: collectionTexture,
              },
              {
                step: "Step 03",
                title: "Make It Your Own",
                desc: "Complete your look with thoughtful details and pieces that reflect your personal style.",
                image: collectionTexture,
                reverse: true,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  step.reverse ? "md:flex-row-reverse" : ""
                }`}
              >
                <div>
                  <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-3xl font-cinzel font-bold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 font-inter leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="relative w-full h-[400px] rounded-lg shadow-lg">
                  <Image
                    src={step.image}
                    alt=""
                    className="object-cover rounded-lg"
                    fill
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-cinzel font-bold mb-6">
            Find Your Next Favorite
          </h2>
          <p className="text-xl font-inter mb-8 opacity-90">
            Explore modern wardrobe essentials, effortless dresses, and
            coordinated styles curated for you.
          </p>
          <Button asChild size="lg" variant="secondary" className="group font-inter">
            <Link href="/products">
              Shop Our Collection
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Workshop;
