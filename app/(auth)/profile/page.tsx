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
              product: {
                include: {
                  images: true,
                },
              },
              productVariant: {
                select: { color: true, size: true },
              },
            },
          },
          payments: {
            select: {
              paymentMethod: true,
              status: true,
            },
            take: 1,
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
        product: { images: item.product.images },
        productVariant: item.productVariant,
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
