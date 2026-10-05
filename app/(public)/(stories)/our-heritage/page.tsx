"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Sparkles, Leaf, Award, ShieldCheck, HeartHandshake } from "lucide-react";

// Image assets
import hempField from "@/public/hemp-field.jpg";
import workshop from "@/public/workshop.jpg";
import artisanHands from "@/public/artisan-hands.jpg";
import hempShoulderBag from "@/public/hemp-shoulder-bag.jpg";

interface Milestone {
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  highlights?: string[];
  image: any;
  imageAlt: string;
  align: "left" | "right";
}

const MILESTONES: Milestone[] = [
  {
    year: "1800s",
    title: "Ancient Himalayan Roots",
    description:
      "For centuries, mountain communities across the high valleys of Nepal harvested wild Himalayan hemp. Thriving in the harsh alpine climate without pesticides, the plant yielded exceptionally long, durable fibers revered for their legendary strength and breathability.",
    highlights: ["Wild Alpine Hemp", "Ancient Harvesting Rituals", "Natural Durability"],
    image: hempField,
    imageAlt: "Wild Himalayan hemp field in Nepal foothills",
    align: "left",
  },
  {
    year: "1950s",
    title: "Sacred Loom Traditions",
    description:
      "Generations of family artisans perfected the art of manual hand-spinning and wooden backstrap loom weaving. Sacred techniques of organic river-washing, sun-drying, and vegetable pigment dyeing were passed down from master weavers to their apprentices in Kathmandu valley.",
    highlights: ["Hand-Carved Wooden Looms", "Sun-Drying & River Washes", "Vegetable Dyeing"],
    image: workshop,
    imageAlt: "Traditional Nepali handloom workshop",
    align: "right",
  },
  {
    year: "2010",
    title: "The Birth of Antique Nepal",
    description:
      "Founded with a vision to preserve Nepal's endangered artisanal crafts, Antique Nepal united master weavers and leather artisans. We reimagined traditional hemp and natural Lokta paper textiles into timeless, luxury lifestyle bags for a conscious modern world.",
    highlights: ["Ethical Design Studio", "Lokta Paper Inlays", "Global Export Debut"],
    image: hempShoulderBag,
    imageAlt: "Handcrafted sustainable hemp bag by Antique Nepal",
    align: "left",
  },
  {
    year: "Today",
    title: "Ethical Luxury & Living Heritage",
    description:
      "Today, Antique Nepal directly supports rural weaving cooperatives and female artisan guilds with fair living wages and safe dignified work environments. Every stitch represents sustainable luxury, cultural pride, and generational resilience.",
    highlights: ["200+ Women Artisans", "100% Plastic-Free", "Fair Trade Certified Ethics"],
    image: artisanHands,
    imageAlt: "Master Nepali artisan hands crafting hemp textile",
    align: "right",
  },
];

const VALUES = [
  {
    number: "01",
    icon: Leaf,
    title: "100% Organic & Biodegradable",
    description:
      "Sourced exclusively from wild Himalayan hemp that requires zero pesticides and minimal rainfall. Naturally antibacterial, UV-resistant, and entirely earth-friendly.",
  },
  {
    number: "02",
    icon: HeartHandshake,
    title: "Artisan Empowerment",
    description:
      "Empowering indigenous women and multigenerational weaver families with fair living wages, healthcare, and safe dignified creative studios in Nepal.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Generational Longevity",
    description:
      "Constructed with reinforced double-stitch craftsmanship and premium natural finishes. Designed to endure decades of exploration while aging with timeless character.",
  },
];

