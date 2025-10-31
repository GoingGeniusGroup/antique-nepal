"use client";

import { Card } from "@/components/ui/card";
import { Leaf, Recycle, Users, Award, Globe, Heart } from "lucide-react";
import React from "react";

export const FeaturesGrid = () => {
  const features = [
    {
      icon: Leaf,
      title: "Eco-Friendly Materials",
      description:
        "100% natural hemp grown without pesticides or harmful chemicals in the Himalayan region.",
    },
    {
      icon: Recycle,
      title: "Zero Waste Process",
      description:
        "Every part of the hemp plant is utilized, ensuring minimal environmental impact.",
    },
    {
      icon: Users,
      title: "Artisan Communities",
      description:
        "Supporting over 200 skilled artisan families across rural Nepal.",
    },
    {
      icon: Award,
      title: "Premium Quality",
      description:
        "Each bag undergoes rigorous quality checks to ensure lasting durability.",
    },
    {
      icon: Globe,
      title: "Global Impact",
      description:
        "Bringing traditional Nepali craftsmanship to conscious consumers worldwide.",
    },
    {
      icon: Heart,
      title: "Made with Love",
      description:
        "Every stitch carries the dedication and pride of our master craftspeople.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container px-4">
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground font-cinzel">
            Why Choose Antique Nepal
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-inter">
            Authenticity, sustainability, and craftsmanship in every bag
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors">
                  <feature.icon className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground font-inter">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed font-inter">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
