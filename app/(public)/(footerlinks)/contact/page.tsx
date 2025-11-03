"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";

export default function ContactPage() {
  // 🗂️ Dictionary-style data
  const contactData = {
    hero: {
      title: "Get In Touch",
      subtitle:
        "Have questions about our products or custom orders? We'd love to hear from you.",
    },
    form: {
      title: "Send us a message",
      fields: [
        { label: "Name", type: "text", placeholder: "Your name" },
        { label: "Email", type: "email", placeholder: "your@email.com" },
        { label: "Subject", type: "text", placeholder: "How can we help?" },
      ],
      messageLabel: "Message",
      messagePlaceholder: "Tell us more...",
      buttonText: "Send Message",
    },
    info: {
      title: "Contact Information",
      description:
        "Reach out to us through any of these channels. We typically respond within 24 hours.",
      details: [
        {
          icon: Mail,
          title: "Email",
          text: "hello@antiquenepal.com",
        },
        {
          icon: Phone,
          title: "Phone",
          text: "+977 1 234 5678",
        },
        {
          icon: MapPin,
          title: "Address",
          text: "Thamel, Kathmandu\nNepal",
        },
      ],
      businessHours: {
        title: "Business Hours",
        hours: [
          "Monday - Friday: 9:00 AM - 6:00 PM NPT",
          "Saturday: 10:00 AM - 4:00 PM NPT",
          "Sunday: Closed",
        ],
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
              priority
            />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
                {contactData.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {contactData.hero.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <h2 className="font-serif text-3xl font-bold mb-6 text-foreground">
                  {contactData.form.title}
                </h2>
                <form className="space-y-6">
                  {contactData.form.fields.map((field, index) => (
                    <div key={index}>
                      <label className="block text-sm font-medium mb-2 text-foreground">
                        {field.label}
                      </label>
                      <Input
                        type={field.type}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      {contactData.form.messageLabel}
                    </label>
                    <Textarea
                      placeholder={contactData.form.messagePlaceholder}
                      rows={6}
                    />
                  </div>
                  <Button size="lg" className="w-full">
                    {contactData.form.buttonText}
                  </Button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="font-serif text-3xl font-bold mb-6 text-foreground">
                    {contactData.info.title}
                  </h2>
                  <p className="text-muted-foreground mb-8">
                    {contactData.info.description}
                  </p>
                </div>

                <div className="space-y-6">
                  {contactData.info.details.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <item.icon className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/30 p-6 rounded-2xl mt-8">
                  <h3 className="font-semibold mb-2 text-foreground">
                    {contactData.info.businessHours.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {contactData.info.businessHours.hours.map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
