import { FeaturedCollection } from "@/components/featured-collection";
import Heritage from "@/components/Heritage";

import { Hero } from "@/components/hero";
import ProductShowcase from "@/components/ProductShowcase";

import { WhyChoose } from "@/components/why-choose";

export default function Home() {
  return (
    <div>
      <Hero />
      <WhyChoose />
      <FeaturedCollection />
      <ProductShowcase />
      <Heritage />
    </div>
  );
}
