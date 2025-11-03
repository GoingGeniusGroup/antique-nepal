"use client";

import Image from "next/image";

import { FileText } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";

export default function TermsPage() {
  const terms = [
    {
      title: "Agreement to Terms",
      content:
        "By accessing or using Antique Nepal's website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.",
    },
    {
      title: "Use of Service",
      content:
        "Our service allows you to: browse and purchase handcrafted lamp bags, create an account to track orders and save preferences, access information about our products and Artisans. You agree not to misuse our services or help anyone else do so.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content on our website, including text, images, and other media, is the property of Antique Nepal. You may not reproduce, distribute, or modify any of our content without our written permission.",
    },
    {
      title: "Payment and Refunds",
      content:
        "You agree to pay for any purchases made through our website. We reserve the right to refuse service to anyone. If you are not satisfied with your purchase, you may request a refund within 30 days of purchase.",
    },
    {
      title: "Privacy",
      content:
        "We respect your privacy. We will not share your personal information with third parties unless you give us permission to do so. You can review our full Privacy Policy here.",
    },
    {
      title: "Disclaimers",
      content:
        "Our website and services are provided on an 'as is' basis. We disclaim all warranties, express or implied, including but not limited to the implied warranties of fitness for a particular purpose and non-infringement. We are not liable for any damages arising from your use of our website or services.",
    },
  ];
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
              priority
            />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <FileText className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Terms of Service
              </h1>
              <p className="text-xl text-muted-foreground">
                Last updated: January 2024
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto prose prose-lg text-muted-foreground">
              <div className="space-y-8">
                {terms.map((term, index) => (
                  <div key={index}>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                      {term.title}
                    </h2>
                    <p>{term.content}</p>
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
