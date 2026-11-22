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
  ProductImage,
  Address,
} from "@prisma/client";

type SerializableOrderItem = Omit<
  OrderItem,
  "price" | "total" | "createdAt" | "productVariant"
> & {
  price: string;
  total: string;
  createdAt: string;
  product: { images: ProductImage[] };
  productVariant: Pick<ProductVariant, "color" | "size"> | null;
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
