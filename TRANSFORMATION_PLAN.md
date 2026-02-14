# 🔄 PLAN TRANSFORMACJI: Black Swan Grid → Core Starter

**Data utworzenia**: 2026-02-12  
**Status**: Gotowy do realizacji  
**Metodyka**: Iteracyjna (6 kroków)

---

## 🎯 CEL TRANSFORMACJI

Przekształcić projekt "Black Swan Grid" w uniwersalny starter "Core", który:
- Zachowuje pełną infrastrukturę auth + subscription + payments
- Usuwa funkcjonalność Black Swan (grid, events, NocoDB)
- Zawiera placeholdery do implementacji nowych funkcji premium
- Posiada kompletną dokumentację dla AI (STARTER_GUIDE.md)

---

## 📋 ZAKRES PRAC

### ✅ ZACHOWAĆ (Core Functionality)

1. **Autentykacja** (Supabase Auth)
   - Rejestracja, logowanie, wylogowanie
   - Reset hasła, forgot password
   - Potwierdzenie email
   - Session management
   - Protected routes (middleware)

2. **Subskrypcje i płatności** (Stripe)
   - Checkout flow
   - Webhook handling (subscription lifecycle)
   - Trial management (7 dni)
   - Customer portal
   - Subscription status banner

3. **Baza danych** (Supabase PostgreSQL)
   - Tabela `app_users` (profile użytkowników)
   - Migracje subscription schema
   - RLS policies

4. **UI Components**
   - Layout (Header, AppLayout)
   - Auth components (AuthForm, AuthPageWrapper)
   - Account management (AccountModal, AvatarMenu)
   - Subscription components (SubscriptionBanner, SubscriptionStatus)
   - Checkout components (CheckoutLoader)
   - UI primitives (button, card, dialog, drawer, etc.)

5. **Contexts**
   - AuthContext
   - ToastContext
   - ErrorBoundary

6. **Landing page**
   - Ogólna strona główna (bez Black Swan specifics)
   - CTA do rejestracji/logowania

7. **Testy**
   - auth.spec.ts (authentication flow)
   - checkout.spec.ts (checkout flow)
   - Usunąć wszystkie testy grid-*

### ❌ USUNĄĆ (Black Swan Specifics)

1. **Komponenty Grid**
   - `src/components/grid/*` (wszystkie 17 plików)
   - `src/components/event/*` (jeśli istnieje)
   - `src/components/summary/*` (jeśli istnieje)

2. **NocoDB Integration**
   - `src/services/nocodb.service.ts`
   - `src/lib/nocodb-client.ts`
   - `src/lib/nocodb-validation.ts`
   - `src/types/nocodb.types.ts`
   - `src/pages/api/nocodb/*`

3. **Strony Black Swan**
   - `src/pages/grid.astro`
   - `src/pages/event/*`

4. **Contexts specyficzne dla gridu**
   - `src/contexts/GridContext.tsx`

5. **Hooks specyficzne dla gridu**
   - `src/hooks/useClientCache.ts` (cache dla NocoDB)

6. **Testy E2E gridu**
   - `e2e/grid-*.spec.ts` (wszystkie pliki grid-*)
   - `e2e/helpers/mock-nocodb.helper.ts`
   - `e2e/fixtures/nocodb-mock.fixture.ts`

7. **Dokumentacja**
   - Wszystkie pliki w `docs/` (zostaw tylko nowy STARTER_GUIDE.md)

8. **Zmienne środowiskowe NocoDB**
   - Z `.env.example`

### 🔧 ZMODYFIKOWAĆ (Adaptacja)

1. **package.json**
   - Zmień nazwę na "core-starter"
   - Zaktualizuj opis
   - Usuń zależności NocoDB (jeśli są dedykowane)

2. **README.md**
   - Całkowita przebudowa (opis Core Starter)
   - Usunąć Black Swan specifics
   - Dodać sekcję "Quick Start for AI"

