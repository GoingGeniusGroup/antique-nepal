"use client";

import { Card } from "@/components/ui/card";
import { Sprout, Droplet, Wind, TreePine } from "lucide-react";

export const Sustainability = () => {
  const impacts = [
    {
      icon: Sprout,
      metric: "80%",
      label: "Less CO2 than Cotton",
      description: "Hemp absorbs CO2 as it grows, making it carbon-negative",
    },
    {
      icon: Droplet,
      metric: "500L",
      label: "Water Saved per Bag",
      description: "Hemp requires 50% less water than cotton production",
    },
    {
      icon: Wind,
      metric: "Zero",
      label: "Pesticide Use",
      description: "Naturally pest-resistant, no harmful chemicals needed",
    },
    {
      icon: TreePine,
      metric: "5x",
      label: "Stronger than Cotton",
      description: "More durable, lasts longer, reduces waste",
    },
  ];

  return (
    <section id="sustainability" className="py-20 bg-gradient-paper">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16 animate-fade-in">
            <h2
              className="text-4xl md:text-5xl font-bold mb-4 text-foreground"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Our Environmental Commitment
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every bag you carry makes a positive impact on our planet
            </p>
          </div>

          {/* Impact Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {impacts.map((impact, index) => (
              <Card
                key={index}
                className="p-6 bg-card border-border text-center hover:shadow-soft transition-all duration-300 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <impact.icon className="w-6 h-6 text-secondary" />
                </div>
                <div
                  className="text-4xl font-bold text-primary mb-2"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  {impact.metric}
                </div>
                <div className="font-semibold text-foreground mb-2">
                  {impact.label}
                </div>
                <p className="text-sm text-muted-foreground">
                  {impact.description}
                </p>
              </Card>
            ))}
          </div>

          {/* Feature Card */}
          <Card className="p-10 bg-card border-border shadow-soft animate-slide-up">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3
                  className="text-3xl font-bold mb-4 text-foreground"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  Hemp: Nature's Miracle Fiber
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Hemp is one of the most sustainable materials on Earth. It
                  grows quickly, improves soil health, and requires minimal
                  resources. The plant naturally resists pests and diseases,
                  eliminating the need for harmful pesticides.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  By choosing hemp products, you're supporting regenerative
                  agriculture and helping to reduce the fashion industry's
                  environmental footprint. Each bag represents a step toward a
                  more sustainable future.
                </p>
              </div>
              <div className="bg-secondary/10 rounded-2xl p-8">
                <h4 className="text-xl font-semibold mb-6 text-foreground">
                  Environmental Benefits
                </h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                    <span>Biodegradable and compostable at end of life</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                    <span>Improves soil structure for future crops</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                    <span>Produces more fiber per acre than trees</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2" />
                    <span>
                      Natural UV protection and antimicrobial properties
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
