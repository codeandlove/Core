# Plan Implementacji Feature - Profil użytkownika

Data utworzenia: 2026-02-23
Tytuł feature: Profil użytkownika - dedykowane podstrony z nawigacją boczną
Typ: UI/UX + Business Logic + Integration
Priorytet: HIGH

## 1. Podsumowanie wykonawcze

### 1.1. Opis funkcjonalności

Zalogowany użytkownik uzyskuje dostęp do obszaru `/profile/*` poprzez link w dropdownie avatara (`AvatarMenu.tsx`). Obszar profilu zastępuje biznesowy sidebar dashboardu (`DashboardSidebar.tsx`) dedykowaną lewą nawigacją profilu. Feature obejmuje pięć podstron: podstawowe informacje konta, status subskrypcji, historię wpłat, zgody marketingowe oraz usunięcie konta.

### 1.2. Value proposition

Użytkownik zyskuje centralne, przejrzyste miejsce do zarządzania danymi konta i subskrypcją bez potrzeby kontaktu z supportem. Biznes zyskuje pojedynczy punkt zbierania zgód marketingowych i obsługi RODO (soft delete). Redukcja liczby zgłoszeń o dane subskrypcji dzięki self-service.

### 1.3. Zakres wpływu

Nowe komponenty/moduły:
- `src/pages/profile/info.astro`
- `src/pages/profile/subscription.astro`
- `src/pages/profile/payments.astro`
- `src/pages/profile/consents.astro`
- `src/pages/profile/delete-account.astro`
- `src/components/profile/ProfilePageWrapper.tsx`
- `src/components/profile/ProfileNav.tsx`
- `src/components/profile/sections/BasicInfoSection.tsx`
- `src/components/profile/sections/SubscriptionSection.tsx`
- `src/components/profile/sections/PaymentHistorySection.tsx`
- `src/components/profile/sections/ConsentsSection.tsx`
- `src/components/profile/sections/DeleteAccountSection.tsx`
- `src/hooks/useProfileData.ts`
- `src/services/profile.service.ts`
- `src/types/profile.types.ts`
- `src/pages/api/profile/consents.ts`
- `e2e/profile.spec.ts`

Modyfikowane komponenty/moduły:
- `src/components/layout/AvatarMenu.tsx` — link do profilu w dropdownie, usunięcie otwierania AccountModal
- `src/middleware/index.ts` — dodanie `/profile` do chronionych tras page-level
- `src/components/layout/AppLayout.tsx` — obsługa trybu layoutu profilu (sidebarContent z ProfileNav)

Grupa docelowa użytkowników: wszyscy zalogowani użytkownicy.
Dotknięte środowiska: development, staging, production.

### 1.4. Priorytet i MVP scope

HIGH — feature bezpośrednio obsługuje wymagania RODO (usunięcie konta, zgody), zastępuje modal konta pełną sekcją profilu.

MVP (must-have):
- Routing `/profile/*` z ochroną middleware (tylko zalogowani)
- Lewa nawigacja profilu zastępująca sidebar biznesowy na podstronach profilu
- Link w `AvatarMenu` zamiast obecnego `AccountModal`
- Podstrona: podstawowe informacje (email + link do flow `reset-password`)
- Podstrona: status subskrypcji (reuse `SubscriptionStatus.tsx` + `ManageSubscriptionButton.tsx`)
- Podstrona: historia wpłat (dane z `stripe_webhook_events` / `app_users`)
- Podstrona: zgody marketingowe (checkboxy z zapisem przez `PATCH /api/users/me`)
- Podstrona: usunięcie konta (potwierdzenie + `DELETE /api/users/me` — soft delete już istnieje)

Nice-to-have (może być dodane później):
- Paginacja historii wpłat
- Potwierdzenie hasłem przy usunięciu konta
- Upload avatara użytkownika
- Eksport danych konta (RODO art. 20)

---

## 2. Szczegółowa analiza wymagań

### 2.1. Wymagania funkcjonalne

1. Link "Moje konto" / "Profil" w dropdownie `AvatarMenu` kieruje do `/profile/info` — MUST
2. Każda podstrona `/profile/*` jest dostępna tylko dla zalogowanego użytkownika — MUST
3. Każda podstrona renderuje `AppLayout` z `sidebarContent={<ProfileNav />}` zamiast `DashboardSidebar` — MUST
4. `ProfileNav` wyświetla aktywny link z `aria-current="page"` — MUST
5. Podstrona `/profile/info` pokazuje email z Supabase auth i link do `/auth/forgot-password` jako flow zmiany hasła — MUST
6. Podstrona `/profile/subscription` reużywa `SubscriptionStatus` i `ManageSubscriptionButton` — MUST
7. Podstrona `/profile/payments` listuje historię transakcji z tabeli `stripe_webhook_events` filtrowanej po `user_id` — MUST
8. Podstrona `/profile/consents` zapisuje zgody marketingowe w polu `metadata` użytkownika przez `PATCH /api/users/me` — MUST
9. Podstrona `/profile/delete-account` wywołuje `DELETE /api/users/me` po potwierdzeniu przez użytkownika — MUST
10. Po soft delete użytkownik jest wylogowywany i przekierowywany na stronę główną — MUST
11. Dane widoczne tylko dla zalogowanego użytkownika (RLS Supabase + weryfikacja `auth_uid`) — MUST

### 2.2. Wymagania niefunkcjonalne

- Performance: pierwsze renderowanie podstrony profilu < 300 ms; dane subskrypcji i historii ładowane client-side z loading state
- Security: każdy API endpoint weryfikuje `auth_uid` z tokenu; brak możliwości odczytu/modyfikacji danych innego użytkownika; soft delete zgodny z RODO
- Accessibility: WCAG 2.1 AA; `aria-current="page"` w nawigacji profilu; widoczny focus w menu; etykiety formularzy (`<label htmlFor>`)
- SEO: brak indeksowania (`noindex` na stronach profilu — dane prywatne)
- Compatibility: responsywny layout; na mobile `ProfileNav` jako drawer/accordion

### 2.3. User stories i use cases

#### User Story 1: Dostęp do profilu z menu

Jako zalogowany użytkownik
chcę kliknąć "Profil" w dropdownie avatara
aby przejść do obszaru zarządzania kontem

