
import { StaticImageData } from "next/image";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  images: { url: string; altText?: string; isPrimary?: boolean }[];
  inStock: boolean;
  badge?: string;
  rating?: number;
  reviews?: number;
}
