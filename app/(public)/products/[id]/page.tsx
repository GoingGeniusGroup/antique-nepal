import { getProductById } from "@/actions/products";
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

  return <ProductDetailClient product={product} />;
}
