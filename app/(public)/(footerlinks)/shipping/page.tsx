"use client";

import Image from "next/image";

import { Package, Truck, Globe, Clock } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";

export default function ShippingPage() {
  // 🗂️ Dictionary-style data
  const shippingData = {
    hero: {
      icon: Package,
      title: "Shipping Information",
      subtitle: "We ship worldwide with care and commitment to sustainability",
    },
    shippingTypes: [
      {
        icon: Truck,
        title: "Domestic Shipping",
        description: "Free shipping on all orders within Nepal",
        list: [
          "Delivery: 3-5 business days",
          "Tracking provided for all orders",
          "Cash on delivery available",
        ],
      },
      {
        icon: Globe,
        title: "International Shipping",
        description: "Worldwide shipping with carbon-neutral delivery",
        list: [
          "Delivery: 7-14 business days",
          "Customs duties may apply",
          "Full tracking included",
        ],
      },
    ],
    policySections: [
      {
        icon: Clock,
        title: "Processing Time",
        content:
          "All orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed the next business day. You will receive a confirmation email with tracking information once your order ships.",
      },
      {
        title: "Shipping Rates",
        content: "",
        list: [
          "Nepal: Free shipping on all orders",
          "South Asia: $10 flat rate",
          "Rest of World: $15 flat rate",
          "Express shipping available at checkout",
        ],
      },
      {
        title: "Package Care",
        content:
          "Each item is carefully wrapped in sustainable packaging to ensure it arrives in perfect condition. We use recycled materials and biodegradable packing materials whenever possible.",
      },
      {
        title: "Customs & Duties",
        content:
          "International orders may be subject to customs duties and taxes, which are the responsibility of the recipient. These charges vary by country and are not included in our shipping costs.",
      },
      {
        title: "Lost or Damaged Items",
        content:
          "If your order arrives damaged or doesn't arrive at all, please contact us within 48 hours of the expected delivery date. We'll work with you to resolve the issue promptly.",
      },
    ],
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
              <shippingData.hero.icon className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
                {shippingData.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {shippingData.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Shipping Types */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {shippingData.shippingTypes.map((type, i) => (
                <div key={i} className="bg-muted/30 p-8 rounded-lg">
                  <type.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="font-serif text-2xl font-bold mb-4 text-foreground">
                    {type.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {type.description}
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    {type.list.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Shipping Policy Sections */}
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-3xl font-bold mb-6 text-foreground">
                Shipping Policy
              </h2>
              <div className="space-y-6 text-muted-foreground">
                {shippingData.policySections.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-foreground font-semibold mb-2 flex items-center gap-2">
                      {section.icon && (
                        <section.icon className="w-5 h-5 text-primary" />
                      )}
                      {section.title}
                    </h3>
                    {section.content && <p>{section.content}</p>}
                    {section.list && (
                      <ul className="list-disc pl-6">
                        {section.list.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
