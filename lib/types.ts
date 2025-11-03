
import { StaticImageData } from "next/image";

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string | StaticImageData;
  inStock: boolean;
  badge?: string;
  rating?: number;
  reviews?: number;
}
