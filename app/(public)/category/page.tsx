"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import paperTexture from "@/public/paper-texture.jpg";
import toteBagImg from "@/public/hemp-bag-1.jpg";
import backpackImg from "@/public/hemp-bag-2.jpg";
import shoulderBagImg from "@/public/hemp-bag-3.jpg";
import clutchImg from "@/public/artisan-hands.jpg";
import { useEffect, useState } from "react";
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  color?: string;
  count?: number;
}

// 🗂️ Dictionary-style data with slugs
const pageData = {
  hero: {
    title: "Our Collections",
    subtitle:
      "Explore our curated selection of handcrafted hemp bags, each category telling its own story of tradition and sustainability",
    background: paperTexture,
  },
  whyChoose: [
    {
      icon: "🌿",
      title: "100% Natural",
      description: "Crafted from pure Himalayan hemp fiber",
      bgColor: "bg-hemp/20",
    },
    {
      icon: "✋",
      title: "Handcrafted",
      description: "Made by skilled Nepali artisans",
      bgColor: "bg-mountain/20",
    },
    {
      icon: "♻️",
      title: "Sustainable",
      description: "Eco-friendly and biodegradable",
      bgColor: "bg-terracotta/20",
    },
  ],
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Theme Toggle */}
      <ThemeToggle variant="fixed" position="right-4 top-24" />
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <Image
            src={pageData.hero.background}
            alt="Background texture"
            fill
            className="object-cover"
          />
        </div>
        <div className="container px-4 relative z-10 mx-auto text-center max-w-3xl space-y-6">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-foreground tracking-tight">
            {pageData.hero.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {pageData.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 relative">
        <div className="absolute inset-0 opacity-20">
          <Image
            src={pageData.hero.background}
            alt="Background texture"
            fill
            className="object-cover"
          />
        </div>
        <div className="container px-4 relative z-10 mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`} // Use slug for dynamic routing
              className="group block"
            >
              <Card className="overflow-hidden border-2 hover:border-primary transition-all duration-300 hover:shadow-elegant h-full">
                <div className="relative h-80 overflow-hidden">
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={category.image ?? "/hemp-bag-1.jpg"}
                      alt={category.name}
                      fill // fill the parent div
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />
                  <div
                    className={`absolute top-4 right-4 ${category.color} backdrop-blur-sm px-4 py-2 rounded-full`}
                  >
                    <span className="font-serif text-sm font-semibold text-foreground">
                      {category.count} Products
                    </span>
                  </div>
                </div>
                <CardContent className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-3xl text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <ArrowRight className="w-6 h-6 text-primary transform group-hover:translate-x-2 transition-transform" />
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto max-w-4xl text-center space-y-12">
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">
            Why Choose Our Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pageData.whyChoose.map((item, idx) => (
              <div key={idx} className="space-y-4">
                <div
                  className={`w-16 h-16 rounded-full ${item.bgColor} flex items-center justify-center mx-auto`}
                >
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-serif text-xl text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoriesPage;
