"use client";

import Image from "next/image";
import paperTexture from "@/public/paper-texture.jpg";
import { motion } from "framer-motion";

export default function Heritage() {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section
      id="heritage"
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <Image
          src={paperTexture}
          alt="Paper texture background"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="container px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2
              className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              Rooted in Nepali Heritage
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8" />
          </motion.div>

          {/* Two-Column Section */}
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideUp}
          >
            <div className="bg-card p-8 rounded-2xl shadow-soft border border-border">
              <h3
                className="text-2xl font-semibold mb-4 text-foreground"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Traditional Craftsmanship
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our bags are crafted using techniques passed down through
                generations of Nepali artisans. Each stitch and weave reflects
                the rich cultural heritage of the Himalayan region.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The natural hemp fiber, combined with traditional Nepali
                paper-making aesthetics, creates products that are both timeless
                and contemporary.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl shadow-soft border border-border">
              <h3
                className="text-2xl font-semibold mb-4 text-foreground"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Sustainable by Nature
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Hemp grows naturally in the mountain regions of Nepal, requiring
                minimal water and no pesticides. It's one of the most
                sustainable materials on Earth.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By choosing our hemp bags, you're supporting both environmental
                sustainability and the livelihoods of Nepali artisan
                communities.
              </p>
            </div>
          </motion.div>

          {/* Quote Section */}
          <motion.div
            className="mt-12 text-center text-primary-foreground p-10 rounded-2xl"
            style={{ background: "var(--gradient-mountain)" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scaleIn}
          >
            <p
              className="text-xl md:text-2xl leading-relaxed"
              style={{ fontFamily: "Cinzel, serif" }}
            >
              "Every bag carries the spirit of the mountains and the warmth of
              Nepali craftsmanship."
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