3. **Landing page** (`src/pages/index.astro`)
   - Ogólny opis startera
   - Funkcje: Auth, Subscriptions, Payments
   - CTA do rozpoczęcia trial

4. **Header** (`src/components/layout/Header.tsx`)
   - Usunąć `rangeSelector` i `filters` props
   - Zachować logo, avatarMenu
   - Logo zmienić na "Core" lub neutralne
   - Link do dashboard zamiast `/grid`

5. **Dashboard** (nowa strona)
   - `src/pages/dashboard.astro` (nowy plik)
   - Wyświetla status użytkownika (trial/active/expired)
   - Placeholder dla głównej funkcjonalności
   - Protected route

6. **API Services**
   - `src/lib/api-service.ts` - usunąć funkcje NocoDB, zachować Stripe
   - Dodać placeholder dla custom API endpoints

7. **Types**
   - Usunąć `nocodb.types.ts`
   - Zachować `subscription.types.ts`, `ui.types.ts`, `webhook.types.ts`
   - Dodać `app.types.ts` z podstawowymi typami dla custom features

8. **Middleware**
   - Zaktualizować protected routes (dashboard zamiast grid)

9. **Migracje Supabase**
   - Zachować tylko subscription-related migrations
   - Dodać komentarze "CORE STARTER - DO NOT MODIFY"

10. **ENV Variables**
    - Usunąć NOCODB_* z `.env.example`
    - Dodać sekcję z placeholder dla custom integrations

---

## 🔢 PLAN WYKONANIA (6 KROKÓW)

### **KROK 1: Przygotowanie i backup**
**Cel**: Zabezpieczyć się przed utratą danych

**Zadania**:
1. Utworzyć branch `transformation-to-core`
2. Commit obecnego stanu
3. Utworzyć listę wszystkich plików do usunięcia
4. Utworzyć listę wszystkich plików do modyfikacji

**Weryfikacja**:
- [ ] Branch utworzony
- [ ] Commit wykonany
- [ ] Listy plików gotowe

---

### **KROK 2: Usunięcie Black Swan components i services**
**Cel**: Usunąć wszystkie komponenty, serwisy i typy związane z Black Swan

**Zadania**:
1. Usunąć katalogi:
   - `src/components/grid/` (17 plików)
   - `src/components/event/` (jeśli istnieje)
   - `src/components/summary/` (jeśli istnieje)

2. Usunąć pliki serwisów:
   - `src/services/nocodb.service.ts`
   - `src/services/nocodb.service.test.ts`

3. Usunąć pliki lib:
   - `src/lib/nocodb-client.ts`
   - `src/lib/nocodb-validation.ts`

4. Usunąć typy:
   - `src/types/nocodb.types.ts`

5. Usunąć contexts:
   - `src/contexts/GridContext.tsx`

6. Usunąć hooks:
   - `src/hooks/useClientCache.ts`

7. Usunąć strony:
   - `src/pages/grid.astro`
   - `src/pages/event/` (cały katalog)
   - `src/pages/api/nocodb/` (cały katalog)

8. Usunąć testy E2E:
   - `e2e/grid-*.spec.ts` (wszystkie)
   - `e2e/helpers/mock-nocodb.helper.ts`
   - `e2e/fixtures/nocodb-mock.fixture.ts`

9. Usunąć dokumentację:
   - Wszystkie pliki `docs/*.md` (oprócz nowego STARTER_GUIDE.md)

**Weryfikacja**:
- [ ] Wszystkie pliki usunięte
- [ ] TypeScript errors checked (oczekiwane błędy w plikach używających usuniętych modułów)
- [ ] Git status sprawdzony

---

### **KROK 3: Utworzenie Dashboard i aktualizacja nawigacji**
**Cel**: Utworzyć nową stronę główną (dashboard) i zaktualizować nawigację

**Zadania**:

