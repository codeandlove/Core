# Plan Implementacji Feature - Dark Mode Switcher

Data utworzenia: 2026-02-21
Tytul feature: Dark Mode Switcher z persystencją stanu
Typ: UI/UX + Business Logic
Priorytet: MEDIUM

## 1. Podsumowanie wykonawcze

### 1.1. Opis funkcjonalnosci

Implementacja przełącznika trybu ciemnego (Dark Mode) z pełną obsługą kolorystyczną, persystencją preferencji użytkownika oraz respektowaniem ustawień systemowych. Wszystkie style będą zarządzane centralnie przez zmienne CSS zdefiniowane w `src/styles/global.css`, z możliwością przełączania poprzez toggle w interfejsie użytkownika.

### 1.2. Value proposition

- Użytkownik końcowy: Wygodne korzystanie z aplikacji w różnych warunkach oświetleniowych, redukcja zmęczenia wzroku, personalizacja doświadczenia
- Biznes: Zwiększenie komfortu użytkowania, spełnienie standardów nowoczesnych aplikacji webowych, lepsza retencja użytkowników, compliance z accessibility guidelines (WCAG 2.1)

### 1.3. Zakres wpływu

- Nowe komponenty/moduły: ThemeProvider context, useTheme hook, ThemeToggle component
- Modyfikowane komponenty/moduły: Layout.astro (dodanie class="dark" do html), global.css (weryfikacja zmiennych)
- Grupa docelowa uzytkownikow: wszyscy użytkownicy aplikacji
- Dotknięte srodowiska: production, staging, development

### 1.4. Priorytet i MVP scope

MEDIUM - funkcjonalność pożądana dla nowoczesnej aplikacji SaaS, ale nie blokująca core functionality

MVP (must-have):

- Toggle przełączający między trybem jasnym i ciemnym
- Persystencja wyboru w localStorage
- Automatyczna detekcja preferencji systemowych (prefers-color-scheme)
- Synchronizacja class="dark" na elemencie html
- Wszystkie istniejące komponenty działają poprawnie w obu trybach (już obsługiwane przez zmienne CSS)

Nice-to-have (moze byc dodane pozniej):

- Animacje przejścia między trybami
- Trzeci tryb "auto" (follow system)
- Synchronizacja między kartami/oknami (BroadcastChannel API)
- Ustawienia w profilu użytkownika (persystencja server-side)

## 2. Szczegolowa analiza wymagan

### 2.1. Wymagania funkcjonalne

1. Toggle button umożliwiający przełączanie między trybem jasnym i ciemnym - MUST
2. Automatyczna detekcja preferencji systemowych przy pierwszym załadowaniu - MUST
3. Persystencja wyboru użytkownika w localStorage - MUST
4. Synchronizacja stanu dark mode między wszystkimi komponentami React - MUST
5. Brak flickera przy załadowaniu strony (inline script w head) - MUST
6. Wszystkie komponenty UI zachowują czytelność w obu trybach - MUST
7. Ikony Sun/Moon w toggle button - SHOULD
8. Dostępność z klawiatury i screen reader - MUST
9. Smooth transition między trybami - COULD

### 2.2. Wymagania niefunkcjonalne

- Performance: Przełączenie trybu < 16ms (1 frame), brak layout shift przy ładowaniu
- Security: Bezpieczne storage w localStorage, brak podatności XSS
- Accessibility: WCAG 2.1 AA compliance, keyboard navigation, ARIA labels, screen reader support
- SEO: Brak wpływu na SEO, prawidłowe renderowanie SSR
- Compatibility: Wszystkie nowoczesne przeglądarki (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+), mobile/desktop, wszystkie rozmiary ekranów

### 2.3. User stories i use cases

#### User Story 1: Ręczne przełączanie Dark Mode

Jako użytkownik aplikacji
Chce móc przełączać między trybem jasnym i ciemnym
Aby dostosować interfejs do warunków oświetleniowych i moich preferencji

Acceptance Criteria:

- [ ] Toggle button jest widoczny i dostępny na każdej stronie aplikacji
- [ ] Kliknięcie toggle natychmiastowo zmienia tryb kolorystyczny
- [ ] Zmiana jest zachowana po odświeżeniu strony
- [ ] Toggle pokazuje aktualny stan (ikona Sun dla light mode, Moon dla dark mode)
- [ ] Wszystkie komponenty poprawnie reagują na zmianę trybu

#### User Story 2: Automatyczna detekcja preferencji systemowych

Jako użytkownik
Chce aby aplikacja domyślnie używała trybu zgodnego z moimi ustawieniami systemowymi
Aby zachować spójność z resztą systemu operacyjnego

Acceptance Criteria:

- [ ] Przy pierwszym odwiedzeniu aplikacja wykrywa preferencje systemowe (prefers-color-scheme)
- [ ] Aplikacja automatycznie ustawia się w trybie ciemnym jeśli system jest w dark mode
- [ ] Po ręcznej zmianie trybu, preferencja użytkownika nadpisuje ustawienia systemowe
- [ ] Brak flickera/migotania przy pierwszym załadowaniu strony

#### User Story 3: Persystencja preferencji

Jako użytkownik
Chce aby moje preferencje dotyczące trybu były zapamiętane
Aby nie musiał ponownie ustawiać ich przy każdej wizycie

Acceptance Criteria:

- [ ] Po odświeżeniu strony tryb pozostaje taki sam jak ustawiony
- [ ] Po zamknięciu i ponownym otwarciu przeglądarki tryb jest zachowany
- [ ] Preferencje są zachowane między różnymi stronami aplikacji (landing, dashboard, checkout)
- [ ] Czyszczenie localStorage resetuje preferencje do detekcji systemowej

#### User Story 4: Dostępność (Accessibility)

Jako użytkownik korzystający z klawiatury lub screen readera
Chce mieć dostęp do przełącznika trybu
Aby móc dostosować interfejs bez użycia myszy

Acceptance Criteria:

- [ ] Toggle button jest dostępny przez nawigację klawiaturą (Tab)
- [ ] Przełączenie możliwe przez Enter lub Space
- [ ] Screen reader ogłasza aktualny stan i akcję (np. "Dark mode on/off")
- [ ] Toggle ma odpowiednie ARIA attributes (role, aria-label, aria-pressed)
- [ ] Focus indicator jest widoczny w obu trybach

### 2.4. Edge cases i scenariusze alternatywne

- Edge case 1: localStorage jest zablowany (private browsing, permissions) - fallback do session state lub memory-only state
- Edge case 2: Użytkownik zmienia preferencje systemowe podczas korzystania z aplikacji - aplikacja respektuje ręcznie ustawiony tryb
- Edge case 3: JavaScript jest wyłączony - aplikacja powinna działać w domyślnym trybie jasnym (graceful degradation)
- Edge case 4: Pierwszy render (SSR) - inline script zapobiega flickerowi
- Error scenario 1: Błąd zapisu do localStorage - aplikacja kontynuuje działanie, ale bez persystencji
- Error scenario 2: Nieprawidłowa wartość w localStorage - reset do wartości domyślnej

### 2.5. Integracje i zaleznosci

#### Wewnetrzne zaleznosci:

