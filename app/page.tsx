import { CallToAction } from "@/components/landing/CallToAction";
import { FAQ } from "@/components/landing/FAQ";
import { FeaturedCollection } from "@/components/landing/featured-collection";
import Heritage from "@/components/landing/Heritage";

import { Hero } from "@/components/landing/hero";
import ProductShowcase from "@/components/landing/ProductShowcase";
import { Stats } from "@/components/landing/Stats";
import { Sustainability } from "@/components/landing/Sustainability";

import { WhyChoose } from "@/components/landing/why-choose";

export default function Home() {
  return (
    <div>
      <Hero />
      <WhyChoose />
      <FeaturedCollection />
      <ProductShowcase />
      <Heritage />
      <Sustainability />
      <Stats />
      <FAQ />
      <CallToAction />
    </div>
  );
}
