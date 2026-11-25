import { getProductById, getRelatedProducts } from "@/actions/products";
import ProductDetailClient from "./ProductDetailClient";
import ProductNotFound from "@/components/products/product-notfound";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ProductNotFound />
      </div>
    );
  }

  const category = product.categories[0]?.category;
  const relatedProducts = await getRelatedProducts(
    product.id,
    category?.id,
    category?.slug
  );

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
