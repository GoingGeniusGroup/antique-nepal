import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import OrderDetailClient from "./components/OrderDetailClient";

async function getOrderDetails(orderId: string, userId: string) {
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                where: { isPrimary: true },
              },
            },
          },
          productVariant: {
            select: { color: true, size: true },
          },
        },
      },
      shippingAddress: true,
      billingAddress: true,
    },
  });

  if (!order) {
    notFound();
  }

  return order;
}

export default async function OrderDetailPage(props: {
  params: { orderid: string };
}) {
  const { orderid } = await props.params;
  const session = await auth();
  if (!session?.user?.id) {
    notFound();
  }

  const order = await getOrderDetails(orderid, session.user.id);

  const serializableOrder = {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    subtotal: order.subtotal.toString(),
    shippingCost: order.shippingCost.toString(),
    tax: order.tax.toString(),
    total: order.total.toString(),
    items: order.items.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
      price: item.price.toString(),
      total: item.total.toString(),
      product: { images: item.product.images },
      productVariant: item.productVariant,
    })),
  };

  return <OrderDetailClient order={serializableOrder} />;
}
