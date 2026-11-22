import CheckoutClient from "./checkout-client";

export default function CheckoutPage() {
  return (
    <CheckoutClient
      showDevPaymentSimulation={process.env.NODE_ENV === "development"}
    />
  );
}
