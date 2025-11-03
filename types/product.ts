import type { StaticImageData } from "next/image";

export type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string | StaticImageData;
  badge?: string;
  inStock?: boolean;
  category?: string; // ✅ optional in case some products have it
};
