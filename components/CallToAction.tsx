"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, ShoppingBag } from "lucide-react";

export const CallToAction = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="text-center mb-16 animate-fade-in">
            <h2
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Begin Your Journey
            </h2>
            <p className="text-xl font-inter mb-8 text-primary-foreground/90">
              Explore our collection of handcrafted hemp bags and bring a piece
              of Himalayan heritage into your life.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-10 py-6  font-inter shadow-medium hover:shadow-soft transition-all"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Now
            </Button>
          </div>

          {/* Newsletter */}
          <div className="bg-primary-foreground/10 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-primary-foreground/20 animate-slide-up">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
              <h3
                className="text-2xl font-semibold mb-2"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Stay Connected
              </h3>
              <p className="text-primary-foreground/80 font-inter">
                Subscribe to receive updates on new collections and artisan
                stories
              </p>
            </div>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-primary-foreground  font-inter text-primary border-none flex-1"
              />
              <Button
                type="submit"
                variant="secondary"
                className="whitespace-nowrap font-inter"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
