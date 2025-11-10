import { Loader2 } from "lucide-react";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    </div>
  );
}
