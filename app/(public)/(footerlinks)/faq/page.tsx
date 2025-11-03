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
        question: "What materials are your bags made from?",
        answer:
          "All our bags are handcrafted from 100% natural hemp fiber, sourced sustainably from local farms in Nepal. Hemp is naturally durable, biodegradable, and becomes softer with use while maintaining its strength.",
      },
      {
        question: "How long do hemp bags last?",
        answer:
          "With proper care, our hemp bags can last for many years. Hemp is one of the most durable natural fibers, resistant to mold, and actually strengthens when wet. The more you use them, the better they look!",
      },
      {
        question: "How do I care for my hemp bag?",
        answer:
          "Hemp bags are easy to care for. Spot clean with mild soap and water for minor stains. For deeper cleaning, hand wash in cold water and air dry. Avoid machine washing and bleach to preserve the natural fibers.",
      },
      {
        question: "Do you offer custom orders?",
        answer:
          "Yes! We work with our artisans to create custom designs. Contact us with your requirements, and we'll provide a quote and timeline. Custom orders typically take 3-4 weeks to complete.",
      },
      {
        question: "Are your products ethically made?",
        answer:
          "Absolutely. We work directly with artisan cooperatives in Nepal, ensuring fair wages, safe working conditions, and sustainable practices. Every purchase directly supports these communities and helps preserve traditional craftsmanship.",
      },
      {
        question: "What's your environmental impact?",
        answer:
          "We're committed to sustainability at every step: hemp cultivation requires minimal water and no pesticides, our production is zero-waste, packaging is recyclable, and we use carbon-neutral shipping.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Domestic orders within Nepal arrive in 3-5 business days. International orders typically take 7-14 business days. All orders include tracking, and we ship carbon-neutral.",
      },
      {
        question: "What if my bag arrives damaged?",
        answer:
          "We carefully package each item, but if your bag arrives damaged, please contact us within 48 hours with photos. We'll arrange for a replacement or full refund immediately.",
      },
      {
        question: "Can I return or exchange my purchase?",
        answer:
          "Yes! We offer 30-day returns and free exchanges. Items must be unused with original tags. Contact us to initiate a return, and we'll provide a prepaid shipping label.",
      },
      {
        question: "Do you have a physical store?",
        answer:
          "Our main workshop and showroom is located in Thamel, Kathmandu. Visitors are welcome Monday-Friday, 9 AM - 6 PM. You can see our artisans at work and explore our full collection.",
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