- Layout.astro - modyfikacja do dodania inline script i class propagation
- global.css - weryfikacja kompletności zmiennych CSS dla dark mode (już zaimplementowane)
- Wszystkie komponenty React - muszą używać zmiennych CSS zamiast hardcoded colors (już spełnione przez shadcn/ui)
- AuthContext/ToastContext - wzór do utworzenia ThemeContext

#### External APIs / Third-party services:

- localStorage API - persystencja preferencji
- matchMedia API - detekcja preferencji systemowych (prefers-color-scheme)

#### Zaleznosci od innych features:

- Brak blokujących zależności
- Feature jest niezależny i nie blokuje innych funkcjonalności

## 3. Architektura i design

### 3.1. Diagram architektury

```
[User] -> [ThemeToggle Component] -> [useTheme Hook] -> [ThemeProvider Context]
                                                            |
                                                            v
          [Layout.astro] <------ [Inline Script] -----> [localStorage]
          (html class="dark")                             |
                 |                                        v
                 v                                   [matchMedia API]
          [CSS Variables :root / .dark]           (prefers-color-scheme)
                 |
                 v
          [All UI Components] (automatic via CSS vars)
```

### 3.2. Flow danych

1. Użytkownik wchodzi na stronę
2. Inline script w <head> odczytuje localStorage lub matchMedia
3. Script natychmiastowo ustawia class="dark" na <html> (przed render, zapobiega flickerowi)
4. Astro SSR renderuje HTML z odpowiednią klasą
5. React hydratuje - ThemeProvider synchronizuje się z aktualnym stanem
6. Użytkownik klika ThemeToggle
7. useTheme().toggleTheme() wywołuje zmianę stanu
8. ThemeProvider aktualizuje localStorage
9. ThemeProvider dodaje/usuwa class="dark" na document.documentElement
10. CSS automatycznie aplikuje zmienne z :root lub .dark
11. Wszystkie komponenty re-renderują się z nowymi kolorami (via CSS vars)

### 3.3. Model danych

#### Nowe typy/interfejsy:

```typescript
// src/types/theme.types.ts
export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

#### Nowe tabele w bazie danych (jesli wymagane):

Nie wymagane dla MVP. Nice-to-have: kolumna `preferred_theme` w tabeli `app_users` dla server-side persistence.

#### Modyfikacje istniejacych tabel (jesli wymagane):

Nie wymagane dla MVP.

### 3.4. Komponenty i moduły

#### Nowe komponenty:

- `ThemeProvider.tsx` - Context provider zarządzający stanem theme
- `ThemeToggle.tsx` - Toggle button komponent (Sun/Moon icon)
- `theme-script.ts` - Inline script zapobiegający flickerowi

#### Modyfikowane komponenty:

- `Layout.astro` - dodanie inline script w <head>, propagacja class na <html>
- `AppLayout.tsx` - opcjonalnie: umieszczenie ThemeToggle w header/nav

#### Nowe serwisy/hooki:

- `useTheme.ts` - custom hook do konsumpcji ThemeContext (może być w ThemeProvider.tsx)

#### Nowe utilities:

- `themeHelpers.ts` - funkcje getSystemTheme(), applyTheme(), getStoredTheme()

#### Nowe API endpoints (jesli backend):

Nie wymagane dla MVP.

## 4. Propozycje podejsc architektonicznych

### 4.1. Podejscie A: React Context + Inline Script (REKOMENDOWANE)

#### Opis:

Wykorzystanie React Context API dla zarządzania stanem w komponentach React + inline script w <head> dla zapobieżenia flickerowi przy pierwszym ładowaniu. Theme przechowywany w localStorage. Class "dark" aplikowana bezpośrednio na <html> element. CSS variables już zdefiniowane w global.css.

#### Architektura:

- ThemeProvider (Context) - zarządzanie stanem, sync z localStorage
- Inline script - natychmiastowe ustawienie class="dark" przed hydration
- ThemeToggle - UI component z Sun/Moon icons
- CSS Variables - :root i .dark już zdefiniowane w global.css

#### Zakres zmian:

Nowe pliki:

- `src/contexts/ThemeContext.tsx` (ThemeProvider + useTheme hook)
- `src/components/layout/ThemeToggle.tsx` (toggle button component)
- `src/types/theme.types.ts` (type definitions)

Modyfikowane pliki:

- `src/layouts/Layout.astro` (dodanie inline script w <head>)
- `src/components/layout/AppLayout.tsx` (opcjonalnie: umieszczenie ThemeToggle)

Nowe dependencies:

- lucide-react (już zainstalowane - ikony Sun/Moon)

Database migrations: brak

Testy:

- Unit: ThemeProvider, useTheme hook
- Integration: ThemeToggle + ThemeProvider
- E2E: Przełączanie trybu, persystencja, brak flickera

#### Zalety:

- Najprostsze rozwiązanie, wykorzystuje istniejące patterns (podobnie jak AuthContext)
- Brak flickera dzięki inline script
- Pełna kontrola nad stanem i persistence
- CSS variables już gotowe - zero pracy z stylami
- Zgodne z best practices React i Astro
- Łatwe w maintenance i testowaniu
- Niska złożoność implementacji

#### Wady:

- Inline script w HTML (minor: ~10 linii kodu, niezbędne dla UX)
- Brak automatycznej synchronizacji między kartami/oknami (można dodać w przyszłości)

#### Effort: S (6-8 godzin)

- 1-2h: Implementacja ThemeProvider + useTheme
- 1h: Implementacja ThemeToggle component
- 1h: Inline script + modyfikacja Layout.astro
- 1-2h: Integracja z AppLayout
- 2h: Testy (unit + E2E)
- 1h: Code review + fixes

#### Zlożonosc: LOW

- Proste API Context, znany pattern z projektu
- Wykorzystanie istniejących CSS variables
- Standardowe localStorage operations
- Brak integracji z backend

#### Impact na system: LOW

- Izolowany feature, nie wpływa na istniejącą logikę
- Tylko modyfikacja Layout.astro (dodanie script)
- Wszystkie komponenty UI już obsługują dark mode przez CSS vars

#### Zgodnosc ze standardami:

- Copilot-instructions.md: ✅ - React hooks, functional components, accessibility (ARIA, keyboard)
- Tech-stack.md: ✅ - React 19, TypeScript, Astro, Tailwind CSS, lucide-react
- Best practices: ✅ - Context API, localStorage, inline critical script, CSS variables

### 4.2. Podejscie B: Third-party Library (next-themes)

#### Opis:

Wykorzystanie biblioteki next-themes (kompatybilnej z Astro + React). Automatyczna obsługa persystencji, detekcji systemowej, zapobiegania flickerowi. Wymaga dodania dependency.

#### Architektura:

- next-themes ThemeProvider wrapper
- Inline script generowany przez bibliotekę
- ThemeToggle używający useTheme() z next-themes
- CSS Variables pozostają bez zmian

#### Zakres zmian:

Nowe pliki:

- `src/components/layout/ThemeToggle.tsx`
- `src/components/providers/Providers.tsx` (wrapper dla ThemeProvider)

Modyfikowane pliki:

- `src/layouts/Layout.astro` (dodanie script z next-themes)
- `src/components/layout/AppLayout.tsx`

Nowe dependencies:

- next-themes (11.8kb gzipped)

Database migrations: brak

Testy:

- Integration: ThemeToggle + next-themes
- E2E: Przełączanie trybu, persystencja

#### Zalety:

- Gotowe rozwiązanie, battle-tested
- Obsługa wielu trybów (light, dark, system)
- Automatyczna synchronizacja między kartami
- Mniej kodu do napisania i utrzymania
- Built-in TypeScript support

#### Wady:

- Dodatkowa dependency (11.8kb)
- Mniejsza kontrola nad implementacją
- Potential overkill dla prostego light/dark switch
- Wymaga zrozumienia API biblioteki
- Może mieć features których nie potrzebujemy

#### Effort: XS (3-4 godziny)

- 1h: Instalacja i konfiguracja next-themes
- 1h: Implementacja ThemeToggle
- 0.5h: Integracja z Layout
- 1h: Testy E2E
- 0.5h: Code review

#### Zlożonosc: LOW

- Dokumentacja biblioteki jest jasna
- Mniej custom code
- Standardowa integracja

#### Impact na system: LOW

- Podobny impact jak Podejście A
- Dodanie external dependency

#### Zgodnosc ze standardami:

- Copilot-instructions.md: ⚠️ - dodanie external library (wymaga akceptacji)
- Tech-stack.md: ⚠️ - nowa dependency
- Best practices: ✅ - proven solution, TypeScript, accessibility

### 4.3. Podejscie C: CSS-only z prefers-color-scheme

#### Opis:

Wykorzystanie tylko CSS @media (prefers-color-scheme) bez JavaScript toggle. Użytkownik nie może ręcznie przełączać trybu - aplikacja następuje za ustawieniami systemu.

#### Architektura:

- Brak JavaScript dla theme switching
- CSS @media (prefers-color-scheme: dark)
- Brak persystencji (zawsze follow system)
- Brak toggle button

#### Zakres zmian:

Modyfikowane pliki:

- `src/styles/global.css` (przepisanie z .dark na @media)

Nowe dependencies: brak

#### Zalety:

- Zero JavaScript
- Najszybsze (brak runtime logic)
- Najmniejszy bundle size
- Automatycznie responsywne do zmian systemowych

#### Wady:

- Brak możliwości ręcznego przełączania przez użytkownika
- Nie spełnia głównego wymagania (toggle switch)
- Brak persystencji preferencji użytkownika niezależnie od systemu
- Gorsze UX - użytkownik nie ma kontroli

#### Effort: XS (1 godzina)

- 1h: Refaktoryzacja CSS variables

#### Zlożonosc: LOW

- Tylko CSS, brak logiki

#### Impact na system: LOW

- Tylko zmiana w CSS

#### Zgodnosc ze standardami:

- Copilot-instructions.md: ⚠️ - brak accessibility control (toggle)
- Tech-stack.md: ✅ - tylko CSS
- Best practices: ❌ - nie spełnia wymagań użytkownika (brak toggle)

## 5. Rekomendacja i uzasadnienie

### 5.1. Wybrane podejscie

PODEJSCIE A: React Context + Inline Script

### 5.2. Uzasadnienie wyboru

Najlepiej realizuje wymagania biznesowe poprzez:

- Pełna kontrola użytkownika nad trybem kolorystycznym (toggle switch)
- Persystencja preferencji między sesjami
- Automatyczna detekcja preferencji systemowych przy pierwszej wizycie
- Brak flickera przy ładowaniu strony

Skaluje sie w przyszlosci:

- Łatwo dodać trzeci tryb "auto" (follow system)
- Można rozszerzyć o server-side persistence (kolumna w DB)
- Możliwość dodania synchronizacji między kartami (BroadcastChannel API)
- Bazuje na patterns już używanych w projekcie (AuthContext)

Jest zgodne ze standardami projektu i architektura:

- Wykorzystuje React Context API tak samo jak AuthContext i ToastContext
- Functional components z hooks (zgodnie z REACT_CODING_STANDARDS)
- TypeScript strict typing
- Accessibility (ARIA attributes, keyboard navigation)
- Inline critical script (best practice dla preventing flicker)

Minimalizuje zlożonosc i technical debt:

- Brak external dependencies (wykorzystuje już zainstalowane lucide-react)
- Proste API (theme, setTheme, toggleTheme)
- Wykorzystuje istniejące CSS variables - zero refaktoryzacji styli
- Łatwe w testowaniu (unit + integration + E2E)

Optymalizuje user experience:

- Natychmiastowe przełączanie trybu (< 16ms)
- Brak flickera przy ładowaniu
- Visual feedback (Sun/Moon icons)
- Keyboard accessible
- Screen reader friendly

Optymalizuje performance:

- Zero dodatkowego bundle size (poza ~2kb własnego kodu)
- Brak zewnętrznych bibliotek
- CSS variables = automatic re-styling bez JS
- Inline script = instant theme application (przed parse JS bundle)

Podejście B (next-themes) byłoby również dobre, ale dodaje dependency której nie potrzebujemy dla prostego light/dark switch. Podejście C nie spełnia wymagania ręcznego przełączania.

## 6. Szczegolowy plan implementacji

### 6.1. Faza 1: Przygotowanie

- [ ] Utworzenie brancha: `feature/dark-mode-switcher`
- [ ] Weryfikacja zmiennych CSS w global.css (już kompletne)
- [ ] Sprawdzenie czy wszystkie komponenty używają CSS variables (już spełnione)
- [ ] Przygotowanie ikon Sun/Moon z lucide-react (już dostępne)

### 6.2. Faza 2: Implementacja core functionality

#### Krok 1: Utworzenie types dla Theme

Cel: Zdefiniowanie typów TypeScript dla theme system

Pliki do stworzenia:

- `src/types/theme.types.ts`

Opis implementacji:
Utworzenie type definitions dla Theme i ThemeContextValue. Proste typy bez złożonej logiki.

Kod do utworzenia:

```typescript
export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

Uzasadnienie:
Potrzebne dla type safety w całym systemie theme. Proste union type dla theme i interface dla context value.

Acceptance criteria dla tego kroku:

- [ ] Type Theme zdefiniowany jako "light" | "dark"
- [ ] Interface ThemeContextValue zawiera theme, setTheme, toggleTheme
- [ ] Brak errrorów TypeScript

#### Krok 2: Implementacja ThemeProvider Context

Cel: Utworzenie Context provider zarządzającego stanem theme

Pliki do stworzenia:

- `src/contexts/ThemeContext.tsx`

Opis implementacji:
React Context z useState dla theme state, useEffect dla synchronizacji z localStorage i document.documentElement.classList, funkcje setTheme i toggleTheme. Podobna struktura jak AuthContext.

Kod do dodania/utworzenia:

<!-- prettier-ignore -->
```typescript
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Theme, ThemeContextValue } from "@/types/theme.types";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme-preference";

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return null;
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Initialize from stored preference or system preference
    return getStoredTheme() || getSystemTheme();
  });

  useEffect(() => {
    // Apply theme on mount and when changed
    applyTheme(theme);
    // Persist to localStorage
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

Uzasadnienie:
Context API to standard w projekcie (AuthContext, ToastContext). Umożliwia globalny dostęp do theme state z dowolnego komponentu React. useEffect synchronizuje z DOM i localStorage.

Acceptance criteria dla tego kroku:

- [ ] ThemeProvider przyjmuje children i renderuje Context.Provider
- [ ] useState inicjalizuje theme z localStorage lub system preference
- [ ] useEffect aplikuje class="dark" na document.documentElement
- [ ] useEffect zapisuje theme do localStorage
- [ ] setTheme i toggleTheme działają poprawnie
- [ ] useTheme hook rzuca error jeśli użyty poza ThemeProvider
- [ ] TypeScript types są poprawne

#### Krok 3: Implementacja inline script w Layout.astro

Cel: Zapobieżenie flickerowi przy pierwszym ładowaniu przez natychmiastowe ustawienie class="dark"

Pliki do modyfikacji:

- `src/layouts/Layout.astro`

Opis implementacji:
Dodanie inline script w <head> przed innymi scriptami. Script czyta localStorage i matchMedia, następnie natychmiastowo aplikuje class="dark" na <html> jeśli potrzeba. Inline = wykonuje się synchronicznie przed renderowaniem body.

Kod do dodania:

```astro
---
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
}

const {
  title = "Core Starter - Production-Ready SaaS Foundation",
  description = "Build your SaaS faster with authentication, subscriptions, and payments already built. Focus on your unique features.",
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>

    <!-- Inline script to prevent FOUC (Flash of Unstyled Content) -->
    <script is:inline>
      (function () {
        const storageKey = "theme-preference";
        const getStoredTheme = () => localStorage.getItem(storageKey);
        const getSystemTheme = () =>
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";

        const theme = getStoredTheme() || getSystemTheme();

        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      })();
    </script>
  </head>
  <body>
    <slot />
  </body>
</html>

<style>
  html,
  body {
    margin: 0;
    width: 100%;
    height: 100%;
  }
</style>
```

Uzasadnienie:
Inline script w <head> wykonuje się synchronicznie przed parseowaniem body. Zapobiega flickerowi (FOUC) gdy użytkownik ma dark mode, ale strona renderuje się najpierw w light mode. Krytyczne dla UX.

Acceptance criteria dla tego kroku:

- [ ] Script jest inline (is:inline directive)
- [ ] Script znajduje się w <head> przed innymi scriptami
- [ ] Script czyta localStorage z kluczem 'theme-preference'
- [ ] Script fallbackuje do matchMedia jeśli brak w localStorage
- [ ] Script aplikuje class="dark" jeśli theme === 'dark'
- [ ] Brak flickera przy odświeżeniu strony w dark mode
- [ ] Script działa w SSR (Astro server-side rendering)

#### Krok 4: Implementacja ThemeToggle component

Cel: UI component umożliwiający przełączanie theme

Pliki do stworzenia:

- `src/components/layout/ThemeToggle.tsx`

Opis implementacji:
Komponent button z ikonami Sun/Moon z lucide-react. Używa useTheme() hook do toggleTheme(). Accessibility: ARIA labels, keyboard support, focus indicator. Design: minimalistyczny button z transition.

Kod do utworzenia:

```typescript
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={theme === "dark"}
    >
      {theme === "light" ? (
        <Moon className="size-5" aria-hidden="true" />
      ) : (
        <Sun className="size-5" aria-hidden="true" />
      )}
      <span className="sr-only">
        {theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      </span>
    </button>
  );
}
```

Uzasadnienie:
Dedykowany komponent dla theme toggle. Używa shadcn/ui styling patterns (hover:bg-accent). Accessibility: aria-label, aria-pressed, sr-only text, aria-hidden na ikonie. Lucide-react już zainstalowane.

Acceptance criteria dla tego kroku:

- [ ] Button renderuje Sun icon w dark mode, Moon icon w light mode
- [ ] onClick wywołuje toggleTheme()
- [ ] Button ma odpowiednie ARIA attributes
- [ ] Button jest dostępny z klawiatury (Tab, Enter, Space)
- [ ] Hover state działa w obu trybach
- [ ] Focus indicator jest widoczny
- [ ] Icon ma size-5 (20px)
- [ ] Transition jest smooth

#### Krok 5: Integracja ThemeProvider z AppLayout

Cel: Udostępnienie ThemeContext w całej aplikacji

Pliki do modyfikacji:

- `src/components/layout/AppLayout.tsx`

Opis implementacji:
Wrap istniejącego AuthProvider i ToastProvider w ThemeProvider. ThemeProvider powinien być wysoko w drzewie, ale nie musi być najwyższy (może być pod AuthProvider).

Kod do dodania:

```typescript
// ...existing code...
import { ThemeProvider } from "@/contexts/ThemeContext";

// ...existing code...

export function AppLayout({
  children,
  header,
  showSubscriptionBanner = true,
  scrollable = true,
}: AppLayoutProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ToastProvider>
          <ToastContainer />
          <AppLayoutContent
            header={header}
            showSubscriptionBanner={showSubscriptionBanner}
            scrollable={scrollable}
          >
            {children}
          </AppLayoutContent>
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
```

Uzasadnienie:
ThemeProvider musi owijać wszystkie komponenty które mogą używać useTheme(). Umieszczenie pod AuthProvider, nad ToastProvider jest logiczne - theme jest niezależny od auth, ale wpływa na toast styling.

Acceptance criteria dla tego kroku:

- [ ] ThemeProvider owija ToastProvider
- [ ] AuthProvider pozostaje jako najwyższy
- [ ] Wszystkie komponenty w AppLayout mają dostęp do useTheme()
- [ ] Brak błędów w konsoli
- [ ] Nie ma performance regression

#### Krok 6: Umieszczenie ThemeToggle w UI

Cel: Dodanie toggle button w miejscu dostępnym dla użytkownika

Pliki do modyfikacji:

- `src/components/layout/AppLayout.tsx` lub `src/components/layout/AvatarMenu.tsx` (jeśli istnieje header/nav)

Opis implementacji:
Umieszczenie ThemeToggle w header aplikacji. Jeśli jest AvatarMenu lub NavigationMenu, można dodać obok. Jeśli nie ma header, można dodać fixed button w rogu ekranu (bottom-right lub top-right).

CHECKPOINT: Gdzie umieścić ThemeToggle?
Opcja A: W header obok AvatarMenu (jeśli istnieje)
Opcja B: W dropdown menu AvatarMenu jako opcja
Opcja C: Fixed button w rogu ekranu (bottom-right)
Opcja D: W footer

Rekomendacja: Opcja A lub C, zależnie od układu UI. Proszę o wskazanie preferowanego miejsca.

Kod do dodania (przykład dla Opcja A - header):

```typescript
// W AppLayoutContent przed <main>
// ...existing code...
{header || (
  <header className="flex items-center justify-between border-b px-4 py-3">
    <div className="flex items-center gap-4">
      {/* Logo / Brand */}
    </div>
    <div className="flex items-center gap-2">
      <ThemeToggle />
      {/* AvatarMenu lub inne nav items */}
    </div>
  </header>
)}
// ...existing code...
```

Uzasadnienie:
Toggle powinien być łatwo dostępny, ale nie inwazyjny. Header to standardowe miejsce dla takich kontrolek. Fixed button jest alternatywą jeśli nie ma header.

Acceptance criteria dla tego kroku:

- [ ] ThemeToggle jest widoczny na każdej stronie aplikacji
- [ ] Toggle nie blokuje innych elementów UI
- [ ] Toggle jest responsywny (mobile + desktop)
- [ ] Toggle pasuje stylistycznie do reszty UI
- [ ] Toggle jest dostępny z klawiatury

### 6.3. Faza 3: Typy i interfejsy

Plik: `src/types/theme.types.ts`

```typescript
export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}
```

Uzasadnienie:
Proste typy dla theme system. Theme jest union type dwóch możliwych wartości. ThemeContextValue opisuje API context.

### 6.4. Faza 4: Migracje bazy danych (jesli wymagane)

Nie wymagane dla MVP. Nice-to-have dla przyszłej rozbudowy:

Plik migracji: `supabase/migrations/20260221_add_theme_preference.sql`

```sql
-- Migration UP
-- Add theme preference column to app_users
ALTER TABLE app_users
ADD COLUMN preferred_theme TEXT CHECK (preferred_theme IN ('light', 'dark', 'system')) DEFAULT 'system';

