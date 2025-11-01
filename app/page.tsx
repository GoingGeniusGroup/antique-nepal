import { CallToAction } from "@/components/CallToAction";
import { FAQ } from "@/components/FAQ";
import { FeaturedCollection } from "@/components/featured-collection";
import Heritage from "@/components/Heritage";

import { Hero } from "@/components/hero";
import ProductShowcase from "@/components/ProductShowcase";
import { Stats } from "@/components/Stats";
import { Sustainability } from "@/components/Sustainability";

import { WhyChoose } from "@/components/why-choose";

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