1. **Utworzyć Dashboard**:
   - Nowy plik: `src/pages/dashboard.astro`
   - Funkcjonalność:
     - Wyświetla status subskrypcji (trial/active/expired/canceled)
     - Dni pozostałe do końca trial
     - Placeholder dla głównej funkcjonalności aplikacji
     - CTA do upgrade (jeśli trial/expired)
   - Protected route (wymaga auth)

2. **Utworzyć Dashboard Component**:
   - Nowy plik: `src/components/dashboard/DashboardView.tsx`
   - Props: none (używa useAuth)
   - Sekcje:
     - Welcome message z imieniem użytkownika
     - Subscription status card
     - Placeholder area "Your Premium Feature Here"
     - Quick links (Account, Checkout)

3. **Zaktualizować Header**:
   - Plik: `src/components/layout/Header.tsx`
   - Zmiany:
     - Usunąć props: `showRangeSelector`, `showFilters`, `rangeSelector`, `filters`
     - Logo: zmienić na "Core" lub "App"
     - Link: `/grid` → `/dashboard`
     - Usunąć mobile menu (niepotrzebne bez filtrów)

4. **Zaktualizować middleware**:
   - Plik: `src/middleware/index.ts`
   - Zmienić protected routes: `/grid` → `/dashboard`
   - Dodać `/dashboard` do protected paths

5. **Zaktualizować redirects**:
   - AuthContext: po logowaniu redirect na `/dashboard` zamiast `/grid`
   - SubscriptionBanner: link upgrade prowadzi do `/checkout`

**Weryfikacja**:
- [ ] Dashboard wyświetla się poprawnie
- [ ] Header nie ma błędów TypeScript
- [ ] Middleware przekierowuje na login
- [ ] Po zalogowaniu redirect na dashboard

---

### **KROK 4: Aktualizacja Landing Page i Brand Identity**
**Cel**: Przerobić landing page na ogólny starter

**Zadania**:

1. **Zaktualizować Landing Page**:
   - Plik: `src/pages/index.astro`
   - Zmiany:
     - Tytuł: "Core Starter - Production-Ready SaaS Foundation"
     - Opis: Uniwersalny starter z auth, subscriptions, payments
     - Hero: "Build Your SaaS Faster" / "Launch in Days, Not Months"
     - Features:
       - 🔐 Authentication & Authorization (Supabase)
       - 💳 Payments & Subscriptions (Stripe)
       - 📊 User Dashboard & Account Management
       - 🎨 Modern UI with Tailwind + shadcn/ui
       - 🚀 Built with Astro + React + TypeScript
     - Logo: zmienić emoji z 🦢 na neutralne (⚡ lub 🚀)
     - CTA: "Start Free Trial" → "Get Started"

2. **Zaktualizować meta tags**:
   - Plik: `src/layouts/Layout.astro`
   - Title: "Core Starter"
   - Description: "Production-ready SaaS starter with authentication, subscriptions, and payments"

3. **Zaktualizować logo w aplikacji**:
   - Header: zmienić na "Core" + emoji
   - Footer: dodać copyright "Core Starter"

**Weryfikacja**:
- [ ] Landing page wygląda profesjonalnie
- [ ] Brak wzmianek o "Black Swan"
- [ ] Meta tags zaktualizowane
- [ ] Logo spójne w całej aplikacji

---

### **KROK 5: Aktualizacja package.json, README, ENV i dokumentacji**
**Cel**: Zaktualizować konfigurację projektu i dokumentację

**Zadania**:

1. **package.json**:
   - Zmienić `name`: `"core-starter"`
   - Zaktualizować `version`: `"1.0.0"`
   - Usunąć description o Black Swan

2. **README.md**:
   - Całkowita przebudowa
   - Sekcje:
     - Project Description (Core Starter - SaaS foundation)
     - Tech Stack (lista wszystkich technologii)
     - Features (Auth, Subscriptions, Payments, Dashboard)
     - Getting Started (instalacja, env setup, dev mode)
     - Project Structure (katalogi z opisem)
     - Available Scripts
     - Testing
     - Deployment
     - **AI Context Section** - kluczowa sekcja!
       - "This is a production-ready starter"
       - "Auth system is COMPLETE - do not modify"
       - "Subscription system is COMPLETE - do not modify"
       - "To add your feature: implement in /dashboard or create new routes"
       - "See STARTER_GUIDE.md for detailed architecture"

