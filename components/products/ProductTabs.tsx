import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductReviews } from "@/components/ProductReviews";
import type { Product } from "@/lib/product";

interface ProductTabsProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  userId?: string;
  setReviewToDelete: (id: string) => void;
  setShowDeleteDialog: (show: boolean) => void;
}

export const ProductTabs = ({
  product,
  setProduct,
  userId,
  setReviewToDelete,
  setShowDeleteDialog,
}: ProductTabsProps) => {
  const reviewCount = product.reviews.filter(
    (review) => review.status === "APPROVED"
  ).length;

  return (
    <div className="mt-16">
      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full max-w-2xl grid-cols-2">
          <TabsTrigger
            className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
            value="description"
          >
            Description
          </TabsTrigger>
          <TabsTrigger
            className="cursor-pointer data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600"
            value="reviews"
          >
            Reviews ({reviewCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-8">
          <Card>
            <CardContent className="prose prose-sm max-w-none p-6">
              <h3 className="mb-4 font-serif text-2xl font-semibold">
                About This Product
              </h3>
              {product.description && (
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}
              <p className="leading-relaxed text-muted-foreground">
                Each product is crafted with attention to detail and quality. By
                choosing this piece, you can explore the details, fit, and care
                information to find the right addition to your wardrobe.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-8">
          <ProductReviews
            product={product}
            setProduct={setProduct}
            userId={userId}
            setReviewToDelete={setReviewToDelete}
            setShowDeleteDialog={setShowDeleteDialog}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
