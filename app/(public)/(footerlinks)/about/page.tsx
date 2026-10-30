"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Mountain, Heart, Users, Leaf } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";

export default function AboutPage() {
  // 🗂️ Dictionary-style About page content
  const aboutData = {
    hero: {
      icon: Mountain,
      title: "About Alena Collection",
      subtitle:
        "Alena Collection brings together modern womenswear designed to make everyday dressing feel effortless, polished, and personal.",
    },
    mission: [
      {
        icon: Heart,
        title: "Our Mission",
        description:
          "To make considered, versatile womenswear accessible for every day and every occasion.",
      },
      {
        icon: Users,
        title: "Our People",
        description:
          "Curating flattering silhouettes, thoughtful details, and versatile pieces that work across your wardrobe.",
      },
      {
        icon: Leaf,
        title: "Our Impact",
        description:
          "We share clear product and care information to help you choose pieces you will love wearing.",
      },
    ],
    story: {
      heading: "Our Story",
      paragraphs: [
        "Alena Collection began with a simple vision: make it easier to find modern, feminine pieces that feel as good to wear as they look.",
        "From versatile dresses and coordinated sets to statement outerwear, our collection is curated to help you create confident looks for work, weekends, and special moments.",
        "We believe personal style should feel effortless. Each collection brings together wearable silhouettes, considered details, and pieces you can make your own.",
      ],
      button: {
        label: "Explore the Collection",
        href: "/products",
      },
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Image
              src={paperTexture}
              alt="Paper texture background"
              fill
              className="object-cover"
            />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <aboutData.hero.icon className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
                {aboutData.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {aboutData.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {aboutData.mission.map((item, idx) => (
                <div key={idx} className="text-center p-8">
                  <item.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-serif text-2xl font-bold mb-4">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-4xl font-bold mb-8 text-center">
              {aboutData.story.heading}
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
              {aboutData.story.paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button size="lg" asChild>
                <a href={aboutData.story.button.href}>
                  {aboutData.story.button.label}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
