"use client";

import Image from "next/image";

import { RefreshCw, Shield, CheckCircle } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";
import { Button } from "@/components/ui/button";

export default function ReturnsPage() {
  // 🗂️ Dictionary-style data
  const returnsData = {
    hero: {
      icon: RefreshCw,
      title: "Returns & Exchanges",
      subtitle:
        "Your satisfaction is our priority. Easy returns within 30 days.",
    },
    quickCards: [
      {
        icon: Shield,
        title: "30-Day Returns",
        description: "Full refund or exchange within 30 days",
      },
      {
        icon: RefreshCw,
        title: "Free Exchanges",
        description: "No fees for size or style exchanges",
      },
      {
        icon: CheckCircle,
        title: "Easy Process",
        description: "Simple online return initiation",
      },
    ],
    policySections: [
      {
        title: "Eligibility",
        content: "To be eligible for a return, your item must be:",
        list: [
          "Unused and in the same condition you received it",
          "In the original packaging with all tags attached",
          "Returned within 30 days of delivery",
          "Accompanied by proof of purchase",
        ],
      },
      {
        title: "How to Return",
        content: "",
        list: [
          "Contact our customer service at hello@antiquenepal.com",
          "Provide your order number and reason for return",
          "Receive return authorization and shipping label",
          "Pack your item securely with all original materials",
          "Ship the package using the provided label",
        ],
      },
      {
        title: "Refunds",
        content:
          "Once we receive your return, we'll inspect the item and process your refund within 5-7 business days. Refunds will be issued to your original payment method. Please note that shipping costs are non-refundable unless the return is due to our error.",
      },
      {
        title: "Exchanges",
        content:
          "If you'd like to exchange an item for a different size or style, we'll ship your new item free of charge once we receive your return. Exchange processing typically takes 3-5 business days.",
      },
      {
        title: "Damaged or Defective Items",
        content:
          "If you receive a damaged or defective item, please contact us immediately with photos. We'll arrange for a replacement or full refund, including return shipping costs.",
      },
    ],
    contactButton: {
      text: "Contact Customer Service",
      href: "/contact",
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
              <returnsData.hero.icon className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
                {returnsData.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {returnsData.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Info Cards */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {returnsData.quickCards.map((card, i) => (
                <div key={i} className="text-center p-6 bg-muted/30 rounded-lg">
                  <card.icon className="w-10 h-10 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold mb-2 text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Detailed Policy */}
            <div className="prose prose-lg max-w-none">
              <h2 className="font-serif text-3xl font-bold mb-6 text-foreground">
                Return Policy
              </h2>
              <div className="space-y-6 text-muted-foreground">
                {returnsData.policySections.map((section, i) => (
                  <div key={i}>
                    <h3 className="text-foreground font-semibold mb-2">
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

              {/* Contact Button */}
              <div className="mt-12 text-center">
                <Button size="lg" asChild>
                  <a href={returnsData.contactButton.href}>
                    {returnsData.contactButton.text}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