Acceptance Criteria:
- [ ] Link "Profil" widoczny w dropdownie avatara po zalogowaniu
- [ ] Kliknięcie przenosi na `/profile/info`
- [ ] Lewa nawigacja profilu widoczna, sidebar biznesowy niewidoczny
- [ ] Aktywna zakładka "Informacje" podświetlona w nawigacji

#### User Story 2: Przegląd i zmiana danych konta

Jako zalogowany użytkownik
chcę zobaczyć swój email i mieć dostęp do zmiany hasła
aby móc zarządzać podstawowymi danymi konta

Acceptance Criteria:
- [ ] Email widoczny na `/profile/info`
- [ ] Przycisk/link "Zmień hasło" przenosi do `/auth/forgot-password`
- [ ] Dane dotyczą wyłącznie zalogowanego użytkownika

#### User Story 3: Zarządzanie subskrypcją

Jako zalogowany użytkownik
chcę zobaczyć status swojej subskrypcji i zarządzać nią
aby wiedzieć kiedy wygasa dostęp i móc go odnowić

Acceptance Criteria:
- [ ] `/profile/subscription` pokazuje status (trial/active/canceled/past_due)
- [ ] Data wygaśnięcia/odnowienia widoczna
- [ ] Przycisk zarządzania subskrypcją działa (reuse `ManageSubscriptionButton`)

#### User Story 4: Historia wpłat

Jako zalogowany użytkownik
chcę zobaczyć historię moich płatności za subskrypcję
aby móc kontrolować wydatki i mieć dostęp do informacji o transakcjach

Acceptance Criteria:
- [ ] `/profile/payments` listuje transakcje z daty od najnowszej
- [ ] Dla każdej transakcji widoczna: data, kwota, status
- [ ] Brak transakcji pokazuje stan pusty z informacją
- [ ] Dane dotyczą wyłącznie zalogowanego użytkownika

#### User Story 5: Zgody marketingowe

Jako zalogowany użytkownik
chcę zarządzać swoimi zgodami marketingowymi
aby kontrolować jakie komunikaty mogę otrzymywać

Acceptance Criteria:
- [ ] `/profile/consents` pokazuje checkboxy zgód (newsletter, powiadomienia email)
- [ ] Zmiana stanu checkboxa zapisuje się w bazie przez `PATCH /api/users/me`
- [ ] Po zapisie widoczny toast z potwierdzeniem
- [ ] Aktualny stan zgód ładowany przy wejściu na stronę

#### User Story 6: Usunięcie konta

Jako zalogowany użytkownik
chcę mieć możliwość usunięcia konta
aby móc zakończyć korzystanie z usługi zgodnie z RODO

Acceptance Criteria:
- [ ] `/profile/delete-account` wymaga potwierdzenia (checkbox + przycisk)
- [ ] Wywołuje `DELETE /api/users/me` (soft delete, `deleted_at` ustawiane)
- [ ] Po sukcesie użytkownik jest wylogowywany i przekierowywany na `/`
- [ ] Przycisk nieaktywny bez potwierdzenia

### 2.4. Edge cases i scenariusze alternatywne

- Brak sesji na `/profile/*`: middleware przekierowuje do `/auth/login`
- Brak danych subskrypcji (nowy użytkownik bez Stripe customer): placeholder "Brak aktywnej subskrypcji" + przycisk zakupu
- Brak historii wpłat: empty state "Brak historii płatności"
- Błąd zapisu zgód: toast error, stan checkboksów cofany do poprzedniego
- Wywołanie usunięcia konta bez potwierdzenia: przycisk disabled (aria-disabled)
- Użytkownik z już usuniętym kontem (`deleted_at` != null) próbuje zalogować — obsługa przez istniejący middleware (`.is("deleted_at", null)`)
- Błąd sieci podczas `DELETE /api/users/me`: toast error, konto nie jest usuwane

### 2.5. Integracje i zależności

#### Wewnętrzne zależności:
- `AppLayout.tsx` — używany przez każdą stronę profilu z `showSidebar={true}` i `sidebarContent={<ProfileNav />}`
- `AuthContext` — dostarcza `user`, `profile`, `signOut` dla komponentów profilu
- `SubscriptionStatus.tsx` — reużywany na `/profile/subscription`
- `ManageSubscriptionButton.tsx` — reużywany na `/profile/subscription`
- `DashboardSidebar.tsx` — NIE używany na stronach profilu
- `useAuth` hook — dostarcza dane sesji w komponentach profilu

#### External APIs / Third-party services:
- `GET /api/subscriptions/status` — status subskrypcji dla `SubscriptionSection`
- `GET /api/users/me` — profil użytkownika (email z `supabase.auth.getUser`)
- `PATCH /api/users/me` — zapis zgód marketingowych w `metadata`
- `DELETE /api/users/me` — soft delete konta
- `POST /api/profile/consents` — nowy endpoint (alternatywnie przez PATCH `/api/users/me`)
- Supabase `stripe_webhook_events` — historia wpłat (filtr po `user_id`)

#### Zależności od innych features:
- Webhooki Stripe muszą być aktywne i zapisywać eventy `invoice.payment_succeeded` aby historia wpłat była kompletna
- Istniejący flow `reset-password` jest reużywany bez modyfikacji

---

## 3. Architektura i design

### 3.1. Diagram architektury

```
[Użytkownik] -> [AvatarMenu dropdown] -> [/profile/info]
                                               |
                          [Layout.astro + AppLayout (showSidebar=true)]
                                    |                    |
                              [ProfileNav]        [ProfilePageWrapper]
                           (lewa nawigacja)               |
                                               +-----------+-----------+
                                               |           |           |
                                      [BasicInfo]  [Subscription] [Payments]
                                      [Consents]  [DeleteAccount]
                                               |
                               [useProfileData hook]
                                               |
                          +--------------------+--------------------+
                          |                    |                    |
                  [GET /api/users/me]  [GET /api/subscriptions/status]  [stripe_webhook_events]
                          |                    |                    |
                     [Supabase]           [Supabase/Stripe]     [Supabase]
```

### 3.2. Flow danych

