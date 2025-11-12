export type ProductData = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  sku: string;
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type ProductImage = {
  id?: string;
  productId?: string;
  variantId?: string;
  file?: File | null;
  url?: string;
  altText?: string | null;
  displayOrder: number;
  isPrimary: boolean;
  uploadcareUuid?: string | null;
};
