"use client";

import Image from "next/image";

import { Cookie } from "lucide-react";
import paperTexture from "@/public/paper-texture.jpg";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-grow pt-20">
        {/* Hero Section */}
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
              <Cookie className="w-16 h-16 mx-auto mb-6 text-primary" />
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 text-foreground">
                Cookie Policy
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
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    What Are Cookies
                  </h2>
                  <p>
                    Cookies are small text files placed on your device when you
                    visit our website. They help us provide a better experience
                    by remembering your preferences and understanding how you
                    use our site.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    How We Use Cookies
                  </h2>
                  <p>We use cookies for several purposes:</p>
                  <ul>
                    <li>
                      <strong>Essential Cookies:</strong> Required for the
                      website to function properly
                    </li>
                    <li>
                      <strong>Performance Cookies:</strong> Help us understand
                      how visitors interact with our website
                    </li>
                    <li>
                      <strong>Functional Cookies:</strong> Remember your
                      preferences and settings
                    </li>
                    <li>
                      <strong>Marketing Cookies:</strong> Track your visits and
                      show relevant advertisements
                    </li>
                  </ul>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    Types of Cookies We Use
                  </h2>
                  <p>
                    <strong>Session Cookies:</strong> Temporary cookies that
                    expire when you close your browser
                  </p>
                  <p>
                    <strong>Persistent Cookies:</strong> Remain on your device
                    until deleted or expired
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    Managing Cookies
                  </h2>
                  <p>
                    You can control and manage cookies through your browser
                    settings. Most browsers allow you to refuse or accept
                    cookies, delete existing cookies, and set preferences for
                    certain websites.
                  </p>
                  <p>
                    Please note that blocking all cookies may impact your
                    experience on our website and prevent you from using certain
                    features.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    Third-Party Cookies
                  </h2>
                  <p>
                    We may use third-party services that also place cookies on
                    your device. These include analytics tools and payment
                    processors. These third parties have their own privacy
                    policies.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    Updates to This Policy
                  </h2>
                  <p>
                    We may update this Cookie Policy from time to time. Any
                    changes will be posted on this page with an updated revision
                    date.
                  </p>
                </div>

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                    Contact Us
                  </h2>
                  <p>
                    If you have questions about our use of cookies, please
                    contact us at{" "}
                    <a
                      href="mailto:hello@antiquenepal.com"
                      className="text-primary underline"
                    >
                      hello@antiquenepal.com
                    </a>
                    .
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
