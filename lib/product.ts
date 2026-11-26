export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  isPrimary?: boolean;
}

export interface ProductReview {
  id: string;
  rating: number;
  comment: string;
  title?: string | null;
  createdAt: Date | string;
  userId: string;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  user?: { name?: string | null; id?: string };
}

export interface ProductCategory {
  category: {
    id: string;
    name: string;
    slug?: string;
    image?: string | null;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isFeatured?: boolean;
  images: ProductImage[];
  categories: ProductCategory[];
  reviews: ProductReview[];
}