1. Użytkownik klika "Profil" w `AvatarMenu`
2. Przeglądarka przechodzi do `/profile/info`
3. Middleware sprawdza sesję — brak sesji = redirect do `/auth/login`
4. Astro renderuje `Layout.astro` + `ProfilePageWrapper` z `client:load`
5. `ProfilePageWrapper` renderuje `AppLayout` z `sidebarContent={<ProfileNav currentPath />}`
6. `ProfileNav` renderuje linki z `aria-current="page"` dla aktywnej zakładki
7. Aktywna sekcja (np. `BasicInfoSection`) montuje się i wywołuje `useProfileData`
8. Hook wysyła `GET /api/users/me` z tokenem sesji z `AuthContext`
9. API zwraca dane profilu, hook ustawia stan (loading → data/error)
10. UI renderuje dane lub skeleton/error state
11. Dla akcji mutujących (zgody, usunięcie): komponent wysyła PATCH/DELETE, po sukcesie toast + ewentualny signOut/redirect

### 3.3. Model danych

#### Nowe typy/interfejsy w `src/types/profile.types.ts`:

```typescript
export interface MarketingConsents {
  newsletter: boolean;
  email_notifications: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  event_type: string;
  amount: number | null;
  currency: string | null;
  status: string;
  created_at: string;
}

export interface ProfileBasicInfo {
  email: string;
  created_at: string;
}
```

#### Modyfikacje istniejących tabel:

Zgody marketingowe przechowywane w istniejącym polu `metadata` (JSONB) tabeli `app_users` pod kluczem `marketing_consents`. Brak migracji SQL wymagany — pole `metadata` już istnieje i akceptuje dowolny JSON.

Klucz: `app_users.metadata.marketing_consents: MarketingConsents`

Historia wpłat czytana z istniejącej tabeli `stripe_webhook_events` — filtrowanie po `user_id`. Ewentualnie przez dedykowany endpoint jeśli tabela nie zawiera wystarczających danych. Brak nowych tabel.

### 3.4. Komponenty i moduły

#### Nowe komponenty:

- `src/components/profile/ProfilePageWrapper.tsx` — wrapper React z `AppLayout`, przekazuje `ProfileNav` jako `sidebarContent`
- `src/components/profile/ProfileNav.tsx` — nawigacja profilu (reuse wzorca z `DashboardSidebar` — te same klasy CSS, ten sam pattern `aria-current`)
- `src/components/profile/sections/BasicInfoSection.tsx` — email + link do reset-password
- `src/components/profile/sections/SubscriptionSection.tsx` — reuse `SubscriptionStatus` + `ManageSubscriptionButton`
- `src/components/profile/sections/PaymentHistorySection.tsx` — lista transakcji z tabeli webhook events
- `src/components/profile/sections/ConsentsSection.tsx` — checkboxy zgód z zapisem przez PATCH
- `src/components/profile/sections/DeleteAccountSection.tsx` — potwierdzenie + DELETE

#### Modyfikowane komponenty:

- `src/components/layout/AvatarMenu.tsx` — dodanie linku `/profile/info`, usunięcie lub zachowanie `AccountModal` (patrz sekcja 4)
- `src/middleware/index.ts` — dodanie `/profile` do `AUTH_ONLY_ROUTES` (page-level guard)

#### Nowe strony Astro:

- `src/pages/profile/info.astro`
- `src/pages/profile/subscription.astro`
- `src/pages/profile/payments.astro`
- `src/pages/profile/consents.astro`
- `src/pages/profile/delete-account.astro`

#### Nowe hooki:

- `src/hooks/useProfileData.ts` — fetchowanie danych profilu z loading/error state

#### Nowe serwisy:

- `src/services/profile.service.ts` — logika pobierania historii wpłat z `stripe_webhook_events`

#### Nowe API endpoints:

- `GET /api/profile/payments` — lista wpłat użytkownika (filtrowanie `stripe_webhook_events` po `user_id`)

---

## 4. Propozycje podejść architektonicznych

### 4.1. Podejście A (REKOMENDOWANE) — Nowe strony Astro z ProfilePageWrapper

#### Opis:

Każda podstrona profilu to osobny plik `.astro` w `src/pages/profile/`. Każdy plik renderuje `ProfilePageWrapper` (komponent React z `client:load`) który dostarcza `AppLayout` z `ProfileNav` jako sidebar. Dane ładowane client-side przez `useProfileData` hook.

#### Architektura:

- Routing: natywny Astro file-based routing (`/profile/info`, `/profile/subscription` itd.)
- Layout: `ProfilePageWrapper` reużywa istniejący `AppLayout` z `showSidebar={true}` i podmienionymi `sidebarContent`
- Dane: client-side fetch przez hooki, osobny hook per sekcja lub wspólny `useProfileData`
- State: lokalny stan komponentu + `AuthContext` — brak zewnętrznego state managementu

#### Zakres zmian:

Nowe pliki:
```
src/pages/profile/info.astro
src/pages/profile/subscription.astro
src/pages/profile/payments.astro
src/pages/profile/consents.astro
src/pages/profile/delete-account.astro
src/components/profile/ProfilePageWrapper.tsx
src/components/profile/ProfileNav.tsx
src/components/profile/sections/BasicInfoSection.tsx
src/components/profile/sections/SubscriptionSection.tsx
src/components/profile/sections/PaymentHistorySection.tsx
src/components/profile/sections/ConsentsSection.tsx
src/components/profile/sections/DeleteAccountSection.tsx
src/hooks/useProfileData.ts
src/services/profile.service.ts
src/types/profile.types.ts
src/pages/api/profile/payments.ts
e2e/profile.spec.ts
```

Modyfikowane pliki:
```
src/components/layout/AvatarMenu.tsx
src/middleware/index.ts
```

Nowe dependencies: brak
Database migrations: brak (metadata JSONB już istnieje)
Testy: unit (sekcje, hook), E2E (Playwright)

#### Zalety:

- Maksymalny reuse istniejących komponentów (`AppLayout`, `DashboardSidebar` pattern, `SubscriptionStatus`, `ManageSubscriptionButton`)
- Jasny routing, każda podstrona to osobny URL (deeplink-able, bookmark-able)
- Pełna ochrona middleware na poziomie strony
- Spójność z istniejącym wzorcem dashboardu
- Brak nowych dependencies

