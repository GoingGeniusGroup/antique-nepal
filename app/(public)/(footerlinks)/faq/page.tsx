"use client";

import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";

export default function FAQPage() {
  // 🗂️ Dictionary-style FAQ data
  const faqData = {
    hero: {
      icon: HelpCircle,
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about our products and services",
    },
    faqs: [
      {
        question: "What styles do you offer?",
        answer:
          "Explore dresses, co-ord sets, outerwear, and versatile tops selected for workdays, weekends, and special occasions.",
      },
      {
        question: "How do I choose the right size?",
        answer:
          "Check the size guide and fit notes on each product page. If you need help, contact our support team with the style you are interested in.",
      },
      {
        question: "How should I care for my clothing?",
        answer:
          "Care instructions vary by fabric. Follow the care label on each garment to help maintain its color, shape, and finish.",
      },
      {
        question: "Do you offer custom orders?",
        answer:
          "For product or order help, email hello@alenacollection.com and our team will be happy to assist.",
      },
      {
        question: "Are your products ethically made?",
        answer:
          "We select versatile styles with thoughtful details to help you build a wardrobe that feels personal and easy to wear.",
      },
      {
        question: "What's your environmental impact?",
        answer:
          "We share fabric and care details on product pages so you can make an informed choice before you order.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Delivery times depend on your location. We will share available shipping options and tracking details for your order.",
      },
      {
        question: "What if my order arrives damaged?",
        answer:
          "Please contact us with your order number and photos of the issue so our team can help resolve it.",
      },
      {
        question: "Can I return or exchange my purchase?",
        answer:
          "Eligible items can be returned within 30 days in unused condition with original tags. See our Returns & Exchanges page for details.",
      },
      {
        question: "Do you have a physical store?",
        answer:
          "Please visit our Contact page for the latest ways to reach our team.",
      },
    ],
    contactCTA: {
      title: "Still have questions?",
      subtitle: "Our customer service team is here to help",
      buttonText: "Contact Us",
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
              <faqData.hero.icon className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
                {faqData.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {faqData.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-20">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Accordion type="single" collapsible className="space-y-4">
              {faqData.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-muted/30 rounded-lg px-6 border-none"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Contact CTA */}
            <div className="mt-16 text-center bg-muted/30 p-8 rounded-lg">
              <h3 className="font-serif text-2xl font-bold mb-4">
                {faqData.contactCTA.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {faqData.contactCTA.subtitle}
              </p>
              <a
                href={faqData.contactCTA.href}
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 font-medium transition-colors"
              >
                {faqData.contactCTA.buttonText}
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
