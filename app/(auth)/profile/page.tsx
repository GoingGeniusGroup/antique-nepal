import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import ProfileView from "./components/ProfileView";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      orders: {
        include: {
          items: {
            include: {
              productVariant: {
                include: {
                  product: {
                    include: {
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      addresses: true,
    },
  });

  if (!user) redirect("/login");

  const serializableUser = {
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    emailVerified: user.emailVerified ? user.emailVerified.toISOString() : null,
    orders: user.orders.map((order) => ({
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
        productVariant: {
          ...item.productVariant,
          price: item.productVariant.price
            ? item.productVariant.price.toString()
            : null,
          weight: item.productVariant.weight
            ? item.productVariant.weight.toString()
            : null,
          createdAt: item.productVariant.createdAt.toISOString(),
          updatedAt: item.productVariant.updatedAt.toISOString(),
          product: {
            ...item.productVariant.product,
            price: item.productVariant.product.price.toString(),
            createdAt: item.productVariant.product.createdAt.toISOString(),
            updatedAt: item.productVariant.product.updatedAt.toISOString(),
          },
        },
      })),
    })),
    addresses: user.addresses.map((address) => ({
      ...address,
      createdAt: address.createdAt.toISOString(),
      updatedAt: address.updatedAt.toISOString(),
    })),
  };

  return <ProfileView user={serializableUser as any} />;
}
