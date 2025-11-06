"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

import hempField from "@/public/hemp-field.jpg";
import workshop from "@/public/workshop.jpg";
import artisanHands from "@/public/artisan-hands.jpg";
import paperTexture from "@/public/paper-texture.jpg";

export default function Heritage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <ThemeToggle variant="fixed" position="right-4 top-24" />
      {/* Hero Section */}
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
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Badge variant="secondary" className="mb-4">
              Our Story
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl text-foreground font-bold tracking-tight">
              Centuries of Tradition
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              From the mountains of Nepal to your hands, our heritage is woven
              into every thread.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto space-y-16">
            {/* 1800s */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline">1800s</Badge>
                <h2 className="font-serif text-4xl font-bold text-foreground">
                  Ancient Beginnings
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Hemp weaving has been practiced in the Himalayan foothills for
                  centuries. Our ancestors discovered that the mountain climate
                  produced the strongest, most durable hemp fibers in the world.
                </p>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-elegant">
                <Image
                  src={hempField}
                  alt="Hemp fields"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 1950s */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-elegant md:order-1">
                <Image
                  src={workshop}
                  alt="Traditional workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-6 md:order-0">
                <Badge variant="outline">1950s</Badge>
                <h2 className="font-serif text-4xl font-bold text-foreground">
                  Family Tradition
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Our family workshop was established in the heart of Kathmandu
                  valley. Three generations have passed down the sacred
                  techniques of hemp cultivation and traditional weaving
                  patterns.
                </p>
              </div>
            </div>

            {/* Today */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline">Today</Badge>
                <h2 className="font-serif text-4xl font-bold text-foreground">
                  Modern Craftsmanship
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We honor our heritage while embracing sustainable practices.
                  Each bag is handcrafted by skilled artisans using time-honored
                  techniques combined with contemporary design sensibilities.
                </p>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-elegant">
                <Image
                  src={artisanHands}
                  alt="Artisan at work"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-4">
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Our Values
              </h2>
              <p className="text-lg text-muted-foreground">
                Principles that guide every stitch
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Value Cards */}
              <Card className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold">
                  Sustainability
                </h3>
                <p className="text-muted-foreground">
                  We use only organic hemp and natural dyes, ensuring minimal
                  environmental impact.
                </p>
              </Card>

              <Card className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold">
                  Fair Trade
                </h3>
                <p className="text-muted-foreground">
                  Every artisan receives fair wages and works in safe, dignified
                  conditions.
                </p>
              </Card>

              <Card className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold">Quality</h3>
                <p className="text-muted-foreground">
                  We never compromise on craftsmanship. Each piece is made to
                  last generations.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
