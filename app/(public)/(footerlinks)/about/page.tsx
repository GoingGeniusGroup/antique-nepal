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
      title: "About Antique Nepal",
      subtitle:
        "We preserve centuries of Nepalese craftsmanship through sustainable, handmade hemp bags. Each piece tells a story of tradition, artistry, and environmental stewardship.",
    },
    mission: [
      {
        icon: Heart,
        title: "Our Mission",
        description:
          "To preserve traditional Nepalese craftsmanship while creating sustainable livelihoods for artisan communities.",
      },
      {
        icon: Users,
        title: "Our People",
        description:
          "Working with over 50 skilled artisans across Nepal, ensuring fair wages and safe working conditions.",
      },
      {
        icon: Leaf,
        title: "Our Impact",
        description:
          "100% eco-friendly materials, zero waste production, and carbon-neutral shipping for a better planet.",
      },
    ],
    story: {
      heading: "Our Story",
      paragraphs: [
        "Founded in the heart of Kathmandu, Antique Nepal began with a simple vision: to share the beauty of traditional Nepalese craftsmanship with the world while supporting local artisan communities.",
        "For generations, Nepalese artisans have perfected the art of working with hemp, creating durable, beautiful products that stand the test of time. Our bags are made using these time-honored techniques, passed down through families for centuries.",
        "Every purchase supports fair trade practices, sustainable farming, and the preservation of cultural heritage. We work directly with artisan cooperatives, ensuring that the majority of profits go directly to the craftspeople and their communities.",
      ],
      button: {
        label: "Meet Our Artisans",
        href: "/artisans",
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