#### Wady:

- Więcej plików niż rozwiązanie z jedną stroną + zakładkami
- Każde przejście między zakładkami to nawigacja strony (nie SPA switch)

#### Effort: L (3–5 dni)

#### Złożoność: MEDIUM

#### Impact na system: MEDIUM — modyfikuje `AvatarMenu` i `middleware`, nie dotyka core biznesowych widoków

#### Zgodność ze standardami:

- Copilot-instructions.md: ✅ — hooks, functional components, accessibility ARIA, Tailwind, Astro islands
- Tech-stack.md: ✅ — Astro + React, Supabase, Stripe, bez nowych deps
- Best practices: ✅ — separation of concerns, reuse, RLS enforcement

---

### 4.2. Podejście B — Jedna strona `/profile` z zakładkami React (SPA-style)

#### Opis:

Jedna strona `src/pages/profile.astro` renderuje jeden duży komponent React z wewnętrznym stanem zakładki. URL nie zmienia się przy przełączaniu zakładek.

#### Zalety:

- Mniej plików Astro
- Szybsze przełączanie zakładek (bez pełnej nawigacji strony)

#### Wady:

- Brak deeplinków do poszczególnych sekcji
- Trudniejszy routing ochrony middleware (jedna trasa zamiast pięciu)
- Duży komponent trudniejszy do testowania i utrzymania
- Sprzeczne z obecnym wzorcem file-based routing Astro

#### Effort: M

#### Złożoność: MEDIUM

#### Impact na system: LOW

---

## 5. Rekomendacja i uzasadnienie

### 5.1. Wybrane podejście

Podejście A

### 5.2. Uzasadnienie wyboru

- Najlepiej realizuje wymagania biznesowe: każda sekcja jest osobnym URL-em — ułatwia support ("wejdź na /profile/payments"), umożliwia bezpośrednie linki z emaili transakcyjnych
- Skaluje się w przyszłości: dodanie nowej sekcji profilu = nowy plik `.astro` + nowy komponent sekcji
- Zgodne z architekturą projektu: ten sam wzorzec co dashboard (`dashboard.astro` + `DashboardPageWrapper`)
- Minimalizuje dług techniczny: reuse `AppLayout`, `DashboardSidebar` pattern, istniejące serwisy
- Optymalizuje UX: pełna ochrona middleware na każdej podstronie, widoczny URL w pasku przeglądarki

---

## 6. Szczegółowy plan implementacji

### 6.1. Faza 1: Przygotowanie

- [ ] Utworzenie brancha: `feature/user-profile`
- [ ] Weryfikacja struktury `stripe_webhook_events` w Supabase (kolumny: `user_id`, `event_type`, `amount`, `currency`, `created_at`)
- [ ] Ustalenie kluczy zgód w `metadata` — przyjęty klucz: `marketing_consents`

### 6.2. Faza 2: Typy i interfejsy

#### Krok 1: Nowe typy profilu

Cel: zdefiniować interfejsy dla danych profilu, historii płatności i zgód

Plik do stworzenia: `src/types/profile.types.ts`

```typescript
export interface MarketingConsents {
  newsletter: boolean;
  email_notifications: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  event_type: string;
  amount: number | null;
  currency: string | null;
  status: string;
  created_at: string;
}

export interface ProfileBasicInfo {
  email: string;
  created_at: string | null;
}

export type ProfileSection =
  | "info"
  | "subscription"
  | "payments"
  | "consents"
  | "delete-account";
```

Acceptance criteria:
- [ ] Typy importowalne przez komponenty sekcji i hooki

---

### 6.3. Faza 3: Serwis i API

#### Krok 2: Serwis historii płatności

Cel: logika pobierania historii wpłat użytkownika z `stripe_webhook_events`

Plik do stworzenia: `src/services/profile.service.ts`

```typescript
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../db/database.types";
import type { PaymentHistoryItem } from "../types/profile.types";

export class ProfileService {
  constructor(private supabase: SupabaseClient<Database>) {}

  async getPaymentHistory(authUid: string): Promise<PaymentHistoryItem[]> {
    const { data, error } = await this.supabase
      .from("stripe_webhook_events")
      .select("id, event_type, created_at, metadata")
      .eq("user_id", authUid)
      .in("event_type", ["invoice.payment_succeeded", "invoice.payment_failed"])
      .order("created_at", { ascending: false })
      .limit(50);

    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      event_type: row.event_type,
      amount: (row.metadata as Record<string, unknown>)?.amount_paid as number | null,
      currency: (row.metadata as Record<string, unknown>)?.currency as string | null,
      status: row.event_type === "invoice.payment_succeeded" ? "success" : "failed",
      created_at: row.created_at,
    }));
  }
}
```

Acceptance criteria:
- [ ] Metoda zwraca listę posortowaną od najnowszej
- [ ] Filtruje wyłącznie po `user_id` zalogowanego użytkownika

#### Krok 3: Endpoint historii płatności

Cel: API endpoint `GET /api/profile/payments` zwracający historię wpłat

Plik do stworzenia: `src/pages/api/profile/payments.ts`

```typescript
import type { APIRoute } from "astro";
import { ProfileService } from "@/services/profile.service";
import { getAuthUid } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const { supabase } = locals;

  const authUid = await getAuthUid(request, supabase);
  if (!authUid) {
    return createErrorResponse("Unauthorized", 401, "UNAUTHORIZED");
  }

  const profileService = new ProfileService(supabase);
  const payments = await profileService.getPaymentHistory(authUid);

  return createSuccessResponse({ payments }, 200);
};
```

Acceptance criteria:
- [ ] Zwraca 401 bez tokenu
- [ ] Zwraca listę transakcji lub pustą tablicę

---

### 6.4. Faza 4: Hook danych profilu

#### Krok 4: useProfileData

Cel: centralny hook do pobierania danych profilu z loading/error state

Plik do stworzenia: `src/hooks/useProfileData.ts`

