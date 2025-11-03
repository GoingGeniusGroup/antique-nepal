"use client";

import Image from "next/image";

import { Shield } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";

export default function PrivacyPage() {
  const privacy = [
    {
      title: "Introduction",
      content:
        "At Antique Nepal, we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or make a purchase.",
    },
    {
      title: "Information We Collect",
      content:
        "We collect personal information when you provide it to us, such as when you create an account, place an order, or contact us. This information may include your name, email address, phone number, billing and shipping address, and payment information.",
    },
    {
      title: "How We Use Your Information",
      content:
        "We use your personal information to provide you with the products and services you request, to process payments, to communicate with you, and to improve our website and services. We may also use your information to send you marketing communications, such as newsletters and promotional emails.",
    },
    {
      title: "Sharing Your Information",
      content:
        "We do not sell or rent your personal information to third parties. We may share your information with third parties who provide services on our behalf, such as payment processors and shipping companies. We may also share your information with our business partners and affiliates.",
    },
    {
      title: "Your Rights",
      content:
        "You have the right to access, correct, and delete your personal information. You can review and update your information by logging into your account. You can also request that we delete your information by contacting us at hello@antiquenepal.com.",
    },
    {
      title: "Data Security",
      content:
        "We take the security of your personal information seriously. We use industry-standard security measures to protect your information from unauthorized access, use, or disclosure. We store your information on secure servers and use encryption to protect sensitive data.",
    },
    {
      title: "Changes to This Policy",
      content:
        "We may update this privacy policy from time to time. Any changes will be posted on this page with an updated revision date.",
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
              <Shield className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Privacy Policy
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
                {privacy.map((term, index) => (
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
