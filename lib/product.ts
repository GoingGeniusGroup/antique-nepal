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
  createdAt: Date;
  userId: string;
  user?: { name?: string | null; id?: string };
}

export interface ProductCategory {
  category: { id: string; name: string };
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
