import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCart, getUserAddresses } from "@/actions/checkout";
import CheckoutClient from "./checkout-client";

export default async function CheckoutPage() {
  // Server-side authentication
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch data directly on server
  const [cartResult, addressesResult] = await Promise.all([
    getCart(),
    getUserAddresses(),
  ]);

  if (!cartResult.success || !addressesResult.success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load checkout data</p>
        </div>
      </div>
    );
  }

  const cartItems = cartResult.items || [];
  const addresses = addressesResult.addresses || [];

  // Render client component with server-fetched data
  return <CheckoutClient cartItems={cartItems} addresses={addresses} />;
}
