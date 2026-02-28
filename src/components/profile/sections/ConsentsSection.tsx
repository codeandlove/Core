/**
 * ConsentsSection
 * Manages marketing consents via PATCH /api/users/me
 */
import { useState, useEffect } from "react";
import { useProfileData } from "@/hooks/useProfileData";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { MarketingConsents } from "@/types/profile.types";
const CONSENT_LABELS: { key: keyof MarketingConsents; label: string }[] = [
  {
    key: "newsletter",
    label: "Newsletter — informacje o nowosciach i aktualizacjach",
  },
  {
    key: "email_notifications",
    label: "Powiadomienia email — wazne informacje o koncie",
  },
];
export function ConsentsSection() {
  const {
    consents: serverConsents,
    isLoading,
    error,
    refetch,
  } = useProfileData("consents");
  const { session } = useAuth();
  const { success, error: toastError } = useToast();
  const [localConsents, setLocalConsents] =
    useState<MarketingConsents>(serverConsents);
  const [isSaving, setIsSaving] = useState(false);
  useEffect(() => {
    setLocalConsents(serverConsents);
  }, [serverConsents]);
  const handleChange = (key: keyof MarketingConsents) => {
    setLocalConsents((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleSave = async () => {
    if (!session?.access_token) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          metadata: { marketing_consents: localConsents },
        }),
      });
      if (!res.ok) throw new Error();
      success("Zgody zostaly zapisane");
      refetch();
    } catch {
      toastError("Blad", "Nie udalo sie zapisac zgod");
      setLocalConsents(serverConsents);
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <section aria-labelledby="consents-heading">
      <h1 id="consents-heading" className="mb-6 text-2xl font-semibold">
        Zgody marketingowe
      </h1>
      {isLoading && <Skeleton className="h-24 w-full rounded-lg" />}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!isLoading && !error && (
        <div className="space-y-4 rounded-lg border p-6">
          {CONSENT_LABELS.map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                id={`consent-${key}`}
                checked={localConsents[key]}
                onChange={() => handleChange(key)}
                className="mt-0.5 h-4 w-4 rounded border"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
          <div className="border-t pt-4">
            <Button onClick={() => void handleSave()} disabled={isSaving}>
              {isSaving ? "Zapisywanie..." : "Zapisz zgody"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
