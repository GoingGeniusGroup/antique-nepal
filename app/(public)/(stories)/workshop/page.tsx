"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Hammer, Heart } from "lucide-react";
import workshopImage from "@/public/workshop.jpg";
import artisanHands from "@/public/artisan-hands.jpg";
import hempField from "@/public/hemp-field.jpg";
import { ThemeToggle } from "@/components/theme-toggle";

const Workshop = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Theme Toggle */}
      <ThemeToggle variant="fixed" position="right-4 top-24" />
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src={workshopImage}
          alt="Our Workshop"
          className="object-cover"
          fill
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold font-cinzel text-white mb-4">
            Our Workshop
          </h1>
          <p className="text-xl md:text-2xl font-inter text-white/90 max-w-2xl mx-auto">
            Where centuries of tradition meet skilled hands
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold font-cinzel mb-6">
            The Heart of Creation
          </h2>
          <p className="text-lg text-muted-foreground font-inter leading-relaxed">
            Step into the world where ancient techniques are preserved and
            practiced daily. Our workshop in the hills of Nepal is more than a
            production facility—it's a living museum of craftsmanship, where
            master artisans pass down their knowledge to the next generation,
            ensuring that centuries-old traditions continue to thrive.
          </p>
        </div>
      </section>

      {/* Workshop Values */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Master Artisans",
                desc: "Over 50 skilled craftspeople, each with decades of experience in traditional hemp weaving and natural dyeing techniques.",
              },
              {
                icon: Hammer,
                title: "Traditional Tools",
                desc: "We use handlooms and traditional tools passed down through generations, preserving authentic techniques that create unique character in every piece.",
              },
              {
                icon: Heart,
                title: "Fair Practices",
                desc: "Every artisan receives fair wages, healthcare benefits, and the respect they deserve for their invaluable skills and dedication.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="text-center p-8 bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-cinzel font-bold mb-4">
                  {item.title}
                </h3>
                <p className="text-muted-foreground font-inter">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold font-cinzel text-center mb-16">
            From Field to Finished Product
          </h2>

          <div className="space-y-20">
            {[
              {
                step: "Step 01",
                title: "Hemp Cultivation",
                desc: "Our journey begins in the organic hemp fields of the Himalayan foothills. Local farmers grow hemp using traditional sustainable methods, without pesticides or chemical fertilizers. The plants are harvested by hand at peak maturity to ensure the strongest, most durable fibers.",
                image: hempField,
                reverse: true,
              },
              {
                step: "Step 02",
                title: "Traditional Weaving",
                desc: "In our workshop, master weavers transform raw hemp fiber into beautiful fabric using traditional handlooms. Each artisan brings their own style and expertise, creating textiles with unique character and unmatched quality. The rhythmic sound of looms fills our workshop from dawn to dusk.",
                image: artisanHands,
              },
              {
                step: "Step 03",
                title: "Handcrafted Assembly",
                desc: "Skilled artisans cut, stitch, and assemble each bag by hand with meticulous attention to detail. Every seam is reinforced, every handle carefully attached, ensuring durability that lasts for years. Natural dyes and embellishments are added, making each piece truly one-of-a-kind.",
                image: workshopImage,
                reverse: true,
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  step.reverse ? "md:flex-row-reverse" : ""
                }`}
              >
                <div>
                  <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-primary font-semibold mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-3xl font-cinzel font-bold mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 font-inter leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="relative w-full h-[400px] rounded-lg shadow-lg">
                  <Image
                    src={step.image}
                    alt={step.title}
                    className="object-cover rounded-lg"
                    fill
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-cinzel font-bold mb-6">
            Experience the Craftsmanship
          </h2>
          <p className="text-xl font-inter mb-8 opacity-90">
            Each bag tells a story of tradition, skill, and dedication. Discover
            our collection and own a piece of Nepalese heritage.
          </p>
          <Button size="lg" variant="secondary" className="group font-inter">
            Shop Our Collection
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Workshop;
