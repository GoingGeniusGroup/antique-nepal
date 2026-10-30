"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, Users, Award } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

import paperTexture from "@/public/paper-texture.jpg";

const styleNotes = [
  {
    name: "The Everyday Edit",
    role: "Versatile Wardrobe Staples",
    experience: "Easy to style",
    story:
      "Build polished everyday looks with modern essentials, flattering silhouettes, and pieces that work together.",
    image: paperTexture,
  },
  {
    name: "Occasion Dressing",
    role: "Looks for Your Moments",
    experience: "Make an impression",
    story:
      "Discover feminine dresses and coordinated styles for celebrations, evenings out, and moments worth remembering.",
    image: paperTexture,
  },
  {
    name: "Comfortable Layers",
    role: "Modern Outerwear",
    experience: "Layer with ease",
    story:
      "Add a polished finishing layer to your look with versatile pieces designed to complement your wardrobe.",
    image: paperTexture,
  },
  {
    name: "Coordinated Looks",
    role: "Effortless Co-ord Sets",
    experience: "Style in a moment",
    story:
      "Matching pieces make getting dressed simple while giving you the freedom to wear each piece your own way.",
    image: paperTexture,
  },
  {
    name: "Color & Detail",
    role: "Thoughtful Finishing Touches",
    experience: "Make it personal",
    story:
      "Explore refined details and fresh colors that help every outfit feel polished and unmistakably yours.",
    image: paperTexture,
  },
  {
    name: "Your Signature Style",
    role: "Pieces to Make Your Own",
    experience: "Find your favorites",
    story:
      "Create a wardrobe that feels personal with versatile styles for workdays, weekends, and special occasions.",
    image: paperTexture,
  },
];

export default function Artisans() {
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
              Style Notes
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl text-foreground font-bold tracking-tight">
              A Wardrobe to Make Your Own
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Explore versatile pieces, modern silhouettes, and styling ideas
              for every part of your day.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">01</div>
              <p className="text-muted-foreground">Find Your Fit</p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">02</div>
              <p className="text-muted-foreground">Build Your Wardrobe</p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">03</div>
              <p className="text-muted-foreground">Make It Your Own</p>
            </div>
          </div>
        </div>
      </section>

      {/* Style inspiration */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {styleNotes.map((styleNote, index) => (
              <Card
                key={index}
                className="overflow-hidden border-border/50 hover:shadow-elegant transition-all group"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-subtle">
                  <Image
                    src={styleNote.image}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      {styleNote.name}
                    </h3>
                    <p className="text-primary font-medium">{styleNote.role}</p>
                    <Badge variant="outline" className="mt-2">
                      {styleNote.experience}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {styleNote.story}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="space-y-6">
              <Badge variant="secondary">Behind the Scenes</Badge>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                The Alena Collection Edit
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Alena Collection brings together modern, feminine pieces
                selected for flattering silhouettes and wearable details.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                From versatile dresses and coordinated sets to statement
                outerwear, discover polished looks for work, weekends, and
                special moments.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-elegant">
                <Image
                  src={paperTexture}
                  alt="Alena Collection design texture"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-elegant mt-8">
                <Image
                  src={paperTexture}
                  alt="Alena Collection design texture"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
