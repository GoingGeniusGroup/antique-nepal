import { FeaturedCollection } from "@/components/featured-collection";

import { Hero } from "@/components/hero";

import { WhyChoose } from "@/components/why-choose";

export default function Home() {
  return (
    <div>
      <Hero/>
      <WhyChoose />
      <FeaturedCollection/>
    </div>
  );
}
