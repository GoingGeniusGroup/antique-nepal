"use client";

import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import OrderDetailPDF from "./OrderDetailPDF";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type {
  Order,
  OrderItem,
  ProductVariant,
  Product,
  ProductImage,
  Address,
} from "@prisma/client";

// Define serializable types
type SerializableProduct = Omit<
  Product,
  "price" | "createdAt" | "updatedAt"
> & {
  price: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
};

type SerializableProductVariant = Omit<
  ProductVariant,
  "price" | "weight" | "createdAt" | "updatedAt"
> & {
  price: string | null;
  weight: string | null;
  createdAt: string;
  updatedAt: string;
  product: SerializableProduct;
};

type SerializableOrderItem = Omit<
  OrderItem,
  "price" | "total" | "createdAt"
> & {
  price: string;
  total: string;
  createdAt: string;
  productVariant: SerializableProductVariant;
};

type SerializableOrder = Omit<
  Order,
  "subtotal" | "shippingCost" | "tax" | "total" | "createdAt" | "updatedAt"
> & {
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  createdAt: string;
  updatedAt: string;
  items: SerializableOrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
};

const PDFDownloader = ({ order }: { order: SerializableOrder }) => (
  <PDFDownloadLink
    document={<OrderDetailPDF order={order} />}
    fileName={`order-${order.orderNumber}.pdf`}
  >
    {({ loading, error }) =>
      loading ? (
        <Button variant="outline" disabled>
          <Download className="w-4 h-4 mr-2" />
          Generating PDF...
        </Button>
      ) : (
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download as PDF
        </Button>
      )
    }
  </PDFDownloadLink>
);

export default PDFDownloader;
