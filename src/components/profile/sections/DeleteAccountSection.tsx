/**
 * DeleteAccountSection
 * GDPR-compliant soft delete with confirmation checkbox
 */
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
export function DeleteAccountSection() {
  const { session, signOut } = useAuth();
  const { error: toastError } = useToast();
  const [confirmed, setConfirmed] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    if (!confirmed || !session?.access_token) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error();
      await signOut();
      window.location.href = "/";
    } catch {
      toastError("Blad", "Nie udalo sie usunac konta. Sprobuj ponownie.");
      setIsDeleting(false);
    }
  };
  return (
    <section aria-labelledby="delete-heading">
      <h1 id="delete-heading" className="mb-6 text-2xl font-semibold">
        Usun konto
      </h1>
      <div className="rounded-lg border border-destructive/30 p-6">
        <p className="mb-4 text-sm text-muted-foreground">
          Usuniecie konta jest nieodwracalne. Twoje dane zostana oznaczone jako
          usuniete zgodnie z RODO. Aktywna subskrypcja nie zostanie
          automatycznie anulowana w Stripe.
        </p>
        <label
          htmlFor="confirm-delete"
          className="mb-6 flex cursor-pointer items-start gap-3"
        >
          <input
            type="checkbox"
            id="confirm-delete"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border"
          />
          <span className="text-sm">
            Rozumiem, ze usuniecie konta jest nieodwracalne i chce kontynuowac.
          </span>
        </label>
        <Button
          variant="destructive"
          disabled={!confirmed || isDeleting}
          aria-disabled={!confirmed || isDeleting}
          onClick={() => void handleDelete()}
        >
          {isDeleting ? "Usuwanie..." : "Usun konto"}
        </Button>
      </div>
    </section>
  );
}