-- Add index for performance
CREATE INDEX idx_app_users_preferred_theme ON app_users(preferred_theme);

-- Add comment
COMMENT ON COLUMN app_users.preferred_theme IS 'User preferred theme: light, dark, or system (follow OS)';
```

Rollback plan:

```sql
-- Migration DOWN
-- Remove theme preference column
DROP INDEX IF EXISTS idx_app_users_preferred_theme;
ALTER TABLE app_users DROP COLUMN IF EXISTS preferred_theme;
```

Uwaga: To jest nice-to-have feature dla przyszłej synchronizacji theme między urządzeniami. Nie jest wymagane dla MVP.

### 6.5. Faza 5: Integracje

Nie wymagane - feature jest standalone.

### 6.6. Faza 6: Stylizacja i UI polish (jesli UI feature)

- [ ] Responsive design - ThemeToggle działa na mobile, tablet, desktop
- [ ] Dark mode support - toggle jest widoczny i czytelny w obu trybach
- [ ] Loading states - brak (toggle jest instant)
- [ ] Error states - brak (fallback do light mode jeśli błąd)
- [ ] Animations i transitions - smooth icon transition (fade in/out)
- [ ] Icons - Sun/Moon z lucide-react

Pliki stylow:

- Tailwind classes w ThemeToggle.tsx
- CSS variables już zdefiniowane w global.css

Opcjonalne enhancement - smooth transition:

```css
/* W global.css */
@layer base {
  * {
    @apply border-border outline-ring/50;
    transition:
      background-color 200ms ease-in-out,
      color 200ms ease-in-out,
      border-color 200ms ease-in-out;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

Uwaga: Transitions mogą powodować problemy z performance przy dużej liczbie elementów. Testować przed włączeniem.

### 6.7. Faza 7: Testy

#### Unit tests:

Plik: `src/contexts/ThemeContext.test.tsx`

```typescript
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("should initialize with system preference", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });
    // Default should be light or dark based on system
    expect(["light", "dark"]).toContain(result.current.theme);
  });

  it("should toggle theme", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(
      initialTheme === "light" ? "dark" : "light",
    );
  });

  it("should persist theme to localStorage", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(localStorage.getItem("theme-preference")).toBe("dark");
  });

  it("should apply dark class to document", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("should initialize from stored preference", () => {
    localStorage.setItem("theme-preference", "dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("dark");
  });

  it("should throw error when useTheme used outside provider", () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");
  });
});
```

Plik: `src/components/layout/ThemeToggle.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";

describe("ThemeToggle", () => {
  it("should render toggle button", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should show Moon icon in light mode", () => {
    localStorage.setItem("theme-preference", "light");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByLabelText("Switch to dark mode");
    expect(button).toBeInTheDocument();
  });

  it("should show Sun icon in dark mode", () => {
    localStorage.setItem("theme-preference", "dark");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByLabelText("Switch to light mode");
    expect(button).toBeInTheDocument();
  });

  it("should toggle theme on click", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    const initialLabel = button.getAttribute("aria-label");

    fireEvent.click(button);

    const newLabel = button.getAttribute("aria-label");
    expect(newLabel).not.toBe(initialLabel);
  });

  it("should be keyboard accessible", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");
    button.focus();

    expect(button).toHaveFocus();

    fireEvent.keyDown(button, { key: "Enter" });
    // Theme should toggle
  });
});
```

Scope testow jednostkowych:

- [ ] ThemeProvider inicjalizuje z system preference
- [ ] ThemeProvider inicjalizuje z stored preference
- [ ] toggleTheme zmienia theme light <-> dark
- [ ] setTheme ustawia theme
- [ ] Theme jest zapisywany do localStorage
- [ ] Class "dark" jest aplikowana do document.documentElement
- [ ] useTheme rzuca error poza providerem
- [ ] ThemeToggle renderuje poprawną ikonę
- [ ] ThemeToggle ma poprawne ARIA attributes
- [ ] Click na ThemeToggle toggles theme
- [ ] Keyboard navigation działa

#### Integration tests:

Plik: `src/components/layout/ThemeToggle.integration.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

describe("ThemeToggle Integration", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("should integrate with ThemeProvider and update DOM", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");

    // Click to toggle to dark
    fireEvent.click(button);

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
      expect(localStorage.getItem("theme-preference")).toBe("dark");
    });

    // Click to toggle back to light
    fireEvent.click(button);

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(false);
      expect(localStorage.getItem("theme-preference")).toBe("light");
    });
  });

  it("should handle localStorage errors gracefully", async () => {
    // Mock localStorage.setItem to throw
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = jest.fn(() => {
      throw new Error("localStorage is disabled");
    });

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole("button");

    // Should not crash
    expect(() => {
      fireEvent.click(button);
    }).not.toThrow();

    // Restore
    Storage.prototype.setItem = originalSetItem;
  });
});
```

Scope testow integracyjnych:

- [ ] ThemeToggle + ThemeProvider synchronizują DOM i localStorage
- [ ] Multiple toggles działają poprawnie
- [ ] Graceful degradation gdy localStorage jest niedostępny
- [ ] Theme persistence między re-renders

#### E2E tests:

Plik: `e2e/theme.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());
  });

  test("should toggle dark mode", async ({ page }) => {
    await page.goto("/dashboard");

    // Find theme toggle button
    const toggleButton = page.getByRole("button", {
      name: /switch to dark mode/i,
    });
    await expect(toggleButton).toBeVisible();

    // Click to switch to dark mode
    await toggleButton.click();

    // Verify dark class is applied
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);

    // Verify button label changed
    await expect(
      page.getByRole("button", { name: /switch to light mode/i }),
    ).toBeVisible();

    // Click to switch back to light mode
    await toggleButton.click();

    // Verify dark class is removed
    await expect(html).not.toHaveClass(/dark/);
  });

  test("should persist theme after page reload", async ({ page }) => {
    await page.goto("/dashboard");

    // Switch to dark mode
    await page.getByRole("button", { name: /switch to dark mode/i }).click();

    // Verify dark mode is active
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Reload page
    await page.reload();

    // Verify dark mode is still active (no flicker)
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(
      page.getByRole("button", { name: /switch to light mode/i }),
    ).toBeVisible();
  });

  test("should not flicker on first load with dark mode preference", async ({
    page,
  }) => {
    // Set dark mode in localStorage before navigation
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("theme-preference", "dark");
    });

    // Navigate to page and check immediately
    await page.goto("/dashboard");

    // Dark class should be present immediately (no flicker)
    const html = page.locator("html");
    await expect(html).toHaveClass(/dark/);
  });

  test("should be keyboard accessible", async ({ page }) => {
    await page.goto("/dashboard");

    // Tab to theme toggle
    await page.keyboard.press("Tab");
    // Continue tabbing until we reach the toggle (or use a more specific selector)

    const toggleButton = page.getByRole("button", {
      name: /switch to dark mode/i,
    });
    await toggleButton.focus();

    // Verify button is focused
    await expect(toggleButton).toBeFocused();

    // Press Enter to toggle
    await page.keyboard.press("Enter");

    // Verify dark mode is active
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should work across different pages", async ({ page }) => {
    // Start on landing page
    await page.goto("/");

    // If there's a toggle on landing, switch to dark
    const landingToggle = page.getByRole("button", {
      name: /switch to dark mode/i,
    });
    if (await landingToggle.isVisible()) {
      await landingToggle.click();
    } else {
      // Set manually
      await page.evaluate(() => {
        localStorage.setItem("theme-preference", "dark");
        document.documentElement.classList.add("dark");
      });
    }

    // Navigate to dashboard
    await page.goto("/dashboard");

    // Verify dark mode is maintained
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Navigate to checkout
    await page.goto("/checkout");

    // Verify dark mode is still maintained
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("should handle system preference on first visit", async ({
    page,
    context,
  }) => {
    // Emulate dark mode preference in OS
    await context.emulateMedia({ colorScheme: "dark" });

    // Clear any stored preference
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    // Navigate fresh
    await page.goto("/dashboard");

    // Should detect system preference and apply dark mode
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
```

Scope testow E2E:

- [ ] User journey 1: Przełączanie dark mode przez toggle
- [ ] User journey 2: Persystencja theme po reload
- [ ] User journey 3: Brak flickera przy pierwszym załadowaniu
- [ ] User journey 4: Keyboard navigation i accessibility
- [ ] User journey 5: Theme consistency między różnymi stronami
- [ ] User journey 6: Detekcja system preference

## 7. Plan weryfikacji i testowania

### 7.1. Unit tests checklist

- [ ] Wszystkie funkcje/metody maja testy (getSystemTheme, getStoredTheme, applyTheme, toggleTheme, setTheme)
- [ ] Edge cases sa pokryte (brak localStorage, invalid values, undefined window/document)
- [ ] Error handling jest przetestowany (localStorage.setItem throws)
- [ ] Code coverage > 80% dla nowego kodu

### 7.2. Integration tests checklist

- [ ] Integracje z localStorage sa przetestowane
- [ ] Integracje z DOM (document.documentElement.classList) sa przetestowane
- [ ] State management jest przetestowany (React Context synchronizacja)
- [ ] Graceful degradation przy błędach

### 7.3. E2E tests checklist

- [ ] Happy path jest przetestowany (toggle -> dark -> persists)
- [ ] Alternative flows sa przetestowane (system preference detection)
- [ ] Error scenarios sa przetestowane (disabled localStorage)
- [ ] Cross-page consistency jest przetestowana

### 7.4. Manual testing checklist

- [ ] Funkcjonalnosc działa zgodnie z acceptance criteria
- [ ] Wszystkie edge cases sa obslugiwane (localStorage blocked, invalid values)
- [ ] UI jest responsywne - mobile (320px+), tablet (768px+), desktop (1024px+)
- [ ] Testowanie w roznych przeglądarkach: Chrome, Firefox, Safari, Edge
- [ ] Testowanie na roznych rozmiarach ekranu (phone, tablet, laptop, desktop)
- [ ] Testowanie z rozna rola uzytkownika: guest (landing), authenticated (dashboard)
- [ ] Testowanie dostepnosci: keyboard navigation (Tab, Enter, Space), screen reader (NVDA, VoiceOver), focus indicators
- [ ] Testowanie performance: toggle < 16ms, brak flickera, smooth transitions

### 7.5. Regression testing

- [ ] Obszar 1: Istniejące komponenty UI - sprawdzić czy wszystkie są czytelne w dark mode
- [ ] Obszar 2: Toast notifications - sprawdzić czy są widoczne w obu trybach
- [ ] Obszar 3: Modals/Dialogs - sprawdzić poprawne kontrasy
- [ ] Obszar 4: Forms - sprawdzić focus states i error states w obu trybach
- [ ] Obszar 5: Cards/Tables - sprawdzić borders i backgrounds
- [ ] Obszar 6: Navigation/Menus - sprawdzić hover states i active states

## 8. Analiza ryzyka i mitigation

### 8.1. Zidentyfikowane ryzyka

#### Ryzyko 1: Flicker przy pierwszym załadowaniu (FOUC - Flash of Unstyled Content)

- Severity: HIGH
- Prawdopodobienstwo: MEDIUM
- Wpływ: Zła user experience, wrażenie "buggy" aplikacji
- Mitigation: Inline script w <head> aplikuje class="dark" synchronicznie przed renderowaniem body. Script jest mały (~10 linii) i wykonuje się instant.
- Contingency plan: Jeśli flicker się pojawi, dodać additional CSS w <style> tag dla immediate dark mode styles, lub use SSR hint (Astro może pre-render z poprawną klasą)

#### Ryzyko 2: localStorage niedostępny (private browsing, permissions)

- Severity: MEDIUM
- Prawdopodobienstwo: LOW
- Wpływ: Brak persystencji preferencji między sesjami
- Mitigation: Try-catch wokół localStorage operations, fallback do memory-only state (useState bez persistence)
- Contingency plan: Feature działa dalej, tylko bez persystencji. User może nadal toggleować theme w ramach sesji.

#### Ryzyko 3: CSS variables nie pokrywają wszystkich komponentów

- Severity: MEDIUM
- Prawdopodobienstwo: LOW
- Wpływ: Niektóre komponenty mogą być nieczytelne w dark mode
- Mitigation: Weryfikacja wszystkich komponentów podczas manual testing. Wszystkie shadcn/ui komponenty już używają CSS variables. Custom komponenty mogą wymagać fixes.
- Contingency plan: Identyfikacja problematycznych komponentów i fix inline styles lub dodanie brakujących CSS variables.

#### Ryzyko 4: Performance degradation przy smooth transitions

- Severity: LOW
- Prawdopodobienstwo: MEDIUM
- Wpływ: Laggy transitions przy dużej liczbie elementów
- Mitigation: Transitions są optional enhancement. Testować z DevTools Performance profiler. Jeśli > 16ms, wyłączyć transitions.
- Contingency plan: Instant switch bez transitions. UX nadal dobry.

### 8.2. Technical debt i trade-offs

- Trade-off 1: Inline script w HTML vs flicker - decyzja: Inline script jest konieczny dla UX. Minor technical debt (10 linii kodu), ale duży gain w user experience.
- Trade-off 2: LocalStorage tylko vs server-side persistence - decyzja MVP: tylko localStorage. Server-side persistence to nice-to-have dla przyszłej rozbudowy (sync między urządzeniami). Dla MVP wystarczy localStorage.
- Trade-off 3: Dwa tryby (light/dark) vs trzy (light/dark/auto) - decyzja MVP: dwa tryby. Trzeci "auto" (follow system real-time) to enhancement który można dodać później jeśli users request.

### 8.3. Rollback plan

W razie krytycznego problemu po wdrożeniu:

1. Revert merge commit do brancha main/master
2. Usunąć ThemeToggle z UI (ukryć komponent)
3. Usunąć inline script z Layout.astro
4. Pozostawić CSS variables (są backward compatible - nie szkodzą)
5. Deploy rollback do production
6. Investigate issue, fix, re-deploy

Rollback jest prosty ponieważ feature jest izolowany i nie modyfikuje core functionality.

### 8.4. Monitoring i observability

Co monitorowac po wdrozeniu feature:

- Metryka 1: Adoption rate - ile % użytkowników używa dark mode (localStorage analytics lub server-side telemetry)
- Metryka 2: Toggle frequency - jak często users przełączają theme (może wskazywać na problemy z auto-detection)
- Metryka 3: Browser console errors - monitorować errory związane z localStorage lub theme switching
- Performance metrics: Time to Interactive (TTI), First Contentful Paint (FCP) - upewnić się że inline script nie wpływa negatywnie
- User feedback: Zbierać feedback czy są problemy z czytelnością w dark mode
- Logi: Logować błędy w ThemeProvider (localStorage errors, DOM errors)
- Alerty: Alert jeśli error rate > 1% dla theme-related errors

## 9. Zgodnosc ze standardami

### 9.1. Copilot-instructions.md compliance

- React patterns: ✅ - Functional components, hooks (useState, useEffect, useContext), React.memo nie potrzebne (prosty state)
- Astro patterns: ✅ - Proper use of Layout.astro, is:inline directive, SSR compatible
- Accessibility (ARIA, WCAG): ✅ - ARIA labels, keyboard navigation, focus management, screen reader support (aria-pressed, sr-only text)
- TypeScript best practices: ✅ - Strict typing, type safety, interface definitions
- Testing patterns: ✅ - Unit tests (Vitest), integration tests, E2E tests (Playwright)
- Styling (Tailwind): ✅ - Tailwind classes, CSS variables, @layer base, shadcn/ui patterns

### 9.2. Tech-stack.md compliance

- Framework/library compatibility: ✅ - React 19, Astro 5, TypeScript 5
- New dependencies justified: ✅ - Brak nowych dependencies (wykorzystuje lucide-react już zainstalowane)
- Build tools compatibility: ✅ - Vite compatible, no build config changes needed

### 9.3. Security checklist

- [ ] Input validation - N/A (brak user input poza click)
- [ ] Authorization - N/A (feature dostępne dla wszystkich)
- [ ] Authentication - N/A (działa dla authenticated i anonymous users)
- [ ] XSS protection - ✅ localStorage key i values są kontrolowane (nie user-generated)
- [ ] CSRF protection - N/A (brak HTTP requests)
- [ ] SQL injection protection - N/A (brak database operations w MVP)
- [ ] Secrets management - ✅ brak secrets
- [ ] Rate limiting - N/A (client-side only)
- [ ] Data privacy - ✅ localStorage zawiera tylko theme preference (non-sensitive)
- [ ] Secure communication - N/A (client-side only)

### 9.4. Performance checklist

- [ ] Bundle size impact - ✅ ~2kb nowego kodu (ThemeProvider + ThemeToggle), zero external deps
- [ ] Code splitting - N/A (komponent mały, nie wymaga lazy loading)
- [ ] Rendering optimization - ✅ Context re-renders tylko when theme changes, minimal impact
- [ ] Loading states - N/A (instant toggle)
- [ ] Error boundaries - ⚠️ można dodać ErrorBoundary wokół ThemeProvider (optional)
- [ ] Caching strategy - N/A (localStorage jest cache)
- [ ] Image optimization - N/A (SVG icons z lucide-react)
- [ ] Database query optimization - N/A (brak DB queries w MVP)

### 9.5. Accessibility checklist (dla UI features)

- [ ] ARIA attributes - ✅ aria-label, aria-pressed, aria-hidden na ikonie
- [ ] Keyboard navigation - ✅ button accessible via Tab, Enter, Space
- [ ] Focus management - ✅ focus-visible:ring-2 focus indicator
- [ ] Semantic HTML - ✅ <button type="button"> jest semantyczny
- [ ] Color contrast - ✅ CSS variables zapewniają minimum 4.5:1 contrast (już verified w global.css)
- [ ] Screen reader testing - manual test z NVDA/VoiceOver (dodane do checklist)
- [ ] Alternative text - ✅ sr-only text dla screen readers
- [ ] Form labels - N/A (nie jest form input)
- [ ] Error messages - N/A (brak error states w UI)

### 9.6. SEO checklist (jesli dotyczy)

- [ ] Meta tags - N/A (theme nie wpływa na meta tags)
- [ ] Open Graph tags - N/A
- [ ] Structured data - N/A
- [ ] Canonical URLs - N/A
- [ ] Sitemap update - N/A

SEO nie dotyczy tego feature. Theme preference jest client-side i nie wpływa na crawlers.

## 10. Dokumentacja

### 10.1. Changelog entry

```markdown
### Added

- Dark Mode Switcher - Users can now toggle between light and dark color schemes. Theme preference is persisted across sessions and automatically detects system preferences on first visit.
```

### 10.2. README update (jesli wymagane)

Sekcja do dodania w README.md (jeśli jest sekcja "Features"):

```markdown
## Features

- Dark Mode - Toggle between light and dark themes with automatic system preference detection
```

Sekcja "For Developers" (jeśli jest):

````markdown
## Theme System

The application supports light and dark color modes. Theme is managed via React Context and persisted in localStorage.

### Using Theme in Components

```typescript
import { useTheme } from "@/contexts/ThemeContext";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```
````

### Color Variables

All colors use CSS variables defined in `src/styles/global.css`. Always use CSS variables instead of hardcoded colors:

```typescript
// ✅ Good
<div className="bg-background text-foreground border-border">

// ❌ Bad
<div className="bg-white text-black border-gray-200">
```

### Theme Toggle Placement

The `ThemeToggle` component can be placed anywhere in the app:

```typescript
import { ThemeToggle } from "@/components/layout/ThemeToggle";

<ThemeToggle />
```

````

### 10.3. Dokumentacja techniczna

Dokumentacja dla developerow (może być jako komentarze w kodzie lub osobny doc):

ThemeProvider API:
- `theme: Theme` - Current active theme ("light" | "dark")
- `setTheme(theme: Theme): void` - Set theme explicitly
- `toggleTheme(): void` - Toggle between light and dark

Nowe hooki:
- `useTheme(): ThemeContextValue` - Access theme context. Must be used within ThemeProvider.

Architecture decisions:
- Inline script w Layout.astro - Konieczne dla zapobieżenia FOUC. Script jest mały i nie wpływa na performance.
- localStorage jako persistence layer - Prosty i wystarczający dla MVP. Server-side persistence może być dodane w przyszłości dla sync między urządzeniami.
- CSS variables - Wszystkie kolory zarządzane przez :root i .dark w global.css. To zapewnia automatic styling dla wszystkich komponentów.
- Class-based switching (.dark na html) - Preferowane nad data attributes dla lepszej kompatybilności z Tailwind CSS.

### 10.4. User documentation (jesli wymagane)

Nie wymagane dla MVP. Feature jest intuicyjny (Sun/Moon icon).

Opcjonalnie dla Help Center:

```markdown
# Dark Mode

You can switch between light and dark color themes using the theme toggle button.

## How to Switch Themes

1. Look for the Sun/Moon icon button (usually in the header)
2. Click the button to toggle between light and dark modes
3. Your preference will be saved automatically

## System Preference

On your first visit, the app will automatically match your system's color scheme preference. After you manually change the theme, your choice will be remembered.

## Troubleshooting

- Theme not saving? Check if your browser allows localStorage (may be blocked in private browsing mode)
- Theme looks incorrect? Try refreshing the page or clearing your browser cache
````

### 10.5. Release notes

Informacja dla uzytkownikow koncowych w release notes:

```markdown
## 🎨 New Feature: Dark Mode

We've added dark mode support! You can now switch between light and dark color themes.

### What's New

- Toggle button for switching between light and dark themes
- Your theme preference is automatically saved
- Automatic detection of your system's color scheme preference
- Smooth transitions between themes

### How to Use

Look for the Sun/Moon icon button in the header. Click it to switch between themes. That's it!

### Benefits

- Reduce eye strain in low-light environments
- Personalize your experience
- Better battery life on OLED screens (when using dark mode)
```

## 11. Timeline i effort estimation

### 11.1. Estymacja czasu

- Analiza i design: 0.5 godziny (already done w tym planie)
- Implementacja core: 3-4 godziny
  - ThemeProvider + useTheme: 1-1.5h
  - ThemeToggle component: 1h
  - Layout.astro inline script: 0.5h
  - Integracja z AppLayout: 0.5h
- Testy (unit + integration): 2 godziny
- E2E testy: 1.5 godziny
- Code review: 1 godzina
- Bug fixes post-review: 0.5-1 godzina
- Documentation: 0.5 godziny (README, comments)
- Deployment: 0.5 godziny
- Monitoring post-deployment: 2 dni

Łącznie: 9.5-11 godzin (1.5 dnia roboczego)

### 11.2. Zaleznosci i blokery

Blokujace:

- Brak blokujących zależności - feature może być rozpoczęty natychmiast

Blokowane przez ten feature:

- Brak - żadne inne features nie czekają na dark mode

External dependencies:

- Brak - wszystkie potrzebne tools już dostępne (lucide-react zainstalowane)

### 11.3. Sugerowany timeline

- Analysis & Planning complete: 2026-02-21 (dzisiaj)
- Development start: 2026-02-22
- Core implementation complete: 2026-02-22 EOD
- Tests complete: 2026-02-23 noon
- Code review: 2026-02-23 EOD
- Fixes & polish: 2026-02-24 morning
- Deployment to staging: 2026-02-24 noon
- QA/UAT on staging: 2026-02-24 - 2026-02-25
- Deployment to production: 2026-02-26
- Post-launch monitoring: 2026-02-26 - 2026-02-28

### 11.4. Milestones

- [ ] Milestone 1: Core implementation done (ThemeProvider + ThemeToggle + Layout.astro) - 2026-02-22
- [ ] Milestone 2: Tests passing (unit + integration + E2E) - 2026-02-23
- [ ] Milestone 3: Production deployment successful - 2026-02-26
- [ ] Milestone 4: Post-launch monitoring complete, no critical issues - 2026-02-28

## 12. Załączniki

### 12.1. Pliki do utworzenia (lista pelna)

```
src/types/theme.types.ts
src/contexts/ThemeContext.tsx
src/components/layout/ThemeToggle.tsx
src/contexts/ThemeContext.test.tsx
src/components/layout/ThemeToggle.test.tsx
src/components/layout/ThemeToggle.integration.test.tsx
e2e/theme.spec.ts
```

### 12.2. Pliki do modyfikacji (lista pelna)

```
src/layouts/Layout.astro (dodanie inline script)
src/components/layout/AppLayout.tsx (integracja ThemeProvider, umieszczenie ThemeToggle)
README.md (opcjonalnie - dokumentacja)
```

### 12.3. Referencje

- Related issue: N/A
- Design mockups: N/A (prosty toggle button, standardowy pattern)
- PRD: N/A
- Technical RFC: Ten dokument
- Similar features in other projects:
  - Next.js docs: https://nextjs.org (theme toggle w header)
  - Tailwind UI: https://tailwindui.com (dark mode examples)
  - shadcn/ui docs: https://ui.shadcn.com (dark mode implementation)
  - Vercel: https://vercel.com (smooth dark mode transitions)

### 12.4. Mockupy/Wireframes

Brak formal mockups. Feature używa standardowego pattern:

- Toggle button z Sun icon (light mode) lub Moon icon (dark mode)
- Umieszczony w header obok innych navigation controls
- Minimal styling - focus na functionality i accessibility

Visual reference:

```
[Light Mode]                    [Dark Mode]
┌─────────────────┐            ┌─────────────────┐
│  Logo  [🌙]     │            │  Logo  [☀️]     │
└─────────────────┘            └─────────────────┘
```

### 12.5. API Documentation (jesli nowe API)

ThemeContext API:

```typescript
interface ThemeContextValue {
  // Current active theme
  theme: Theme; // "light" | "dark"

  // Set theme explicitly
  setTheme: (theme: Theme) => void;

  // Toggle between light and dark
  toggleTheme: () => void;
}

// Usage
const { theme, setTheme, toggleTheme } = useTheme();
```

Internal helpers (nie eksportowane, ale dla dokumentacji):

```typescript
// Get system color scheme preference
function getSystemTheme(): Theme;

// Get stored theme from localStorage
function getStoredTheme(): Theme | null;

// Apply theme to document element
function applyTheme(theme: Theme): void;
```

localStorage API:

- Key: `"theme-preference"`
- Values: `"light"` | `"dark"`
- Fallback: System preference via `matchMedia("(prefers-color-scheme: dark)")`

---

## CHECKPOINT: Pytania przed rozpoczęciem implementacji

1. UMIEJSCOWIENIE TOGGLE BUTTON:
   Gdzie preferujesz umieścić ThemeToggle?

   Opcja A: W header obok innych controls (wymaga sprawdzenia czy header istnieje)
   Opcja B: Fixed button w bottom-right corner (zawsze widoczny, nie-inwazyjny)
   Opcja C: W dropdown menu użytkownika (jeśli AvatarMenu istnieje)
   Opcja D: W każdym miejscu - dostarczę komponent, Ty umieścisz gdzie chcesz

   Rekomendacja: Opcja A lub D

2. SMOOTH TRANSITIONS:
   Czy chcesz smooth color transitions między trybami (200ms ease-in-out)?

   Pros: Ładniejszy efekt wizualny, mniej jarring
   Cons: Może wpłynąć na performance przy dużej liczbie elementów

   Rekomendacja: Zaimplementować jako optional, testować performance, wyłączyć jeśli laggy

3. SCOPE MVP vs ENHANCEMENTS:
   Czy MVP (2 tryby: light/dark + persystencja + toggle) jest wystarczający, czy chcesz od razu:
   - Trzeci tryb "auto" (follow system real-time)?
   - Server-side persistence (kolumna w DB)?
   - Synchronizacja między kartami (BroadcastChannel)?

   Rekomendacja: MVP jest wystarczający, enhancements można dodać później based on user feedback

Proszę o feedback na powyższe pytania, następnie przejdę do implementacji zgodnie z planem.