3. **.env.example**:
   - Usunąć wszystkie `NOCODB_*` variables
   - Dodać sekcję:
     ```
     # Custom API Integration (Placeholder)
     # Add your own API keys here
     # CUSTOM_API_URL=
     # CUSTOM_API_KEY=
     ```
   - Dodać komentarze do każdej sekcji

4. **STARTER_GUIDE.md** (nowy plik w root):
   - Szczegółowa dokumentacja dla AI
   - Sekcje:
     1. **Architecture Overview**
        - Tech stack with versions
        - Folder structure with descriptions
        - Data flow diagrams (text-based)
     2. **Core Systems (DO NOT MODIFY)**
        - Authentication system (files, flow, API endpoints)
        - Subscription system (files, flow, Stripe integration)
        - Webhook handling (Stripe events)
        - Database schema (Supabase tables)
     3. **Customization Guide (WHERE TO ADD YOUR CODE)**
        - Dashboard customization
        - Adding new protected routes
        - Adding new API endpoints
        - Adding premium features behind paywall
        - UI component library usage
     4. **Environment Variables**
        - Required vs optional
        - Where to get API keys
     5. **Testing Strategy**
        - What tests exist
        - How to add new tests
     6. **Deployment**
        - Build process
        - Environment setup
        - DigitalOcean deployment
     7. **Common Patterns**
        - Protected routes
        - API calls with auth
        - Toast notifications
        - Error handling
     8. **Troubleshooting**
        - Common issues
        - Debug checklist

5. **astro.config.mjs**:
   - Sprawdzić czy są referencje do Black Swan (unlikely)

6. **tsconfig.json**:
   - Sprawdzić paths (powinny być OK)

**Weryfikacja**:
- [ ] package.json zaktualizowany
- [ ] README.md kompletny i przejrzysty
- [ ] .env.example bez NocoDB
- [ ] STARTER_GUIDE.md utworzony i szczegółowy
- [ ] Wszystkie pliki config sprawdzone

---

### **KROK 6: Cleanup, testy i weryfikacja finalna**
**Cel**: Upewnić się, że wszystko działa i nie ma śladów Black Swan

**Zadania**:

1. **Cleanup dependencies**:
   - Sprawdzić `package.json` czy są niewykorzystane paczki
   - Usunąć jeśli są dedykowane dla NocoDB (unlikely)

2. **TypeScript compilation**:
   - Uruchomić: `npm run build`
   - Naprawić wszystkie błędy TypeScript
   - Oczekiwane: 0 errors

3. **Linting**:
   - Uruchomić: `npm run lint`
   - Naprawić critical issues
   - Formatowanie: `npm run format`

4. **Testy**:
   - Sprawdzić czy pozostałe testy działają:
     - `npm run test:e2e -- auth.spec.ts`
     - `npm run test:e2e -- checkout.spec.ts`
   - Naprawić broken tests (jeśli są)

5. **Search & Replace** (finalna weryfikacja):
   - Wyszukać w całym projekcie:
     - "Black Swan" (case insensitive)
     - "black-swan"
     - "blackswan"
     - "black_swan"
     - "🦢" (emoji łabędzia)
     - "GPW"
     - "NocoDB" (w komentarzach)
   - Zamienić lub usunąć wszystkie wystąpienia

6. **Manual testing**:
   - Uruchomić dev mode: `npm run dev`
   - Przetestować flow:
     1. Landing page → wygląd OK
     2. Register → trial utworzony
     3. Login → redirect na dashboard
     4. Dashboard → wyświetla status
     5. Account modal → subscription info
     6. Checkout → Stripe checkout
     7. Logout → redirect na landing

