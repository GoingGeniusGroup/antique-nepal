"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

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
              The Alena Collection Story
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A modern wardrobe edit designed to make everyday dressing feel
              effortless, polished, and personal.
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
                <Badge variant="outline">The Vision</Badge>
                <h2 className="font-serif text-4xl font-bold text-foreground">
                  Style Made Simple
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Alena Collection brings together modern, feminine pieces with
                  flattering silhouettes and wearable details for everyday life.
                </p>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-elegant">
                <Image
                  src={paperTexture}
                  alt="Textural inspiration for the collection"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 1950s */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 md:order-2">
                <Badge variant="outline">The Collection</Badge>
                <h2 className="font-serif text-4xl font-bold text-foreground">
                  Pieces to Make Your Own
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  From versatile dresses and coordinated sets to statement
                  outerwear, each edit is selected to work across your wardrobe.
                </p>
              </div>

              <div className="relative aspect-video rounded-lg overflow-hidden shadow-elegant md:order-1">
                <Image
                  src={paperTexture}
                  alt="Collection inspiration"
                  fill
                  className="object-cover"
                />
              </div>
              
            </div>

            {/* Today */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline">Today</Badge>
                <h2 className="font-serif text-4xl font-bold text-foreground">
                  Made for Every Moment
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Find polished looks for workdays, weekends, and special
                  occasions, with considered details that feel unmistakably
                  yours.
                </p>
              </div>
              <div className="relative aspect-video rounded-lg overflow-hidden shadow-elegant">
                <Image
                  src={paperTexture}
                  alt="Details that inspire the collection"
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
                The Alena Collection approach
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Value Cards */}
              <Card className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🌱</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold">
                  Thoughtful Style
                </h3>
                <p className="text-muted-foreground">
                  Discover versatile pieces selected to complement your personal
                  style.
                </p>
              </Card>

              <Card className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold">
                  Effortless Dressing
                </h3>
                <p className="text-muted-foreground">
                  Find easy-to-style looks for everyday plans and special
                  occasions.
                </p>
              </Card>

              <Card className="p-8 space-y-4 border-border/50 hover:shadow-elegant transition-all">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-serif text-2xl font-semibold">Quality</h3>
                <p className="text-muted-foreground">
                  Explore flattering silhouettes, considered details, and
                  polished finishes.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
