/**
 * PaymentHistorySection
 * Lists payment transactions from stripe_webhook_events
 */

import { useProfileData } from "@/hooks/useProfileData";
import { Skeleton } from "@/components/ui/skeleton";
import { Receipt, CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from "@/lib/ui-utils";

export function PaymentHistorySection() {
  const { payments, isLoading, error } = useProfileData("payments");

  return (
    <section aria-labelledby="payments-heading">
      <h1 id="payments-heading" className="mb-6 text-2xl font-semibold">
        Historia wpłat
      </h1>

      {isLoading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!isLoading && !error && payments.length === 0 && (
        <div className="rounded-lg border border-dashed p-10 text-center">
          <Receipt
            className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40"
            aria-hidden="true"
          />
          <p className="mb-1 font-medium text-muted-foreground">
            Brak historii płatności
          </p>
          <p className="text-sm text-muted-foreground/70">
            Transakcje pojawią się tutaj po pierwszej płatności przez Stripe.
          </p>
        </div>
      )}

      {!isLoading && !error && payments.length > 0 && (
        <div className="rounded-lg border">
          {/* Table header */}
          <div className="grid grid-cols-3 border-b bg-muted/40 px-6 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Data</span>
            <span className="text-center">Kwota</span>
            <span className="text-right">Status</span>
          </div>
          {/* Rows */}
          <ul>
            {payments.map((payment, idx) => (
              <li
                key={payment.id}
                className={[
                  "grid grid-cols-3 items-center px-6 py-3 text-sm",
                  idx < payments.length - 1 ? "border-b" : "",
                ].join(" ")}
              >
                <span className="text-muted-foreground">
                  {formatDate(payment.created_at)}
                </span>
                <span className="text-center font-medium">
                  {payment.amount != null
                    ? `${(payment.amount / 100).toFixed(2)} ${(payment.currency ?? "").toUpperCase()}`
                    : "—"}
                </span>
                <span className="flex items-center justify-end gap-1.5">
                  {payment.status === "success" ? (
                    <>
                      <CheckCircle2
                        className="h-4 w-4 text-green-600 dark:text-green-400"
                        aria-hidden="true"
                      />
                      <span className="text-green-700 dark:text-green-400">
                        Opłacono
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle
                        className="h-4 w-4 text-destructive"
                        aria-hidden="true"
                      />
                      <span className="text-destructive">Nieudana</span>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
