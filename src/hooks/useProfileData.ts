/**
 * useProfileData hook
 * Fetches profile data (payments or consents) with loading/error state
 */

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type {
  PaymentHistoryItem,
  MarketingConsents,
} from "@/types/profile.types";

interface ProfileDataState {
  payments: PaymentHistoryItem[];
  consents: MarketingConsents;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const DEFAULT_CONSENTS: MarketingConsents = {
  newsletter: false,
  email_notifications: false,
};

export function useProfileData(
  section: "payments" | "consents",
): ProfileDataState {
  const { session } = useAuth();
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [consents, setConsents] = useState<MarketingConsents>(DEFAULT_CONSENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!session?.access_token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (section === "payments") {
        const res = await fetch("/api/profile/payments", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          setError("Błąd ładowania historii płatności");
          return;
        }
        const json = await res.json();
        setPayments((json.data.payments as PaymentHistoryItem[]) ?? []);
      }

      if (section === "consents") {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) {
          setError("Błąd ładowania danych profilu");
          return;
        }
        const json = await res.json();
        const meta =
          (json.data?.user?.metadata
            ?.marketing_consents as MarketingConsents) ?? DEFAULT_CONSENTS;
        setConsents(meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setIsLoading(false);
    }
  }, [section, session?.access_token]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return { payments, consents, isLoading, error, refetch: fetchData };
}
