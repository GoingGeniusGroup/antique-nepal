import { CallToAction } from "@/components/landing/CallToAction";
import { FAQ } from "@/components/landing/FAQ";
import {
  FeaturedCollection,
  FeaturedProduct,
} from "@/components/landing/featured-collection";
import Heritage from "@/components/landing/Heritage";

import { Hero } from "@/components/landing/hero";
import ProductShowcase from "@/components/landing/ProductShowcase";
import { Stats } from "@/components/landing/Stats";
import { Sustainability } from "@/components/landing/Sustainability";

import { WhyChoose } from "@/components/landing/why-choose";

export default async function Home() {
  const baseUrl = process.env.NEXTAUTH_URL;
  const [popularRes, bestSellerRes, latestRes] = await Promise.all([
    fetch(`${baseUrl}/api/products/popular`, {
      next: { tags: ["featured-products"] },
    }),
    fetch(`${baseUrl}/api/products/best-seller`, {
      next: { tags: ["featured-products"] },
    }),
    fetch(`${baseUrl}/api/products/latest`, {
      next: { tags: ["featured-products"] },
    }),
  ]);

  const [popularProduct, bestSellerProduct, latestProduct] = await Promise.all([
    popularRes.json(),
    bestSellerRes.json(),
    latestRes.json(),
  ]);

  const featuredProducts: FeaturedProduct[] = [];

  if (bestSellerProduct) {
    featuredProducts.push(bestSellerProduct);
  }

  if (latestProduct) {
    featuredProducts.push(latestProduct);
  }

  if (popularProduct) {
    featuredProducts.push(popularProduct);
  }
  return (
    <div className="pt-16 md:pt-20">
      <Hero />
      <FeaturedCollection products={featuredProducts} />
      <ProductShowcase />
      <WhyChoose />
      <Heritage />
      <Sustainability />
      <Stats />
      <FAQ />
      <CallToAction />
    </div>
  );
}