7. **Git cleanup**:
   - Review all changes: `git status`
   - Stage wszystkie zmiany: `git add .`
   - Commit: `git commit -m "Transform Black Swan Grid to Core Starter"`
   - Opcjonalnie: merge do main lub zostaw na branch

**Weryfikacja**:
- [ ] Build działa bez błędów
- [ ] Linting passed
- [ ] Testy auth + checkout passed
- [ ] Brak wzmianek "Black Swan" w kodzie
- [ ] Manual testing completed
- [ ] Wszystkie funkcje działają
- [ ] Git commit created

---

## 📝 SZCZEGÓŁOWE LISTY PLIKÓW

### Pliki do USUNIĘCIA (52 pliki)

**Components Grid (17):**
```
src/components/grid/BlurredDemoGrid.tsx
src/components/grid/TickerFilter.tsx
src/components/grid/SortOptions.tsx
src/components/grid/RangeSelector.tsx
src/components/grid/EventTypeFilter.tsx
src/components/grid/GridMinimap.tsx
src/components/grid/TickerSearchInput.tsx
src/components/grid/MobileAccessBlock.tsx
src/components/grid/VirtualizedGrid.tsx
src/components/grid/GridPageWrapper.tsx
src/components/grid/TickerList.tsx
src/components/grid/DateRangePicker.tsx
src/components/grid/GridView.tsx
src/components/grid/GridCell.tsx
src/components/grid/MinimapCanvas.tsx
src/components/grid/ClearFiltersButton.tsx
src/components/grid/AdvancedTickerFilter.tsx
```

**Components Event/Summary:**
```
src/components/event/* (cały katalog jeśli istnieje)
src/components/summary/* (cały katalog jeśli istnieje)
```

**Services (2):**
```
src/services/nocodb.service.ts
src/services/nocodb.service.test.ts
```

**Lib (2):**
```
src/lib/nocodb-client.ts
src/lib/nocodb-validation.ts
```

**Types (1):**
```
src/types/nocodb.types.ts
```

**Contexts (1):**
```
src/contexts/GridContext.tsx
```

**Hooks (1):**
```
src/hooks/useClientCache.ts
```

**Pages (3+):**
```
src/pages/grid.astro
src/pages/event/* (cały katalog)
src/pages/api/nocodb/* (cały katalog)
```

**Tests E2E (15):**
```
e2e/grid-rendering.spec.ts
e2e/grid-trial.spec.ts
e2e/grid-keyboard.spec.ts
e2e/grid-layout.spec.ts
e2e/grid-filtering-advanced.spec.ts
e2e/grid-errors.spec.ts
e2e/grid-pastdue.spec.ts
e2e/grid-sorting.spec.ts
e2e/grid-paywall.spec.ts
e2e/grid-filtering.spec.ts
e2e/grid.spec.ts.backup
e2e/helpers/mock-nocodb.helper.ts
e2e/fixtures/nocodb-mock.fixture.ts
```

**Docs (25):**
```
docs/BUGFIX_SUPABASE_ENV_VARS.md
docs/BUGFIX_TOAST_PROVIDER.md
docs/CHANGELOG_EMAIL_CONFIRMATION.md
docs/COMPLETE_IMPLEMENTATION_SUMMARY.md
docs/FINAL_VERIFICATION_REPORT.md
docs/FIXES_SUMMARY.md
docs/ITERATION_1_STEPS_4-6.md
docs/ITERATION_1_STEPS_7-9.md
docs/ITERATION_2_FINAL_REPORT.md
docs/ITERATION_2_PROGRESS_REPORT.md
docs/ITERATION_2_STEP_3_COMPLETE.md
docs/ITERATION_2_STEP_3_PLAN.md
docs/ITERATION_2_STEP_4_COMPLETE.md
docs/ITERATION_2_STEP_4_PLAN.md
docs/ITERATION_2_STEPS_1-2.md
docs/QUICK_FIX_SUMMARY.md
docs/QUICK_FIX_TESTS.md
docs/TESTS_AUDIT_FINAL_REPORT.md
docs/UI_IMPLEMENTATION_STATUS.md
docs/UNIT_TESTS_AUDIT_REPORT.md
docs/UNIT_TESTS_STATUS.md
docs/VERIFICATION_REPORT_FINAL.md
docs/VERIFICATION_REPORT_ITERATION_2.md
docs/VERIFICATION_SUMMARY.md
docs/VERIFICATION_UI_COMPONENTS.md
docs/api/* (cały katalog)
```

