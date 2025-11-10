"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import toast from "react-hot-toast";

interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price?: number;
  color?: string;
  size?: string;
}

interface VariantModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  variants: ProductVariant[];
  basePrice: number;
  onAddToCart: (variantId: string, quantity: number) => Promise<void>;
}

export function VariantModal({
  isOpen,
  onClose,
  productName,
  variants,
  basePrice,
  onAddToCart,
}: VariantModalProps) {
  const [selectedVariant, setSelectedVariant] = useState<string>(
    variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const selectedVariantData = variants.find((v) => v.id === selectedVariant);
  const displayPrice = selectedVariantData?.price || basePrice;

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }

    try {
      setIsLoading(true);
      await onAddToCart(selectedVariant, quantity);
      setQuantity(1);
      setSelectedVariant(variants[0]?.id || "");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Select Product Variant</DialogTitle>
          <DialogDescription>{productName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Variants Selection */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Available Options</Label>
            <RadioGroup
              value={selectedVariant}
              onValueChange={setSelectedVariant}
            >
              <div className="space-y-3">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedVariant(variant.id)}
                  >
                    <RadioGroupItem value={variant.id} id={variant.id} />
                    <Label
                      htmlFor={variant.id}
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{variant.name}</p>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            {variant.color && (
                              <span>Color: {variant.color}</span>
                            )}
                            {variant.size && <span>Size: {variant.size}</span>}
                          </div>
                        </div>
                        {variant.price && variant.price !== basePrice && (
                          <span className="font-semibold">
                            ${Number(variant.price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Quantity Selection */}
          <div className="space-y-2">
            <Label htmlFor="quantity" className="font-semibold">
              Quantity
            </Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity === 1 || isLoading}
              >
                −
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))
                }
                className="w-16 text-center"
                disabled={isLoading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={isLoading}
              >
                +
              </Button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Unit Price:</span>
              <span className="font-medium">
                ${Number(displayPrice).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">
                ${(displayPrice * quantity).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