```typescript
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { PaymentHistoryItem, MarketingConsents } from "@/types/profile.types";

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

export function useProfileData(section: "payments" | "consents"): ProfileDataState {
  const { session } = useAuth();
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [consents, setConsents] = useState<MarketingConsents>(DEFAULT_CONSENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!session?.access_token) return;

    setIsLoading(true);
    setError(null);

    try {
      if (section === "payments") {
        const res = await fetch("/api/profile/payments", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) throw new Error("Błąd ładowania historii płatności");
        const data = await res.json();
        setPayments(data.data.payments);
      }

      if (section === "consents") {
        const res = await fetch("/api/users/me", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) throw new Error("Błąd ładowania danych profilu");
        const data = await res.json();
        const meta = data.data?.user?.metadata?.marketing_consents ?? DEFAULT_CONSENTS;
        setConsents(meta);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setIsLoading(false);
    }
  }, [section, session?.access_token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { payments, consents, isLoading, error, refetch: fetchData };
}
```

Acceptance criteria:
- [ ] Loading state przy pierwszym renderze
- [ ] Error state gdy fetch się nie powiedzie
- [ ] `refetch` pozwala na ręczne odświeżenie danych

---

### 6.5. Faza 5: Komponenty nawigacji i layout profilu

#### Krok 5: ProfileNav

Cel: lewa nawigacja profilu wzorowana na `DashboardSidebar` z `aria-current`

Plik do stworzenia: `src/components/profile/ProfileNav.tsx`

```typescript
import { User, CreditCard, Receipt, Bell, Trash2 } from "lucide-react";

interface ProfileNavProps {
  currentPath: string;
}

const NAV_ITEMS = [
  { id: "info", label: "Informacje", href: "/profile/info", icon: User },
  { id: "subscription", label: "Subskrypcja", href: "/profile/subscription", icon: CreditCard },
  { id: "payments", label: "Historia wpłat", href: "/profile/payments", icon: Receipt },
  { id: "consents", label: "Zgody", href: "/profile/consents", icon: Bell },
  { id: "delete-account", label: "Usuń konto", href: "/profile/delete-account", icon: Trash2 },
];

export function ProfileNav({ currentPath }: ProfileNavProps) {
  return (
    <aside
      className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background"
      aria-label="Nawigacja profilu"
    >
      <nav className="flex h-full flex-col p-4">
        <ul className="space-y-2" role="list">
          {NAV_ITEMS.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                    ${isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
```

Acceptance criteria:
- [ ] Aktywny element ma `aria-current="page"` i wizualne wyróżnienie
- [ ] Ikony mają `aria-hidden="true"`
- [ ] Nawigacja jest focusowalna klawiaturą

#### Krok 6: ProfilePageWrapper

Cel: wrapper React dostarczający `AppLayout` z `ProfileNav` jako sidebarContent

Plik do stworzenia: `src/components/profile/ProfilePageWrapper.tsx`

```typescript
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { ProfileNav } from "./ProfileNav";

interface ProfilePageWrapperProps {
  currentPath: string;
  children: React.ReactNode;
}

export function ProfilePageWrapper({ currentPath, children }: ProfilePageWrapperProps) {
  return (
    <AppLayout
      scrollable={true}
      showSidebar={true}
      sidebarContent={<ProfileNav currentPath={currentPath} />}
      header={<Header />}
      showSubscriptionBanner={false}
    >
      <div className="p-6 lg:p-8">
        {children}
      </div>
    </AppLayout>
  );
}
```

Acceptance criteria:
- [ ] Sidebar profilu widoczny, sidebar biznesowy niewidoczny
- [ ] Banner subskrypcji wyłączony na stronach profilu (nie dominuje UI)

---

### 6.6. Faza 6: Sekcje profilu

#### Krok 7: BasicInfoSection

Plik do stworzenia: `src/components/profile/sections/BasicInfoSection.tsx`

```typescript
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Mail, KeyRound } from "lucide-react";

export function BasicInfoSection() {
  const { user } = useAuth();

  return (
    <section aria-labelledby="basic-info-heading">
      <h1 id="basic-info-heading" className="mb-6 text-2xl font-semibold">
        Informacje o koncie
      </h1>
      <div className="space-y-6 rounded-lg border p-6">
        <div>
          <label className="mb-1 block text-sm font-medium text-muted-foreground">
            Adres email
          </label>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm">{user?.email}</span>
          </div>
        </div>
        <div className="border-t pt-4">
          <p className="mb-3 text-sm text-muted-foreground">
            Aby zmienić hasło, wyślemy Ci link resetujący na Twój adres email.
          </p>
          <Button asChild variant="outline">
            <a href="/auth/forgot-password">
              <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
              Zmień hasło
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

#### Krok 8: SubscriptionSection

Plik do stworzenia: `src/components/profile/sections/SubscriptionSection.tsx`

```typescript
import { useAuth } from "@/contexts/AuthContext";
import { SubscriptionStatus } from "@/components/account/SubscriptionStatus";
import { ManageSubscriptionButton } from "@/components/account/ManageSubscriptionButton";
import { Skeleton } from "@/components/ui/skeleton";

export function SubscriptionSection() {
  const { profile, isLoading } = useAuth();

  return (
    <section aria-labelledby="subscription-heading">
      <h1 id="subscription-heading" className="mb-6 text-2xl font-semibold">
        Subskrypcja
      </h1>
      {isLoading ? (
        <Skeleton className="h-32 w-full rounded-lg" />
      ) : profile ? (
        <div className="space-y-4">
          <SubscriptionStatus profile={profile} />
          <ManageSubscriptionButton />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Nie udało się załadować danych subskrypcji.</p>
      )}
    </section>
  );
}
```

#### Krok 9: PaymentHistorySection

Plik do stworzenia: `src/components/profile/sections/PaymentHistorySection.tsx`

```typescript
import { useProfileData } from "@/hooks/useProfileData";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/ui-utils";

