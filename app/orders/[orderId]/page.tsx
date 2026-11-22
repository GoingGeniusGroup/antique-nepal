import { redirect } from "next/navigation";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  redirect(`/profile/${encodeURIComponent(orderId)}?payment=success`);
}
