import { getProductById } from "@/actions/products";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  console.log("🪵 ProductPage params:", resolvedParams);

  const product = await getProductById(resolvedParams.id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Product not found
      </div>
    );
  }

  return <ProductDetailClient product={product} />;
}
