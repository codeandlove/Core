/**
 * CheckoutLoader component
 * Displays loading state while creating Stripe Checkout session
 */

import { useEffect } from "react";
import { useCheckout } from "@/hooks/useCheckout";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

interface CheckoutLoaderProps {
  priceId: string;
}

export default function CheckoutLoader({ priceId }: CheckoutLoaderProps) {
  const { initiateCheckout, isLoading, error } = useCheckout({
    priceId,
  });

  // Auto-initiate checkout on mount
  useEffect(() => {
    initiateCheckout();
  }, [initiateCheckout]);

  if (error) {
    return (
      <div className="rounded-lg border border-red-600/20 bg-red-600/10 p-8 text-center dark:border-red-400/30 dark:bg-red-400/10">
        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600 dark:text-red-400" />
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Wystąpił błąd
        </h2>
        <p className="mb-6 text-sm text-muted-foreground">{error}</p>
        <Button onClick={initiateCheckout} disabled={isLoading}>
          Spróbuj ponownie
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center shadow-sm">
      <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600 dark:text-blue-400" />
      <h2 className="mb-2 text-xl font-semibold text-foreground">
        Przygotowujemy płatność...
      </h2>
      <p className="text-sm text-muted-foreground">
        Zaraz zostaniesz przekierowany do bezpiecznej strony płatności.
      </p>
      <p className="mt-4 text-xs text-muted-foreground">
        Może to potrwać kilka sekund. Nie odświeżaj strony.
      </p>
    </div>
  );
}