---

### Pliki do MODYFIKACJI (15)

```
package.json - nazwa, opis
README.md - całkowita przebudowa
.env.example - usunąć NocoDB vars
src/pages/index.astro - nowy landing page
src/components/layout/Header.tsx - usunąć filtry/range props
src/middleware/index.ts - zmienić /grid na /dashboard
src/lib/api-service.ts - usunąć NocoDB functions
src/contexts/AuthContext.tsx - redirect na /dashboard
astro.config.mjs - sprawdzić referencje
tsconfig.json - sprawdzić paths
```

---

### Pliki do UTWORZENIA (3)

```
src/pages/dashboard.astro - nowa strona główna
src/components/dashboard/DashboardView.tsx - komponent dashboard
STARTER_GUIDE.md - dokumentacja dla AI
```

---

## ⚠️ UWAGI I RYZYKA

### Potencjalne problemy:

1. **Broken imports**: Po usunięciu GridContext/nocodb mogą pozostać importy w innych plikach
   - **Rozwiązanie**: Użyć TypeScript errors jako checklist

2. **Tests breaking**: Auth/checkout testy mogą się psać jeśli używają mock-nocodb
   - **Rozwiązanie**: Sprawdzić fixtures, usunąć niepotrzebne mocki

3. **Middleware**: Może mieć hard-coded paths do /grid
   - **Rozwiązanie**: Global search "/grid" i zamienić na "/dashboard"

4. **Subscription Banner**: Może mieć linki do grid
   - **Rozwiązanie**: Sprawdzić wszystkie CTA i redirect links

### Zalecenia:

- **Commit after each step** - łatwiejszy rollback jeśli coś pójdzie nie tak
- **Test early, test often** - nie czekać do końca z testowaniem
- **Keep backup** - zachować branch przed transformacją
- **Document decisions** - jeśli coś zmienisz w planie, dodaj komentarz

---

## 🎯 KRYTERIA SUKCESU

Transformacja uznana za udaną gdy:

- ✅ Build TypeScript: 0 errors
- ✅ Linting: 0 critical errors
- ✅ Tests: auth.spec.ts + checkout.spec.ts PASS
- ✅ Manual test: pełny flow działa (register → login → dashboard → checkout → logout)
- ✅ Search "Black Swan": 0 wyników w src/
- ✅ Search "NocoDB": 0 wyników w src/ (poza komentarzami historycznymi)
- ✅ README.md: kompletny i przejrzysty
- ✅ STARTER_GUIDE.md: szczegółowy dla AI
- ✅ Landing page: profesjonalny i neutralny
- ✅ Dashboard: pokazuje subscription status

---

## 📊 SZACOWANY CZAS REALIZACJI

- **Krok 1**: 10 min (przygotowanie)
- **Krok 2**: 20 min (usuwanie plików)
- **Krok 3**: 45 min (dashboard + header + middleware)
- **Krok 4**: 30 min (landing page + branding)
- **Krok 5**: 60 min (dokumentacja STARTER_GUIDE.md)
- **Krok 6**: 45 min (testy + weryfikacja)

**TOTAL**: ~3.5 godziny (z buforem)

---

## 🚀 GOTOWY DO STARTU?

Plan jest kompletny i gotowy do realizacji iteracyjnej.

Zatwierdzenie po każdym kroku zapewni kontrolę nad procesem i możliwość korekty.

**Następny krok**: Rozpocząć od KROKU 1 po Twoim zatwierdzeniu.

