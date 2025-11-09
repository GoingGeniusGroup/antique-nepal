import Image from "next/image";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
}

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
  selectedImage: number;
  setSelectedImage: (index: number) => void;
  badge?: string;
  isDark: boolean;
}

export const ProductImageGallery = ({
  images,
  productName,
  selectedImage,
  setSelectedImage,
  badge,
  isDark,
}: ProductImageGalleryProps) => {
  return (
    <div className="space-y-4">
      <Card className="overflow-hidden border-2 relative">
        {badge && (
          <span
            className={cn(
              "absolute top-4 left-4 z-20 inline-block px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full",
              isDark
                ? "bg-emerald-600 text-white"
                : "bg-emerald-500/20 text-emerald-700"
            )}
          >
            {badge}
          </span>
        )}
        <Image
          src={images[selectedImage]?.url || "/product_placeholder.jpeg"}
          alt={images[selectedImage]?.altText || productName}
          width={500}
          height={500}
          className="w-full aspect-square object-cover transition-transform duration-500 cursor-pointer hover:scale-105"
        />
      </Card>

      <div className="grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedImage(index)}
            className={`border-2 rounded-lg overflow-hidden transition-all ${
              selectedImage === index
                ? "border-primary"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Image
              src={image.url || "/product_placeholder.jpeg"}
              alt={image.altText || `${productName} ${index + 1}`}
              width={150}
              height={150}
              className="w-full aspect-square object-cover transition-transform duration-500 cursor-pointer hover:scale-110"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
