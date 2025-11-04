import { ProductCard } from "./product-card";

import { ProductData } from "@/app/(public)/products/actions/products";

interface ProductGridProps {
  products: ProductData[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">No products found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
      {products.map((product, index) => {
        // ensure required fields have values
        const safeProduct = {
          ...product,
          category: product.category ?? "Unknown",
          inStock: product.inStock ?? true,
          badge: product.badge ?? "",
          image:
            typeof product.image === "string" ? product.image : product.image, // if using StaticImageData
        };

        return (
          <ProductCard key={product.id} product={product} image={image} index={index} />
        );
      })}
    </div>
  );
}