export function PaymentHistorySection() {
  const { payments, isLoading, error } = useProfileData("payments");

  return (
    <section aria-labelledby="payments-heading">
      <h1 id="payments-heading" className="mb-6 text-2xl font-semibold">
        Historia wpłat
      </h1>
      {isLoading && <Skeleton className="h-40 w-full rounded-lg" />}
      {error && <p className="text-sm text-destructive">{error}</p>}
      {!isLoading && !error && payments.length === 0 && (
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          Brak historii płatności
        </div>
      )}
      {!isLoading && payments.length > 0 && (
        <ul className="space-y-2" role="list">
          {payments.map((payment) => (
            <li key={payment.id} className="flex items-center justify-between rounded-lg border p-4 text-sm">
              <span className="text-muted-foreground">{formatDate(payment.created_at)}</span>
              <span>
                {payment.amount != null
                  ? `${(payment.amount / 100).toFixed(2)} ${(payment.currency ?? "").toUpperCase()}`
                  : "—"}
              </span>
              <span
                className={payment.status === "success"
                  ? "text-green-600"
                  : "text-destructive"}
              >
                {payment.status === "success" ? "Sukces" : "Niepowodzenie"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

#### Krok 10: ConsentsSection

Plik do stworzenia: `src/components/profile/sections/ConsentsSection.tsx`

```typescript
import { useState } from "react";
import { useProfileData } from "@/hooks/useProfileData";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { MarketingConsents } from "@/types/profile.types";

export function ConsentsSection() {
  const { consents: initialConsents, isLoading, error, refetch } = useProfileData("consents");
  const { session } = useAuth();
  const { addToast } = useToast();
  const [consents, setConsents] = useState<MarketingConsents>(initialConsents);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: keyof MarketingConsents) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }));
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
        body: JSON.stringify({ metadata: { marketing_consents: consents } }),
      });
      if (!res.ok) throw new Error();
      addToast({ type: "success", message: "Zgody zostały zapisane" });
      refetch();
    } catch {
      addToast({ type: "error", message: "Nie udało się zapisać zgód" });
      setConsents(initialConsents);
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
          {[
            { key: "newsletter" as const, label: "Newsletter — informacje o nowościach i aktualizacjach" },
            { key: "email_notifications" as const, label: "Powiadomienia email — ważne informacje o koncie" },
          ].map(({ key, label }) => (
            <label key={key} className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={consents[key]}
                onChange={() => handleChange(key)}
                className="mt-0.5 h-4 w-4 rounded border"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
          <div className="border-t pt-4">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Zapisywanie..." : "Zapisz zgody"}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
```

#### Krok 11: DeleteAccountSection

Plik do stworzenia: `src/components/profile/sections/DeleteAccountSection.tsx`

```typescript
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";

export function DeleteAccountSection() {
  const { session, signOut } = useAuth();
  const { addToast } = useToast();
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
      addToast({ type: "error", message: "Nie udało się usunąć konta. Spróbuj ponownie." });
      setIsDeleting(false);
    }
  };

  return (
    <section aria-labelledby="delete-heading">
      <h1 id="delete-heading" className="mb-6 text-2xl font-semibold">
        Usuń konto
      </h1>
      <div className="rounded-lg border border-destructive/30 p-6">
        <p className="mb-4 text-sm text-muted-foreground">
          Usunięcie konta jest nieodwracalne. Twoje dane zostaną oznaczone jako usunięte zgodnie z RODO. Aktywna subskrypcja nie zostanie automatycznie anulowana w Stripe.
        </p>
        <label className="mb-6 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border"
            id="confirm-delete"
          />
          <span className="text-sm">
            Rozumiem, że usunięcie konta jest nieodwracalne i chcę kontynuować.
          </span>
        </label>
        <Button
          variant="destructive"
          disabled={!confirmed || isDeleting}
          onClick={handleDelete}
          aria-disabled={!confirmed || isDeleting}
        >
          {isDeleting ? "Usuwanie..." : "Usuń konto"}
        </Button>
      </div>
    </section>
  );
}
```

---

### 6.7. Faza 7: Strony Astro

#### Krok 12: Strony profilu

Cel: pięć plików `.astro` w `src/pages/profile/` — ten sam wzorzec co `dashboard.astro`

Przykład `src/pages/profile/info.astro`:

```astro
---
import Layout from "@/layouts/Layout.astro";
import { ProfilePageWrapper } from "@/components/profile/ProfilePageWrapper";
import { BasicInfoSection } from "@/components/profile/sections/BasicInfoSection";
---

<Layout title="Informacje o koncie - Core Starter">
  <ProfilePageWrapper client:load currentPath="/profile/info">
    <BasicInfoSection client:load />
  </ProfilePageWrapper>
</Layout>
```

Ten sam wzorzec dla pozostałych 4 stron (z odpowiednimi sekcjami i tytułami).

Acceptance criteria:
- [ ] Każda strona renderuje `ProfilePageWrapper` z `client:load`
- [ ] Tytuł strony odzwierciedla aktywną sekcję

---

### 6.8. Faza 8: Modyfikacje istniejących plików

#### Krok 13: AvatarMenu — link do profilu

Plik do modyfikacji: `src/components/layout/AvatarMenu.tsx`

Zmiana: zastąpienie przycisku otwierającego `AccountModal` linkiem do `/profile/info`. `AccountModal` może pozostać jako fallback lub zostać usunięty w osobnym PR.

```typescript
// Zamienić:
<button onClick={handleOpenAccount}>Moje konto</button>

// Na:
<a href="/profile/info" className="flex w-full items-center gap-2 rounded px-3 py-2 text-sm hover:bg-muted" onClick={() => setIsOpen(false)}>
  <User className="h-4 w-4" />
  <span>Profil</span>
</a>
```

Acceptance criteria:
- [ ] Kliknięcie "Profil" w dropdownie zamyka menu i przenosi do `/profile/info`
- [ ] `AccountModal` nie jest już otwierany tym przyciskiem

#### Krok 14: Middleware — ochrona tras profilu

Plik do modyfikacji: `src/middleware/index.ts`

Zmiana: dodanie `/profile` do obsługi page-level auth guard

```typescript
// W istniejącej logice middleware dodać obsługę stron /profile/*
// które nie są API — przekierowanie do /auth/login gdy brak sesji
```

Acceptance criteria:
- [ ] Niezalogowany użytkownik na `/profile/*` jest przekierowywany do `/auth/login`

---

### 6.9. Faza 9: Testy E2E

#### Krok 15: profile.spec.ts

Plik do stworzenia: `e2e/profile.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Profile - nawigacja i dostęp", () => {
  test("niezalogowany użytkownik nie ma dostępu do profilu", async ({ page }) => {
    await page.goto("/profile/info");
    await expect(page).toHaveURL(/auth\/login/);
  });

  test("zalogowany użytkownik widzi profil z nawigacją", async ({ page }) => {
    // setup sesji przez helpers.ts
    await page.goto("/profile/info");
    await expect(page.getByRole("navigation", { name: "Nawigacja profilu" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Informacje", current: "page" })).toBeVisible();
  });

  test("zalogowany użytkownik widzi email na /profile/info", async ({ page }) => {
    await page.goto("/profile/info");
    await expect(page.getByText("@")).toBeVisible();
  });

  test("przełączanie zakładek nawigacji profilu", async ({ page }) => {
    await page.goto("/profile/info");
    await page.getByRole("link", { name: "Subskrypcja" }).click();
    await expect(page).toHaveURL("/profile/subscription");
    await expect(page.getByRole("link", { name: "Subskrypcja", current: "page" })).toBeVisible();
  });

  test("usunięcie konta wymaga potwierdzenia", async ({ page }) => {
    await page.goto("/profile/delete-account");
    const deleteButton = page.getByRole("button", { name: /Usuń konto/ });
    await expect(deleteButton).toBeDisabled();
    await page.getByRole("checkbox").check();
    await expect(deleteButton).toBeEnabled();
  });
});
```

Acceptance criteria:
- [ ] Testy pokrywają brak dostępu, nawigację, zakładki, usunięcie konta

---

## 7. Plan weryfikacji i testowania

### 7.1. Unit tests checklist

- [ ] `ProfileNav` — renderuje linki, aktywny element ma `aria-current="page"`
- [ ] `DeleteAccountSection` — przycisk disabled bez potwierdzenia, enabled po zaznaczeniu checkboxa
- [ ] `ConsentsSection` — zmiana checkboxa aktualizuje lokalny stan, submit wywołuje PATCH
- [ ] `useProfileData` — loading/error/data states

### 7.2. Integration tests checklist

- [ ] `GET /api/profile/payments` — 401 bez tokenu, 200 z poprawnym tokenem
- [ ] `PATCH /api/users/me` z `marketing_consents` — zapis w metadata
- [ ] `DELETE /api/users/me` — soft delete + audit log

### 7.3. E2E tests checklist

- [ ] Niezalogowany → redirect do login
- [ ] Link w AvatarMenu → przejście do profilu
- [ ] Wszystkie 5 zakładek dostępnych i przełączalnych
- [ ] Zgody: zmiana + zapis + toast
- [ ] Usunięcie: bez potwierdzenia disabled, po potwierdzeniu enabled + soft delete + redirect

### 7.4. Manual testing checklist

- [ ] Responsywność na mobile (320px–768px)
- [ ] Dark mode (istniejący ThemeProvider)
- [ ] Keyboard navigation — wszystkie elementy nawigacji profilu focusowalne
- [ ] Screen reader — `aria-current`, `aria-labelledby` poprawne
- [ ] Brak danych subskrypcji — pusty stan widoczny

### 7.5. Regression testing

- [ ] `dashboard.astro` — sidebar biznesowy niezmieniony
- [ ] `AvatarMenu` — wylogowanie wciąż działa
- [ ] `AccountModal` — jeśli zachowany, nie koliduje z nowym flow
- [ ] Middleware — istniejące trasy `/api/users/me` i `/api/subscriptions/status` niezmienione

---

## 8. Analiza ryzyka i mitigation

### 8.1. Zidentyfikowane ryzyka

#### Ryzyko 1: Brak danych w `stripe_webhook_events` dla historii płatności

- Severity: MEDIUM
- Prawdopodobieństwo: MEDIUM (zależy od tego czy webhooki były aktywne od początku)
- Wpływ: pusta historia wpłat dla istniejących użytkowników
- Mitigation: obsługa empty state, jasny komunikat użytkownikowi
- Contingency plan: placeholder "Historia ładowana po pierwszym odnowieniu subskrypcji"

#### Ryzyko 2: Metadata JSONB — konflikt kluczy przy `PATCH /api/users/me`

- Severity: MEDIUM
- Prawdopodobieństwo: LOW (metadata już używana w projekcie)
- Wpływ: nadpisanie innych kluczy metadata przy zapisie zgód
- Mitigation: w `ConsentsSection` wysyłać tylko `{ metadata: { marketing_consents: ... } }` — istniejący endpoint merguje metadata
- Contingency plan: weryfikacja implementacji `updateUserMetadata` — czy merge czy replace

#### Ryzyko 3: AccountModal vs nowy profil — duplikacja danych konta

- Severity: LOW
- Prawdopodobieństwo: HIGH (AccountModal istnieje i jest funkcjonalny)
- Wpływ: dwa miejsca z danymi konta, niejednorodne UX
- Mitigation: usunąć przycisk "Moje konto" otwierający AccountModal z AvatarMenu — zachować AccountModal ale nie linkować z dropdown
- Contingency plan: usunąć AccountModal w osobnym PR po potwierdzeniu że profil jest kompletny

### 8.2. Technical debt i trade-offs

- `useProfileData` obsługuje zarówno `payments` jak i `consents` — uproszczenie vs osobne hooki. Przy wzroście złożoności powinno zostać rozbite na `usePaymentHistory` i `useConsents`.
- Dane subskrypcji pobierane przez `AuthContext` (już załadowane) zamiast przez nowy fetch — zmniejsza liczbę requestów, ale uzależnia od zakresu danych w kontekście.

### 8.3. Rollback plan

1. Usunąć pliki `src/pages/profile/*`
2. Przywrócić `AvatarMenu.tsx` z git (przywrócić `AccountModal` jako handler)
3. Usunąć `/profile` z `AUTH_ONLY_ROUTES` w middleware
4. Nowe pliki komponentów i API nie wpływają na istniejące funkcjonalności — można zostawić lub usunąć

### 8.4. Monitoring i observability

- Śledzić 401/404 na `/api/profile/payments` po wdrożeniu
- Monitorować `DELETE /api/users/me` — liczba usunięć kont (alert przy anomalii)
- Sprawdzić adoption rate nowej sekcji profilu (sessions na `/profile/*`)

---

## 9. Zgodność ze standardami

### 9.1. Copilot-instructions.md compliance

- React patterns (hooks, functional components, memo): ✅ — `useProfileData`, `useCallback` w hookach, `React.memo` można dodać dla `ProfileNav`
- Astro patterns (islands, client:load): ✅ — `ProfilePageWrapper client:load`, sekcje jako React islands
- Accessibility (ARIA, WCAG): ✅ — `aria-current`, `aria-labelledby`, `aria-disabled`, semantyczne `<section>`, `<nav>`, `<ul>`
- TypeScript best practices: ✅ — pełne typowanie, DTO interfaces, brak `any`
- Testing patterns (Playwright, Page Object): ✅ — E2E spec z locators
- Styling (Tailwind): ✅ — spójne klasy z istniejącymi komponentami

### 9.2. Tech-stack.md compliance

- Framework compatibility (Astro + React): ✅
- New dependencies justified: ✅ — brak nowych dependencies
- Build tools compatibility: ✅

### 9.3. Security checklist

- [ ] Input validation — dane z PATCH metadata walidowane przez `isValidMetadata`
- [ ] Authorization — każdy endpoint weryfikuje `authUid` z tokenu
- [ ] Authentication — middleware blokuje dostęp do `/profile/*` bez sesji
- [ ] XSS protection — brak `dangerouslySetInnerHTML`
- [ ] CSRF protection — nie dotyczy (token Bearer, nie cookie-based)
- [ ] SQL injection protection — parametryzowane queries przez Supabase client
- [ ] Secrets management — brak hardcoded secrets
- [ ] Data privacy — RODO: soft delete, zgody marketingowe, brak danych innych użytkowników

### 9.4. Performance checklist

- [ ] Bundle size impact — brak nowych dependencies; nowe komponenty lazy-loadowane przez Astro islands
- [ ] Code splitting — każda podstrona to osobny chunk
- [ ] Rendering optimization — `useCallback` w `useProfileData`
- [ ] Loading states — `Skeleton` dla wszystkich sekcji ładujących dane
- [ ] Error boundaries — `ErrorBoundary.tsx` dostępny w projekcie, można owinąć `ProfilePageWrapper`

### 9.5. Accessibility checklist

- [ ] ARIA attributes — `aria-current="page"`, `aria-labelledby` dla sekcji, `aria-disabled` dla disabled button
- [ ] Keyboard navigation — linki i checkboxy focusowalne, TAB order logiczny
- [ ] Focus management — po nawigacji focus na heading sekcji (opcjonalnie)
- [ ] Semantic HTML — `<section>`, `<nav>`, `<aside>`, `<ul>`, `<label>`
- [ ] Color contrast — klasy Tailwind zgodne z istniejącym systemem (primary, muted, destructive)
- [ ] Form labels — wszystkie checkboxy mają `<label>` z `htmlFor`
- [ ] Error messages — `aria-live` lub toast dla błędów zapisu

---

## 10. Dokumentacja

### 10.1. Changelog entry

```markdown
### Added
- [Profil użytkownika] Dedykowane podstrony profilu (/profile/*) z nawigacją boczną: informacje, subskrypcja, historia wpłat, zgody marketingowe, usunięcie konta
```

### 10.2. Release notes

Dostępna sekcja "Profil" w menu użytkownika (avatar w prawym górnym rogu). Możliwość przeglądu stanu subskrypcji, historii wpłat, zarządzania zgodami marketingowymi oraz usunięcia konta.

---

## 11. Timeline i effort estimation

### 11.1. Estymacja czasu

- Faza 1–2 (przygotowanie + typy): 2 godziny
- Faza 3–4 (serwis + hook): 4 godziny
- Faza 5–6 (komponenty nawigacji + sekcje): 8 godzin
- Faza 7 (strony Astro): 2 godziny
- Faza 8 (modyfikacje istniejących plików): 2 godziny
- Faza 9 (testy E2E): 3 godziny
- Code review + fixes: 3 godziny

Łącznie: ~24 godziny (~3–4 dni)

### 11.2. Zależności i blokery

- Blokujące: weryfikacja struktury `stripe_webhook_events` (kolumna `user_id` i dane płatności)
- Blokowane przez ten feature: brak
- External dependencies: webhooki Stripe muszą być aktywne dla pełnej historii płatności

### 11.3. Milestones

- [ ] Milestone 1: Routing + layout profilu działa (fazy 1–2–5–7–8)
- [ ] Milestone 2: Wszystkie sekcje zaimplementowane (fazy 3–4–6)
- [ ] Milestone 3: Testy E2E przechodzą, feature gotowy do review (faza 9)

---

## 12. Załączniki

### 12.1. Pliki do utworzenia (lista pełna)

```
src/types/profile.types.ts
src/services/profile.service.ts
src/hooks/useProfileData.ts
src/pages/api/profile/payments.ts
src/components/profile/ProfilePageWrapper.tsx
src/components/profile/ProfileNav.tsx
src/components/profile/sections/BasicInfoSection.tsx
src/components/profile/sections/SubscriptionSection.tsx
src/components/profile/sections/PaymentHistorySection.tsx
src/components/profile/sections/ConsentsSection.tsx
src/components/profile/sections/DeleteAccountSection.tsx
src/pages/profile/info.astro
src/pages/profile/subscription.astro
src/pages/profile/payments.astro
src/pages/profile/consents.astro
src/pages/profile/delete-account.astro
e2e/profile.spec.ts
```

### 12.2. Pliki do modyfikacji (lista pełna)

```
src/components/layout/AvatarMenu.tsx
src/middleware/index.ts
```

### 12.3. Referencje

- Istniejący wzorzec: `src/pages/dashboard.astro` + `DashboardPageWrapper`
- Istniejące API: `src/pages/api/users/me.ts` (GET/PATCH/DELETE)
- Istniejące API: `src/pages/api/subscriptions/status.ts`
- Istniejące serwisy: `UserService`, `SubscriptionService`, `WebhookService`
- Istniejące komponenty: `SubscriptionStatus.tsx`, `ManageSubscriptionButton.tsx`, `DashboardSidebar.tsx`
- Flow zmiany hasła: `src/pages/auth/reset-password.astro` + `forgot-password.astro`

