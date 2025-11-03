"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, Users, Award } from "lucide-react";

import paperTexture from "@/public/paper-texture.jpg";
import artisanHands from "@/public/artisan-hands.jpg";
import workshop from "@/public/workshop.jpg";

const artisans = [
  {
    name: "Devi Sharma",
    role: "Master Weaver",
    experience: "35 years",
    story:
      "Devi learned the art of hemp weaving from her grandmother at age 12. Her intricate patterns have won national awards and her techniques are now taught to the next generation.",
    image: "/placeholder.svg",
  },
  {
    name: "Ram Bahadur",
    role: "Hemp Cultivator",
    experience: "28 years",
    story:
      "Ram manages our organic hemp farms in the mountain valleys. His sustainable farming practices ensure the highest quality fibers while protecting the environment.",
    image: "/placeholder.svg",
  },
  {
    name: "Sita Thapa",
    role: "Natural Dye Specialist",
    experience: "22 years",
    story:
      "Sita creates our signature colors using only plant-based dyes. Her knowledge of traditional dyeing methods produces rich, long-lasting hues.",
    image: "/placeholder.svg",
  },
  {
    name: "Krishna Gurung",
    role: "Senior Craftsman",
    experience: "30 years",
    story:
      "Krishna specializes in bag construction and finishing. His attention to detail ensures every bag meets our exacting standards.",
    image: "/placeholder.svg",
  },
  {
    name: "Maya Tamang",
    role: "Embroidery Artist",
    experience: "18 years",
    story:
      "Maya's delicate embroidery work adds unique character to our premium collection. Each piece tells a story through traditional Nepali motifs.",
    image: "/placeholder.svg",
  },
  {
    name: "Prakash Rai",
    role: "Quality Master",
    experience: "25 years",
    story:
      "Prakash oversees quality control, ensuring every product honors our heritage of excellence. His trained eye catches even the smallest imperfections.",
    image: "/placeholder.svg",
  },
];

export default function Artisans() {
  return (
    <div className="min-h-screen bg-background">
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
              Meet the Masters
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl text-foreground font-bold tracking-tight">
              Our Artisan Stories
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Every bag is a collaboration between skilled hands and passionate
              hearts. Meet the artisans who bring our heritage to life.
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
              <div className="text-4xl font-bold text-primary">47</div>
              <p className="text-muted-foreground">Skilled Artisans</p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">800+</div>
              <p className="text-muted-foreground">Years Combined Experience</p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary">3</div>
              <p className="text-muted-foreground">Generations of Mastery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Artisan Profiles */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artisans.map((artisan, index) => (
              <Card
                key={index}
                className="overflow-hidden border-border/50 hover:shadow-elegant transition-all group"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-subtle">
                  <Image
                    src={artisan.image}
                    alt={artisan.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      {artisan.name}
                    </h3>
                    <p className="text-primary font-medium">{artisan.role}</p>
                    <Badge variant="outline" className="mt-2">
                      {artisan.experience}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {artisan.story}
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
                Inside Our Workshop
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our workshop in Kathmandu is more than a workplace—it's a
                community. Artisans work in bright, comfortable conditions with
                fair wages, health benefits, and opportunities for skill
                development.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that great craftsmanship comes from happy
                craftspeople. That's why we invest in our artisans' wellbeing,
                education, and growth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-elegant">
                <Image
                  src={workshop}
                  alt="Workshop"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square rounded-lg overflow-hidden shadow-elegant mt-8">
                <Image
                  src={artisanHands}
                  alt="Artisan hands"
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
