import { StaticImageData } from "next/image";
import { ProductCard } from "./product-card";

import { Product } from "@/lib/types";

interface ProductGridProps {
  products: Product[];
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
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
      {products.map((product, index) => {
        const image = product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || "/placeholder.jpg";

        return (
          <ProductCard key={product.id} product={product} image={image} index={index} />
        );
      })}
    </div>
  );
}
