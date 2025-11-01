import { FeaturedCollection } from "@/components/featured-collection";

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
    </div>
  );
}