export default function HeritagePage() {
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineContainerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="bg-[#faf8f5] dark:bg-[#0c0a09] text-[#2d2520] dark:text-stone-100 selection:bg-amber-500/20 dark:selection:bg-amber-500/30 selection:text-current overflow-x-hidden min-h-screen transition-colors duration-300">
      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION (Dual-Theme Luxury Typography & Radial Glow)
         ───────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] w-full flex flex-col items-center justify-center text-center px-6 pt-24 pb-16 overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[55%] h-[55%] bg-emerald-600/10 dark:bg-emerald-900/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-amber-500/10 dark:bg-amber-900/15 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,119,6,0.06)_0%,transparent_70%)] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 space-y-8 max-w-5xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-amber-600/30 bg-amber-50/80 dark:border-amber-500/30 dark:bg-amber-500/10 text-amber-800 dark:text-amber-400 tracking-[0.5em] uppercase text-[11px] font-semibold py-2 px-6 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.12)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EST. 2010 • HIMALAYAN ROOTS</span>
          </div>

          {/* Luxury Editorial Headline */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[9.5rem] font-light tracking-tighter leading-[0.88]">
            <span className="italic font-serif block text-stone-700 dark:text-stone-200">Handcrafted</span>
            <span className="font-extrabold not-italic uppercase tracking-tight text-[#2d2520] dark:text-white block mt-1">
              Heritage
            </span>
          </h1>

          {/* Subtitle with high tracking */}
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase font-semibold max-w-2xl mx-auto pt-4 leading-relaxed">
            A three-century legacy of sustainable wild hemp weaving & artisan mastery in the Himalayas
          </p>
        </motion.div>

        {/* Scroll indicator line */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 64 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-amber-600 via-amber-500/50 to-transparent dark:from-amber-500 dark:via-amber-400/50"
        />
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. SCROLL TIMELINE (Signature Designers Carpet scroll-linked axis)
         ───────────────────────────────────────────────────────────── */}
      <section
        ref={timelineContainerRef}
        className="relative py-24 md:py-36 px-6 max-w-[1500px] mx-auto"
      >
        {/* Central Vertical Timeline Track */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px] bg-stone-300 dark:bg-stone-800/80 z-0">
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-amber-600 via-emerald-600 to-amber-600 dark:from-amber-500 dark:via-emerald-400 dark:to-amber-500 shadow-[0_0_15px_rgba(217,119,6,0.35)] dark:shadow-[0_0_20px_rgba(245,158,11,0.6)]"
          />
        </div>

        <div className="relative z-10 space-y-36 lg:space-y-64">
          {MILESTONES.map((milestone) => {
            const isLeft = milestone.align === "left";
            return (
              <div key={milestone.year} className="relative w-full">
                {/* Center glowing node marker (desktop) */}
                <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-amber-600 dark:border-amber-500/80 bg-[#faf8f5] dark:bg-stone-950 shadow-[0_0_14px_rgba(217,119,6,0.3)] dark:shadow-[0_0_18px_rgba(245,158,11,0.6)] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-amber-600 dark:bg-amber-400 animate-ping" />
                  </div>
                </div>

                {/* Grid Content */}
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-32 items-center"
                >
                  {/* Text Column */}
                  <div
                    className={`${
                      isLeft
                        ? "lg:pr-24 lg:text-right order-2 lg:order-1"
                        : "lg:pl-24 lg:text-left order-2 lg:order-2"
                    }`}
                  >
                    <span className="font-serif italic font-bold text-amber-700 dark:text-amber-400 text-2xl md:text-3xl tracking-widest block mb-4">
                      {milestone.year}
                    </span>
                    <h2 className="text-3xl md:text-5xl font-light tracking-tight text-[#2d2520] dark:text-white mb-6 leading-[1.15] font-serif">
                      {milestone.title}
                    </h2>
                    <p className="text-stone-600 dark:text-stone-300 text-base md:text-lg font-light leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0">
                      {milestone.description}
                    </p>

                    {/* Highlights tags */}
                    {milestone.highlights && (
                      <div
                        className={`flex flex-wrap gap-2 pt-2 justify-start ${
                          isLeft ? "lg:justify-end" : "lg:justify-start"
                        }`}
                      >
                        {milestone.highlights.map((tag) => (
                          <span
                            key={tag}
                            className="text-[11px] uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-stone-200/70 border border-stone-300/80 text-stone-800 dark:bg-stone-900/90 dark:border-stone-800 dark:text-stone-300 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Image Column */}
                  <div
                    className={`flex justify-center ${
                      isLeft ? "order-1 lg:order-2" : "order-1 lg:order-1"
                    }`}
                  >
                    <div className="relative group w-full max-w-lg aspect-[4/3] rounded-3xl overflow-hidden border border-stone-200 dark:border-white/10 shadow-xl dark:shadow-2xl bg-stone-100 dark:bg-stone-900">
                      {/* Ambient Glow */}
                      <div className="absolute inset-0 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[100px] -z-10 group-hover:scale-125 transition-transform duration-1000 pointer-events-none" />

                      <Image
                        src={milestone.image}
                        alt={milestone.imageAlt}
                        fill
                        className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-108"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs tracking-widest uppercase text-stone-200 font-medium">
                        <span className="font-serif italic text-amber-300 text-sm">
                          Himalayan Archives
                        </span>
                        <span className="text-[10px] text-stone-300">{milestone.year}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. ARTISAN DISTINCTION / SPOTLIGHT BANNER
         ───────────────────────────────────────────────────────────── */}
      <section className="py-32 md:py-40 bg-[#f3eee8] dark:bg-[#12100e] border-y border-[#e2d8cd] dark:border-white/10 relative overflow-hidden transition-colors duration-300">
        {/* Light beam on top border */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[1px] bg-gradient-to-r from-transparent via-amber-600/30 dark:via-amber-500/40 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,119,6,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 text-amber-800 dark:text-amber-500 font-bold tracking-[0.6em] text-[11px] uppercase mb-8">
              <Award className="w-4 h-4" />
              <span>Artisan Distinction & Mastery</span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter mb-12 uppercase leading-tight text-[#2d2520] dark:text-white font-serif">
              Centuries of Himalayan Weaving <br />
              <span className="italic font-serif text-amber-700 dark:text-amber-400 lowercase">reimagined for</span>{" "}
              Modern Luxury
            </h2>

            <div className="grid md:grid-cols-2 gap-10 text-left mb-16 text-stone-700 dark:text-stone-300 text-base md:text-lg font-light leading-relaxed">
              <p>
                Every bag in our collection begins in the pristine alpine elevations of Nepal, where
                wild Himalayan hemp grows naturally without synthetic irrigation or agrochemicals.
                Harvested by hand, the raw stalk fibers are gently peeled, carded, and spun into
                strong, durable yarns that outlast conventional cotton by decades.
              </p>
              <p>
                Our master artisans weave these fibers with traditional wood-frame looms, marrying
                ancient Nepalese textile motifs with handcrafted Lokta paper accents and sustainable
                leather trims. The result is an heirloom accessory that honors cultural preservation
                and environmental regeneration.
              </p>
            </div>

            <div className="h-[1px] w-28 bg-amber-600/30 dark:bg-amber-500/40 mx-auto mb-10" />

            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-3 px-10 py-4 bg-amber-700 hover:bg-amber-800 text-white dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400 transition-all duration-300 tracking-[0.25em] uppercase text-xs font-bold rounded-full shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:scale-105"
              >
                <span>Explore the Collection</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link
                href="/artisans"
                className="inline-flex items-center gap-3 px-10 py-4 border border-stone-300 dark:border-stone-700 hover:border-amber-700 dark:hover:border-amber-400 text-stone-700 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 transition-all duration-300 tracking-[0.25em] uppercase text-xs font-bold rounded-full hover:bg-stone-200/50 dark:hover:bg-stone-900"
              >
                <span>Meet Our Artisans</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. "WHY HIMALAYAN HEMP STANDS APART" (Designers Carpet split section)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-28 md:py-40 px-6 max-w-[1450px] mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column: Portrait Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden group border border-stone-200 dark:border-white/10 shadow-xl dark:shadow-2xl bg-stone-100 dark:bg-stone-900"
          >
            <Image
              src={workshop}
              alt="Artisan loom craftsmanship in Nepal"
              fill
              className="object-cover transition-transform duration-[2s] ease-out group-hover:scale-108"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            <div className="absolute bottom-10 left-8 right-8 space-y-2">
              <span className="text-[11px] uppercase tracking-[0.4em] text-amber-400 font-semibold">
                Authentic Craftsmanship
              </span>
              <p className="text-white text-2xl sm:text-3xl font-light italic font-serif leading-snug">
                &ldquo;Every knot is a conversation between the artisan and the mountain.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Right Column: Narrative Story */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            className="space-y-8"
          >
            <div>
              <p className="text-amber-800 dark:text-amber-500 text-xs tracking-[0.5em] uppercase mb-4 font-bold">
                Natural Superiority
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tighter uppercase leading-[0.95] font-serif text-[#2d2520] dark:text-white">
                Why Himalayan Hemp <br />
                <span className="italic font-serif text-amber-700 dark:text-amber-400">Endures For Generations</span>
              </h2>
            </div>

            <div className="space-y-6 text-stone-600 dark:text-stone-300 text-base md:text-lg font-light leading-relaxed">
              <p>
                Grown at high Himalayan altitudes, Nepali hemp produces the strongest natural plant
                fiber known to textile science. Its tensile structure is up to{" "}
                <strong className="text-stone-900 dark:text-white font-medium">four times more durable</strong> than
                standard cotton, with natural moisture-wicking and antimicrobial properties that
                prevent odors and decay.
              </p>
              <p>
                Unlike fast fashion synthetic materials that shed microplastics and deteriorate within
                months, authentic Himalayan hemp softens gracefully with use while retaining its
                structural integrity for decades.
              </p>
              <p>
                Combined with traditional handmade Nepali Lokta paper art, every piece embodies a
                living legacy that is zero-waste, carbon-negative, and deeply human.
              </p>
            </div>

            {/* Interactive animated link */}
            <div className="pt-6">
              <Link href="/sustainability" className="flex items-center gap-5 group w-fit">
                <span className="w-12 h-[1px] bg-stone-400 dark:bg-stone-600 group-hover:w-20 group-hover:bg-amber-600 dark:group-hover:bg-amber-400 transition-all duration-500" />
                <span className="text-xs uppercase tracking-[0.35em] font-bold text-[#2d2520] dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  Our Sustainability Journey
                </span>
                <ArrowUpRight className="w-4 h-4 text-stone-500 group-hover:text-amber-700 dark:group-hover:text-amber-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. CORE VALUES (Dual-Theme Minimalist Luxury Cards)
         ───────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-36 px-6 bg-[#ede7df]/60 dark:bg-[#0f0d0b] border-t border-stone-200 dark:border-white/5 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-amber-800 dark:text-amber-500 text-xs tracking-[0.5em] uppercase font-bold">
              Guiding Philosophy
            </span>
            <h2 className="text-4xl md:text-5xl font-light font-serif text-[#2d2520] dark:text-white tracking-tight">
              Principles Behind Every Stitch
            </h2>
            <p className="text-stone-600 dark:text-stone-400 text-base font-light">
              Rooted in reverence for nature and deep respect for the hands that weave our future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <motion.div
                  key={val.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                  className="group relative p-8 md:p-10 rounded-2xl bg-white/80 dark:bg-stone-900/60 border border-stone-200/90 dark:border-white/5 hover:border-amber-600/40 dark:hover:border-amber-500/40 transition-all duration-500 shadow-sm hover:shadow-xl dark:hover:shadow-[0_10px_40px_rgba(245,158,11,0.1)] hover:-translate-y-1.5 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-xs font-mono tracking-widest text-amber-800 dark:text-amber-500 font-bold">
                      {val.number}
                    </span>
                    <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-800 dark:text-amber-400 group-hover:bg-amber-200 dark:group-hover:bg-amber-500/20 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif text-2xl font-light text-[#2d2520] dark:text-white mb-4 leading-snug">
                    {val.title}
                  </h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm md:text-base font-light leading-relaxed">
                    {val.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
