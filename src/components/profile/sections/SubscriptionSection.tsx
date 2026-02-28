/**
 * SubscriptionSection
 * Improved layout - status card + actions row
 */

import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2, ShoppingCart, CreditCard } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/contexts/ToastContext";
import {
  getSubscriptionStatusLabel,
  getSubscriptionStatusColor,
  formatDate,
  daysRemaining,
} from "@/lib/ui-utils";

function ManagePortalButton({ onError }: { onError?: (e: Error) => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.post<{ portal_url?: string }>(
        "/api/subscriptions/create-portal",
        { return_url: window.location.href },
      );
      if (data.portal_url) {
        window.location.href = data.portal_url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      onError?.(
        error instanceof Error
          ? error
          : new Error("Failed to open Stripe Portal"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => void handleClick()}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
      )}
      {isLoading ? "Ładowanie..." : "Zarządzaj w Stripe"}
    </Button>
  );
}

export function SubscriptionSection() {
  const { profile, isLoading } = useAuth();
  const { error: toastError } = useToast();

  const handleManageError = (err: Error) => {
    toastError("Błąd", err.message);
  };

  if (isLoading) {
    return (
      <section aria-labelledby="subscription-heading">
        <h1 id="subscription-heading" className="mb-6 text-2xl font-semibold">
          Subskrypcja
        </h1>
        <Skeleton className="h-40 w-full rounded-lg" />
      </section>
    );
  }

  return (
    <section aria-labelledby="subscription-heading">
      <h1 id="subscription-heading" className="mb-6 text-2xl font-semibold">
        Subskrypcja
      </h1>

      {!profile ? (
        /* No subscription */
        <div className="rounded-lg border p-8 text-center">
          <CreditCard
            className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50"
            aria-hidden="true"
          />
          <p className="mb-1 font-medium">Brak aktywnej subskrypcji</p>
          <p className="mb-5 text-sm text-muted-foreground">
            Wybierz plan, aby uzyskać dostęp do wszystkich funkcji.
          </p>
          <Button asChild size="sm">
            <a href="/checkout">
              <ShoppingCart className="mr-2 h-4 w-4" aria-hidden="true" />
              Kup plan
            </a>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          {/* Status header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-3">
              <CreditCard
                className="h-5 w-5 text-muted-foreground"
                aria-hidden="true"
              />
              <span className="font-medium">Plan subskrypcji</span>
            </div>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getSubscriptionStatusColor(profile.subscription_status)}`}
            >
              {getSubscriptionStatusLabel(profile.subscription_status)}
            </span>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {profile.plan_id && (
              <div className="px-6 py-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Plan
                </p>
                <p className="text-sm font-medium">{profile.plan_id}</p>
              </div>
            )}

            {profile.subscription_status === "trial" &&
              profile.trial_expires_at && (
                <div className="px-6 py-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Trial wygasa
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(profile.trial_expires_at)}
                  </p>
                  {(() => {
                    const days = daysRemaining(profile.trial_expires_at);
                    return days !== null && days >= 0 ? (
                      <p className="text-xs text-muted-foreground">
                        Pozostało {days} {days === 1 ? "dzień" : "dni"}
                      </p>
                    ) : null;
                  })()}
                </div>
              )}

            {profile.subscription_status === "active" &&
              profile.current_period_end && (
                <div className="px-6 py-4">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Następne odnowienie
                  </p>
                  <p className="text-sm font-medium">
                    {formatDate(profile.current_period_end)}
                  </p>
                </div>
              )}

            {profile.subscription_status === "past_due" && (
              <div className="px-6 py-4">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Status płatności
                </p>
                <p className="text-sm font-medium text-destructive">
                  Wymagana aktualizacja
                </p>
              </div>
            )}
          </div>

          {/* Actions footer */}
          <div className="flex items-center justify-end border-t bg-muted/30 px-6 py-3">
            <ManagePortalButton onError={handleManageError} />
          </div>
        </div>
      )}
    </section>
  );
}
