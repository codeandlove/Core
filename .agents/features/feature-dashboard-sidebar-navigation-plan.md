# Plan Implementacji Feature - Dashboard Sidebar Navigation

Data utworzenia: 2026-02-22
Tytul feature: Lewa nawigacja boczna w dashboard
Typ: UI/UX
Priorytet: MEDIUM

## 1. Podsumowanie wykonawcze

### 1.1. Opis funkcjonalnosci

Dodanie lewej nawigacji bocznej (sidebar) w obszarze dashboard, która będzie zawierać link "Dashboard" prowadzący do głównego widoku oraz dodatkowy prosty link prowadzący do strony 404. Komponent musi być modularny, zwięzły i łatwy do wyłączenia lub usunięcia z projektu w przyszłości.

### 1.2. Value proposition

Wartość dla użytkownika:
- Ułatwiona nawigacja między sekcjami aplikacji
- Jasna struktura informacyjna przestrzeni dashboard
- Przygotowanie architektury na przyszłe sekcje (Settings, Profile, Analytics, etc.)

Wartość dla biznesu:
- Skalowalność UI - łatwe dodawanie nowych sekcji w przyszłości
- Flexibility - możliwość łatwego wyłączenia jeśli model biznesowy nie wymaga wielu sekcji
- Standardowy UX pattern - użytkownicy znają ten wzorzec z innych aplikacji SaaS

### 1.3. Zakres wpływu

- Nowe komponenty/moduły:
  - `DashboardSidebar.tsx` - główny komponent nawigacji bocznej
  - `DashboardLayout.tsx` - layout wrapper z sidebar (opcjonalnie)
  - Nowa strona 404 (jeśli nie istnieje)

- Modyfikowane komponenty/moduły:
  - `AppLayout.tsx` - dodanie obsługi sidebar
  - `DashboardPageWrapper.tsx` - integracja z nowym layoutem
  - Routing dla strony 404

- Grupa docelowa użytkowników: wszyscy zalogowani użytkownicy
- Dotknięte środowiska: development, staging, production

### 1.4. Priorytet i MVP scope

MEDIUM - ważny element UX, ale nie blokuje podstawowych funkcjonalności

MVP (must-have):
- Komponent sidebar z linkami Dashboard i placeholder link
- Responsywność - sidebar zwijany/rozwijany na mobile
- Integracja z istniejącym AppLayout
- Strona 404 (simple implementation)
- Dark mode support
- Możliwość łatwego wyłączenia przez props

Nice-to-have (może być dodane później):
- Animacje expand/collapse sidebar
- Active state visualization z wyróżnieniem aktywnej sekcji
- Breadcrumbs w header
- User preferences dla stanu sidebar (expanded/collapsed)
- Keyboard shortcuts do nawigacji
- Icons dla każdej sekcji

## 2. Szczegółowa analiza wymagań

### 2.1. Wymagania funkcjonalne

1. Sidebar musi być widoczny po lewej stronie dashboard - priorytet: MUST
2. Pierwszy link "Dashboard" prowadzi do `/dashboard` - priorytet: MUST
3. Drugi link prowadzi do strony 404 - priorytet: MUST
4. Sidebar musi być responsywny (collapse na mobile) - priorytet: MUST
5. Sidebar musi wspierać dark mode - priorytet: MUST
6. Sidebar musi być łatwy do wyłączenia przez prop - priorytet: MUST
7. Sidebar zachowuje stan (expanded/collapsed) podczas nawigacji - priorytet: SHOULD
8. Active link highlighting - priorytet: SHOULD
9. Smooth animations - priorytet: COULD

### 2.2. Wymagania niefunkcjonalne

- Performance: Sidebar nie może spowalniać renderowania strony, lazy loading jeśli potrzebny
- Security: Brak wymagań bezpieczeństwa (public navigation)
- Accessibility:
  - WCAG 2.1 AA compliance
  - Keyboard navigation (Tab, Enter, Space)
  - Screen reader support (ARIA labels, roles)
  - Focus management przy collapse/expand
- SEO: N/A (authenticated area)
- Compatibility:
  - Desktop: wszystkie współczesne przeglądarki (Chrome, Firefox, Safari, Edge)
  - Mobile: iOS Safari, Chrome Android
  - Responsive breakpoints: sm (640px), md (768px), lg (1024px)

### 2.3. User stories i use cases

#### User Story 1: Podstawowa nawigacja

Jako zalogowany użytkownik
Chcę widzieć menu nawigacyjne po lewej stronie
Aby łatwo przełączać się między sekcjami aplikacji

Acceptance Criteria:
- [ ] Sidebar jest widoczny na desktop (szerokość ekranu >= 1024px)
- [ ] Link "Dashboard" jest na górze sidebar
- [ ] Kliknięcie "Dashboard" prowadzi do głównego widoku dashboard
- [ ] Drugi link jest widoczny i klikalny
- [ ] Drugi link prowadzi do strony 404

#### User Story 2: Responsywność mobile

Jako użytkownik mobile
Chcę móc rozwinąć/zwinąć sidebar
Aby mieć więcej miejsca na treść główną

Acceptance Criteria:
- [ ] Na mobile sidebar jest domyślnie zwinięty (hamburger menu)
- [ ] Kliknięcie hamburger menu rozwija sidebar
- [ ] Kliknięcie poza sidebar zwija go z powrotem
- [ ] Stan sidebar nie blokuje interakcji z główną treścią

#### User Story 3: Dostępność

Jako użytkownik korzystający z klawiatury
Chcę móc nawigować sidebar używając klawiatury
Aby korzystać z aplikacji bez myszy

Acceptance Criteria:
- [ ] Tab key przechodzi przez linki w sidebar
- [ ] Enter/Space aktywuje link
- [ ] Focus jest widoczny na aktywnym elemencie
- [ ] Screen reader ogłasza nazwy linków i ich funkcje

### 2.4. Edge cases i scenariusze alternatywne

- Edge case 1: Bardzo długie nazwy sekcji - tekst powinien się zawijać lub być skracany z ellipsis
- Edge case 2: Bardzo wąski ekran (< 320px) - sidebar overlay lub minimalna szerokość
- Edge case 3: Użytkownik wyłącza JavaScript - sidebar powinien być widoczny jako static HTML
- Edge case 4: Bardzo dużo sekcji (> 10) - vertical scroll w sidebar
- Error scenario 1: Link 404 nie istnieje - fallback do domyślnej strony 404
- Error scenario 2: Routing error - graceful error handling

### 2.5. Integracje i zależności

#### Wewnętrzne zależności:

- AppLayout - integracja sidebar jako optional element
- Header - potencjalnie dodanie hamburger button na mobile
- ThemeContext - sidebar musi reagować na zmiany motywu
- AuthContext - weryfikacja czy użytkownik jest zalogowany (sidebar tylko dla auth users)

#### External APIs / Third-party services:

Brak external dependencies

#### Zależności od innych features:

- Strona 404 musi być utworzona przed deployment
- Aktualny routing system musi obsługiwać 404 routing
- Brak blokujących zależności

## 3. Architektura i design

### 3.1. Diagram architektury

```
[Browser]
    |
    v
[/dashboard route]
    |
    v
[DashboardPageWrapper]
    |
    v
[AppLayout with sidebar enabled]
    |
    +----> [Header]
    +----> [DashboardSidebar] <--- NOWY KOMPONENT
    |          |
    |          +----> [Link: Dashboard]
    |          +----> [Link: Coming Soon (404)]
    |
    +----> [DashboardView] (main content)
```

### 3.2. Flow danych

1. Użytkownik nawiguje do `/dashboard`
2. DashboardPageWrapper renderuje się
3. AppLayout otrzymuje prop `showSidebar={true}`
4. AppLayout renderuje DashboardSidebar obok main content
5. Użytkownik klika link w sidebar
6. React Router / Astro routing przekierowuje do odpowiedniej strony
7. DashboardSidebar podświetla aktywny link (jeśli implemented)
8. Main content area re-renderuje się z nową treścią

Responsive flow (mobile):
1. Na mobile DashboardSidebar renderuje się jako overlay (hidden by default)
2. Header wyświetla hamburger button
3. Kliknięcie hamburger → state change → sidebar overlay visible
4. Kliknięcie link lub outside → sidebar hidden

### 3.3. Model danych

#### Nowe typy/interfejsy:

```typescript
// src/types/navigation.ts
export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  badge?: string | number;
}

export interface SidebarConfig {
  items: NavigationItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

// src/components/layout/DashboardSidebar.tsx
interface DashboardSidebarProps {
  items: NavigationItem[];
  currentPath?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onNavigate?: (item: NavigationItem) => void;
}
```

#### Nowe tabele w bazie danych (jeśli wymagane):

Brak - to czysto frontendowa funkcjonalność

#### Modyfikacje istniejących tabel (jeśli wymagane):

Brak

### 3.4. Komponenty i moduły

#### Nowe komponenty:

- `src/components/layout/DashboardSidebar.tsx` - główny komponent sidebar z nawigacją
  - Odpowiedzialność: Renderowanie listy linków, obsługa active state, responsywność
  
- `src/components/layout/MobileSidebarToggle.tsx` - button do toggle sidebar na mobile
  - Odpowiedzialność: Hamburger icon, toggle state management

- `src/pages/404.astro` - strona 404 (jeśli nie istnieje)
  - Odpowiedzialność: Wyświetlenie error message i link powrotny

#### Modyfikowane komponenty:

- `src/components/layout/AppLayout.tsx` - dodanie sidebar slot/prop i layoutu grid/flex
  - Zmiana: Dodanie props `showSidebar`, `sidebarContent`, layout adjustment

- `src/components/dashboard/DashboardPageWrapper.tsx` - przekazanie sidebar do AppLayout
  - Zmiana: Dodanie DashboardSidebar jako prop do AppLayout

- `src/components/layout/Header.tsx` - potencjalnie dodanie hamburger button
  - Zmiana: Conditional rendering hamburger button na mobile

#### Nowe serwisy/hooki:

- `src/hooks/useSidebarState.ts` - hook do zarządzania stanem sidebar (expanded/collapsed)
  - Funkcjonalność: localStorage persistence, toggle function, responsive detection

#### Nowe utilities:

- `src/lib/navigation.ts` - helper do konfiguracji nawigacji
  - Funkcje: getNavigationItems(), isActiveRoute()

#### Nowe API endpoints (jeśli backend):

Brak - frontendowa funkcjonalność

## 4. Propozycje podejść architektonicznych

### 4.1. Podejście A: Sidebar jako część AppLayout (REKOMENDOWANE)

#### Opis:

Sidebar będzie integralną częścią AppLayout, kontrolowaną przez prop `showSidebar`. AppLayout wykorzysta CSS Grid do układu (sidebar | main content). Na mobile sidebar będzie overlay z animacją slide-in. Stan sidebar (collapsed/expanded) zarządzany przez React state + localStorage.

#### Architektura:

```
AppLayout (CSS Grid: sidebar-area | content-area)
  ├─ Header (sticky top, full width)
  ├─ DashboardSidebar (grid-area: sidebar, sticky left)
  │   ├─ Navigation items list
  │   └─ Collapse button
  └─ main content (grid-area: content, flex-1)
```

Mobile: Sidebar jako fixed overlay z backdrop

#### Zakres zmian:

Nowe pliki:
- `src/components/layout/DashboardSidebar.tsx`
- `src/components/layout/MobileSidebarToggle.tsx`
- `src/hooks/useSidebarState.ts`
- `src/lib/navigation.ts`
- `src/types/navigation.ts`
- `src/pages/404.astro` (jeśli nie istnieje)

Modyfikowane pliki:
- `src/components/layout/AppLayout.tsx` - grid layout, sidebar integration
- `src/components/dashboard/DashboardPageWrapper.tsx` - pass sidebar prop
- `src/components/layout/Header.tsx` - hamburger button na mobile

Nowe dependencies: Brak (używamy lucide-react już zainstalowane)

Database migrations: Brak

Testy:
- Unit tests: DashboardSidebar, useSidebarState
- E2E tests: dashboard navigation, responsive behavior

#### Zalety:

- Integracja z istniejącym layoutem - minimalne zmiany
- CSS Grid daje elastyczność i łatwą responsywność
- Sidebar jako opcjonalny prop - łatwe włączenie/wyłączenie
- Reusable - może być użyty w innych widokach (Settings, Profile)
- Performance - brak dodatkowych wrapperów, prosty DOM tree
- Accessibility - semantic HTML, łatwe zarządzanie focus

#### Wady:

- AppLayout stanie się nieco bardziej złożony
- Grid może wymagać dodatkowych media queries

#### Effort: S (1 dzień)

- Setup struktura plików: 1h
- Implementacja DashboardSidebar: 2h
- Integracja z AppLayout: 1h
- Mobile responsywność + toggle: 2h
- 404 page: 30min
- Testy: 1.5h
Razem: ~8 godzin

#### Złożoność: LOW

Prosta implementacja, dobrze znane patterns (sidebar navigation), brak skomplikowanej logiki biznesowej.

#### Impact na system: LOW

Sidebar jest opcjonalny, nie wpływa na istniejące komponenty jeśli nie włączony. Modyfikacje AppLayout są additive (nowe props), nie breaking changes.

#### Zgodność ze standardami:

- Copilot-instructions.md: ✅
  - React functional components + hooks
  - Tailwind CSS styling
  - Accessibility (ARIA, keyboard navigation)
  - Responsive design patterns
  
- Tech-stack.md: ✅
  - Astro + React
  - TypeScript
  - Tailwind CSS
  - Lucide icons (już używane)
  
- Best practices: ✅
  - Component composition
  - Props-based configuration
  - Theme support
  - Accessible markup

### 4.2. Podejście B: Dedykowany DashboardLayout wrapper

#### Opis:

Utworzenie nowego komponentu DashboardLayout który opakowuje AppLayout i dodaje sidebar. Ten layout byłby używany tylko w dashboard views. Sidebar niezależny od AppLayout.

#### Architektura:

```
DashboardLayout
  ├─ DashboardSidebar (fixed left)
  └─ AppLayout (existing, zajmuje resztę przestrzeni)
      ├─ Header
      └─ main content
```

#### Zakres zmian:

Nowe pliki:
- `src/components/layout/DashboardLayout.tsx`
- `src/components/layout/DashboardSidebar.tsx`
- `src/hooks/useSidebarState.ts`
- `src/lib/navigation.ts`
- `src/types/navigation.ts`
- `src/pages/404.astro`

Modyfikowane pliki:
- `src/components/dashboard/DashboardPageWrapper.tsx` - użycie DashboardLayout zamiast bezpośredniego AppLayout

Nowe dependencies: Brak

Database migrations: Brak

Testy:
- Unit tests: DashboardLayout, DashboardSidebar, useSidebarState
- E2E tests: dashboard navigation

#### Zalety:

- Separacja concerns - AppLayout pozostaje niezmieniony
- Łatwiejsze testowanie - izolowany DashboardLayout
- Flexibility - różne layouty dla różnych sekcji (dashboard, settings, admin)
- Brak modyfikacji AppLayout - zero risk dla innych widoków

#### Wady:

- Dodatkowy wrapper component - jeden poziom więcej w DOM tree
- Mniejsza reusability - sidebar zamknięty w DashboardLayout
- Duplikacja - jeśli inne sekcje też potrzebują sidebar, trzeba będzie refactor
- Większa złożoność kodu - więcej komponentów

#### Effort: S-M (1-1.5 dnia)

Podobny effort jak Podejście A, ale dodatkowy czas na DashboardLayout wrapper i integration testing.

#### Złożoność: MEDIUM

Więcej komponentów, więcej abstrakcji, potencjalna złożoność w zarządzaniu layoutem.

#### Impact na system: LOW

Podobnie jak Podejście A, zmiany izolowane do dashboard area.

#### Zgodność ze standardami:

- Copilot-instructions.md: ⚠️
  - Zgodne, ale dodaje dodatkowy wrapper który może nie być konieczny
  
- Tech-stack.md: ✅
  
- Best practices: ⚠️
  - Over-engineering dla prostego use case

### 4.3. Podejście C: Sidebar jako React Portal

#### Opis:

Sidebar renderowany przez React Portal do dedykowanego DOM node. Daje maksymalną flexibility ale większą złożoność.

#### Architektura:

```
AppLayout
  ├─ Header
  └─ main content

DashboardSidebar (renderowany przez Portal do #sidebar-root)
```

#### Zakres zmian:

Podobny jak Podejście A + dodatkowo:
- Modyfikacja Layout.astro - dodanie #sidebar-root div
- Portal implementation w DashboardSidebar

#### Zalety:

- Maksymalna flexibility w pozycjonowaniu
- Sidebar niezależny od layoutu głównego

#### Wady:

- Over-engineering dla tego use case
- Większa złożoność
- Trudniejsze zarządzanie z-index i styling
- Accessibility challenges (focus management)

#### Effort: M (2-3 dni)

Dodatkowa złożoność portal implementation i testing.

#### Złożoność: HIGH

Portal + state management + accessibility = duża złożoność.

#### Impact na system: MEDIUM

Modyfikacja base Layout.astro wpływa na wszystkie strony.

#### Zgodność ze standardami:

- Copilot-instructions.md: ❌
  - Over-engineered solution
  
- Best practices: ❌
  - "Prefer robust, explicit, and production-grade approaches" - Portal tutaj niepotrzebny

## 5. Rekomendacja i uzasadnienie

### 5.1. Wybrane podejście

PODEJSCIE A: Sidebar jako część AppLayout

### 5.2. Uzasadnienie wyboru

Najlepiej realizuje wymagania biznesowe poprzez:
- Prosty, zwięzły kod - łatwy do usunięcia/wyłączenia jeśli nie będzie potrzebny
- Sidebar kontrolowany przez prop `showSidebar={true/false}` - można wyłączyć w jednym miejscu
- Minimalne zmiany w istniejącym kodzie - tylko additive props

Skaluje się w przyszłości:
- Łatwo dodawać nowe navigation items przez props
- Reusable - może być użyty w innych authenticated views
- Sidebar config może być moved do pliku konfiguracyjnego lub nawet database w przyszłości

Jest zgodne ze standardami projektu i architekturą:
- React functional components + hooks (copilot-instructions.md)
- Tailwind CSS styling
- TypeScript types
- Accessibility first (WCAG 2.1 AA)

Minimalizuje złożoność i technical debt:
- Jeden nowy główny komponent (DashboardSidebar)
- Minimalna modyfikacja istniejących komponentów
- Brak dodatkowych wrapperów czy abstrakcji
- Jasna odpowiedzialność każdego komponentu

Optymalizuje user experience:
- Standardowy UX pattern (sidebar navigation) - użytkownicy znają
- Responsywny design - działa na mobile i desktop
- Smooth interactions - collapse/expand
- Keyboard accessible

Optymalizuje performance:
- Brak dodatkowych re-renders
- Prosty DOM tree
- CSS Grid native performance
- Brak external dependencies

## 6. Szczegółowy plan implementacji

### 6.1. Faza 1: Przygotowanie

- [ ] Utworzenie brancha: `feature/dashboard-sidebar-navigation`
- [ ] Przygotowanie środowiska dev (npm install - bez nowych dependencies)
- [ ] Analiza istniejących breakpoints w tailwind.config
- [ ] Sprawdzenie czy strona 404.astro istnieje
- [ ] Setup plików według struktury

### 6.2. Faza 2: Implementacja core functionality

#### Krok 1: Utworzenie typów navigation

Cel: Zdefiniować TypeScript types dla navigation items i sidebar config

Pliki do stworzenia:
- `src/types/navigation.ts`

Opis implementacji:
Utworzenie interfejsów NavigationItem i SidebarConfig z wszystkimi wymaganymi properties oraz optional fields dla przyszłej rozbudowy (icons, badges, disabled state).

Kod do utworzenia:

```typescript
/**
 * Navigation types for dashboard sidebar
 */
import type { ComponentType } from "react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  disabled?: boolean;
  badge?: string | number;
  external?: boolean;
}

export interface SidebarConfig {
  items: NavigationItem[];
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}
```

Uzasadnienie:
Types są podstawą - definiują kontrakt API dla sidebar. Optional fields dają flexibility na przyszłość.

Acceptance criteria:
- [ ] Types są exportowane
- [ ] NavigationItem ma wszystkie wymagane pola
- [ ] Optional fields są clearly marked

#### Krok 2: Utworzenie navigation config utility

Cel: Centralna konfiguracja navigation items

Pliki do stworzenia:
- `src/lib/navigation.ts`

Opis implementacji:
Helper function który zwraca domyślne navigation items dla dashboard. Można łatwo rozbudować o nowe sekcje w przyszłości.

Kod do utworzenia:

```typescript
/**
 * Navigation configuration and utilities
 */
import type { NavigationItem } from "@/types/navigation";

export function getDefaultDashboardNavigation(): NavigationItem[] {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      id: "coming-soon",
      label: "Coming Soon",
      href: "/coming-soon",
    },
  ];
}

/**
 * Check if current path matches navigation item
 */
export function isActiveRoute(itemHref: string, currentPath: string): boolean {
  if (itemHref === "/dashboard") {
    return currentPath === "/dashboard" || currentPath === "/dashboard/";
  }
  return currentPath.startsWith(itemHref);
}
```

Uzasadnienie:
Centralna konfiguracja ułatwia zarządzanie navigation items. Funkcja isActiveRoute będzie używana do highlight aktywnego linku.

Acceptance criteria:
- [ ] getDefaultDashboardNavigation zwraca tablicę NavigationItem
- [ ] isActiveRoute poprawnie wykrywa aktywny route
- [ ] Kod jest eksportowany i reusable

#### Krok 3: Utworzenie useSidebarState hook

Cel: Zarządzanie stanem sidebar (expanded/collapsed) z localStorage persistence

Pliki do stworzenia:
- `src/hooks/useSidebarState.ts`

Opis implementacji:
Custom React hook który zarządza stanem sidebar, persystuje go w localStorage, i reaguje na zmiany viewport size (mobile detection).

Kod do utworzenia:

```typescript
/**
 * Hook for managing sidebar state with localStorage persistence
 */
import { useState, useEffect } from "react";

const STORAGE_KEY = "sidebar-collapsed";
const MOBILE_BREAKPOINT = 1024; // lg breakpoint

export function useSidebarState(defaultCollapsed = false) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        setIsCollapsed(stored === "true");
      }
    } catch (error) {
      console.error("Failed to load sidebar state:", error);
    }
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Toggle function with localStorage persistence
  const toggle = () => {
    setIsCollapsed((prev) => {
      const newValue = !prev;
      try {
        localStorage.setItem(STORAGE_KEY, String(newValue));
      } catch (error) {
        console.error("Failed to save sidebar state:", error);
      }
      return newValue;
    });
  };

  return {
    isCollapsed,
    isMobile,
    toggle,
    setIsCollapsed,
  };
}
```

Uzasadnienie:
Hook encapsulates sidebar state logic - persistence, mobile detection, toggle. Reusable i łatwy do testowania.

Acceptance criteria:
- [ ] Hook zwraca isCollapsed, isMobile, toggle, setIsCollapsed
- [ ] Stan jest persystowany w localStorage
- [ ] Mobile detection działa poprawnie
- [ ] Error handling dla localStorage

#### Krok 4: Utworzenie DashboardSidebar component

Cel: Główny komponent sidebar z navigation items

Pliki do stworzenia:
- `src/components/layout/DashboardSidebar.tsx`

Opis implementacji:
React component który renderuje sidebar z listą navigation items. Support dla active state, keyboard navigation, ARIA attributes. Responsive - na mobile jest overlay.

Kod do utworzenia:

```typescript
/**
 * Dashboard Sidebar Navigation
 * Displays navigation links for dashboard sections
 */
import { Home } from "lucide-react";
import type { NavigationItem } from "@/types/navigation";
import { isActiveRoute } from "@/lib/navigation";

interface DashboardSidebarProps {
  items: NavigationItem[];
  currentPath?: string;
  isCollapsed?: boolean;
  isMobile?: boolean;
  onNavigate?: (item: NavigationItem) => void;
  onClose?: () => void;
}

export function DashboardSidebar({
  items,
  currentPath = "",
  isCollapsed = false,
  isMobile = false,
  onNavigate,
  onClose,
}: DashboardSidebarProps) {
  const handleItemClick = (item: NavigationItem) => {
    onNavigate?.(item);
    if (isMobile) {
      onClose?.();
    }
  };

  const sidebarClasses = isMobile
    ? "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transition-transform duration-300"
    : "sticky top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background";

  return (
    <>
      {/* Mobile backdrop */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${sidebarClasses} ${isMobile && isCollapsed ? "-translate-x-full" : "translate-x-0"}`}
        aria-label="Dashboard navigation"
      >
        <nav className="flex h-full flex-col p-4">
          <ul className="space-y-2" role="list">
            {items.map((item) => {
              const isActive = isActiveRoute(item.href, currentPath);
              const Icon = item.icon || Home;

              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (item.disabled) {
                        e.preventDefault();
                        return;
                      }
                      handleItemClick(item);
                    }}
                    className={`
                      flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors
                      ${isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}
                      ${item.disabled ? "pointer-events-none opacity-50" : ""}
                    `}
                    aria-current={isActive ? "page" : undefined}
                    aria-disabled={item.disabled}
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
```

Uzasadnienie:
Sidebar jako pure component - łatwy do testowania, reusable. ARIA attributes dla accessibility. Conditional styling dla mobile vs desktop.

Acceptance criteria:
- [ ] Renderuje wszystkie navigation items
- [ ] Active route jest highlighted
- [ ] Keyboard navigation działa
- [ ] Mobile overlay działa z backdrop
- [ ] ARIA labels są poprawne

#### Krok 5: Utworzenie MobileSidebarToggle component

Cel: Hamburger button do toggle sidebar na mobile

Pliki do stworzenia:
- `src/components/layout/MobileSidebarToggle.tsx`

Opis implementacji:
Prosty button component z hamburger icon, który toggle sidebar na mobile. Animated icon (hamburger → X).

Kod do utworzenia:

```typescript
/**
 * Mobile Sidebar Toggle Button
 * Hamburger menu button for mobile devices
 */
import { Menu, X } from "lucide-react";

interface MobileSidebarToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileSidebarToggle({
  isOpen,
  onToggle,
}: MobileSidebarToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary lg:hidden"
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      aria-expanded={isOpen}
      aria-controls="dashboard-sidebar"
    >
      {isOpen ? (
        <X className="h-6 w-6" aria-hidden="true" />
      ) : (
        <Menu className="h-6 w-6" aria-hidden="true" />
      )}
    </button>
  );
}
```

Uzasadnienie:
Prosty toggle button z accessibility features. Hidden na desktop (lg:hidden).

Acceptance criteria:
- [ ] Button renderuje się tylko na mobile
- [ ] Icon zmienia się (Menu ↔ X)
- [ ] ARIA attributes są poprawne
- [ ] Focus ring jest widoczny

#### Krok 6: Modyfikacja AppLayout

Cel: Dodanie obsługi sidebar w AppLayout

Pliki do modyfikacji:
- `src/components/layout/AppLayout.tsx`

Opis implementacji:
Dodanie props `showSidebar` i `sidebarContent`. Jeśli `showSidebar={true}`, AppLayout renderuje sidebar w grid layout.

Kod do dodania:

```typescript
// ...existing imports...

interface AppLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  showSubscriptionBanner?: boolean;
  scrollable?: boolean;
  // NOWE PROPS
  showSidebar?: boolean;
  sidebarContent?: ReactNode;
}

function AppLayoutContent({
  children,
  header,
  showSubscriptionBanner = true,
  scrollable = true,
  showSidebar = false,
  sidebarContent,
}: AppLayoutProps) {
  // ...existing code...

  const containerClass = scrollable
    ? "flex min-h-screen flex-col bg-background"
    : "flex h-screen flex-col overflow-hidden bg-background";

  const contentWrapperClass = showSidebar
    ? "flex flex-1 overflow-hidden"
    : "";

  const mainClass = scrollable ? "flex-1" : "flex-1 overflow-hidden";

  return (
    <div className={containerClass}>
      {header}
      {showSubscriptionBanner && profile && (
        <SubscriptionBanner profile={profile} onUpgrade={handleUpgrade} />
      )}
      {showSidebar ? (
        <div className={contentWrapperClass}>
          {sidebarContent}
          <main className={mainClass}>{children}</main>
        </div>
      ) : (
        <main className={mainClass}>{children}</main>
      )}
      <ToastContainer />
    </div>
  );
}

// ...rest of the file unchanged...
```

Uzasadnienie:
Minimalna modyfikacja - tylko additive props. Conditional rendering sidebar. Backward compatible - jeśli `showSidebar={false}` lub undefined, działa jak poprzednio.

Acceptance criteria:
- [ ] Props showSidebar i sidebarContent działają
- [ ] Layout z sidebar używa flex
- [ ] Layout bez sidebar działa jak poprzednio
- [ ] Backward compatibility zachowana

#### Krok 7: Modyfikacja DashboardPageWrapper

Cel: Integracja DashboardSidebar z DashboardPageWrapper

Pliki do modyfikacji:
- `src/components/dashboard/DashboardPageWrapper.tsx`

Opis implementacji:
Użycie useSidebarState hook, utworzenie DashboardSidebar instance, przekazanie do AppLayout przez props.

Kod do modyfikacji:

```typescript
/**
 * Dashboard Page Wrapper
 * Wraps DashboardView with AppLayout, Header, Sidebar and all necessary providers
 */

import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { AvatarMenu } from "@/components/layout/AvatarMenu";
import { MobileSidebarToggle } from "@/components/layout/MobileSidebarToggle";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardView } from "./DashboardView";
import { useSidebarState } from "@/hooks/useSidebarState";
import { getDefaultDashboardNavigation } from "@/lib/navigation";

export function DashboardPageWrapper() {
  const { isCollapsed, isMobile, toggle } = useSidebarState();

  const navigationItems = getDefaultDashboardNavigation();

  // Get current path for active state
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  const sidebar = (
    <DashboardSidebar
      items={navigationItems}
      currentPath={currentPath}
      isCollapsed={isCollapsed}
      isMobile={isMobile}
      onClose={toggle}
    />
  );

  return (
    <AppLayout
      header={
        <Header
          leftContent={
            isMobile && <MobileSidebarToggle isOpen={!isCollapsed} onToggle={toggle} />
          }
          avatarMenu={<AvatarMenu />}
        />
      }
      showSubscriptionBanner={true}
      showSidebar={true}
      sidebarContent={sidebar}
    >
      <DashboardView />
    </AppLayout>
  );
}
```

Uzasadnienie:
DashboardPageWrapper orchestruje sidebar + layout. useSidebarState hook zarządza stanem. Navigation items z config function.

Acceptance criteria:
- [ ] Sidebar renderuje się w dashboard
- [ ] Mobile toggle button działa
- [ ] Stan sidebar jest persystowany
- [ ] Active route highlighting działa

#### Krok 8: Modyfikacja Header dla mobile toggle

Cel: Dodanie możliwości renderowania hamburger button w Header

Pliki do modyfikacji:
- `src/components/layout/Header.tsx`

Opis implementacji:
Dodanie optional prop `leftContent` do Header, który będzie renderowany po lewej stronie (hamburger button na mobile).

Kod do modyfikacji:

```typescript
/**
 * Main application header component
 * Used in authenticated views (Dashboard, etc.)
 */

import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  avatarMenu?: ReactNode;
  leftContent?: ReactNode; // NOWY PROP
}

export function Header({ avatarMenu, leftContent }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo + Left Content */}
        <div className="flex items-center gap-4">
          {leftContent}
          <a href="/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">⚡</span>
            <span className="hidden font-bold sm:inline-block">Core</span>
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {avatarMenu}
        </div>
      </div>
    </header>
  );
}
```

Uzasadnienie:
Minimalna modyfikacja - tylko additive prop. leftContent może być hamburger button lub cokolwiek innego. Backward compatible.

Acceptance criteria:
- [ ] leftContent renderuje się przed logo
- [ ] Backward compatibility zachowana
- [ ] Gap między leftContent a logo jest odpowiedni

### 6.3. Faza 3: Typy i interfejsy

Już zaimplementowane w Faza 2, Krok 1 (src/types/navigation.ts)

### 6.4. Faza 4: Migracje bazy danych (jeśli wymagane)

N/A - brak zmian w bazie danych

### 6.5. Faza 5: Integracje

N/A - integracje już wykonane w Faza 2

### 6.6. Faza 6: Utworzenie strony 404

Plik do stworzenia:
- `src/pages/coming-soon.astro` (lub 404.astro)

Opis:
Prosta strona informująca że sekcja jest w przygotowaniu. Z linkiem powrotnym do dashboard.

Kod do utworzenia:

```astro
---
/**
 * Coming Soon Page
 * Placeholder page for features in development
 */
import Layout from "@/layouts/Layout.astro";
---

<Layout title="Coming Soon - Core Starter">
  <div class="flex min-h-screen items-center justify-center bg-background px-4">
    <div class="text-center">
      <div class="mb-6 text-6xl">🚧</div>
      <h1 class="mb-4 text-4xl font-bold">Coming Soon</h1>
      <p class="mb-8 text-lg text-muted-foreground">
        This section is currently under development.<br />
        Check back soon for updates!
      </p>
      <a
        href="/dashboard"
        class="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Back to Dashboard
      </a>
    </div>
  </div>
</Layout>
```

### 6.7. Faza 7: Stylizacja i UI polish

- [ ] Responsive design (mobile, tablet, desktop) - już zaimplementowane w components
- [ ] Dark mode support - Tailwind dark: classes już użyte
- [ ] Loading states - nie wymagane dla sidebar
- [ ] Error states - nie wymagane
- [ ] Animations - transition classes już dodane (transition-transform duration-300)
- [ ] Icons - lucide-react już używane

Dodatkowe polish:
- [ ] Smooth scroll behavior przy nawigacji
- [ ] Focus visible styles dla keyboard navigation
- [ ] Hover states dla wszystkich interactive elements

### 6.8. Faza 8: Testy

#### Unit tests:

Plik: `src/hooks/useSidebarState.test.ts`

```typescript
import { renderHook, act } from "@testing-library/react";
import { useSidebarState } from "./useSidebarState";

describe("useSidebarState", () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
  });

  it("should initialize with default collapsed state", () => {
    const { result } = renderHook(() => useSidebarState(false));
    expect(result.current.isCollapsed).toBe(false);
  });

  it("should toggle collapsed state", () => {
    const { result } = renderHook(() => useSidebarState(false));

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isCollapsed).toBe(true);
  });

  it("should persist state to localStorage", () => {
    const { result } = renderHook(() => useSidebarState(false));

    act(() => {
      result.current.toggle();
    });

    expect(localStorage.getItem("sidebar-collapsed")).toBe("true");
  });

  it("should detect mobile viewport", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 768,
    });

    const { result } = renderHook(() => useSidebarState());
    expect(result.current.isMobile).toBe(true);
  });

  it("should load state from localStorage on mount", () => {
    localStorage.setItem("sidebar-collapsed", "true");

    const { result } = renderHook(() => useSidebarState(false));
    expect(result.current.isCollapsed).toBe(true);
  });
});
```

Plik: `src/components/layout/DashboardSidebar.test.tsx`

```typescript
import { render, screen } from "@testing-library/react";
import { DashboardSidebar } from "./DashboardSidebar";
import type { NavigationItem } from "@/types/navigation";

const mockItems: NavigationItem[] = [
  { id: "1", label: "Dashboard", href: "/dashboard" },
  { id: "2", label: "Settings", href: "/settings" },
];

describe("DashboardSidebar", () => {
  it("should render all navigation items", () => {
    render(<DashboardSidebar items={mockItems} />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("should highlight active route", () => {
    render(<DashboardSidebar items={mockItems} currentPath="/dashboard" />);

    const activeLink = screen.getByRole("link", { name: /dashboard/i });
    expect(activeLink).toHaveAttribute("aria-current", "page");
  });

  it("should render with correct ARIA attributes", () => {
    render(<DashboardSidebar items={mockItems} />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveAttribute("aria-label", "Dashboard navigation");
  });

  it("should call onClose when mobile link is clicked", () => {
    const onClose = vi.fn();
    render(
      <DashboardSidebar
        items={mockItems}
        isMobile={true}
        isCollapsed={false}
        onClose={onClose}
      />
    );

    const link = screen.getByText("Dashboard");
    link.click();

    expect(onClose).toHaveBeenCalled();
  });

  it("should show backdrop on mobile when not collapsed", () => {
    const { container } = render(
      <DashboardSidebar items={mockItems} isMobile={true} isCollapsed={false} />
    );

    const backdrop = container.querySelector(".bg-black\\/50");
    expect(backdrop).toBeInTheDocument();
  });
});
```

Scope testów jednostkowych:
- [ ] useSidebarState - toggle, persistence, mobile detection
- [ ] DashboardSidebar - rendering, active state, accessibility
- [ ] MobileSidebarToggle - rendering, toggle action
- [ ] navigation.ts - isActiveRoute logic

#### Integration tests:

Plik: `src/components/dashboard/DashboardPageWrapper.integration.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { DashboardPageWrapper } from "./DashboardPageWrapper";

describe("DashboardPageWrapper Integration", () => {
  it("should render sidebar with navigation items", () => {
    render(<DashboardPageWrapper />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("should toggle sidebar on mobile", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 768,
    });

    render(<DashboardPageWrapper />);

    const toggleButton = screen.getByLabelText(/open sidebar/i);
    fireEvent.click(toggleButton);

    // Sidebar should be visible
    expect(screen.getByRole("navigation")).toBeVisible();
  });

  it("should persist sidebar state across re-renders", () => {
    const { rerender } = render(<DashboardPageWrapper />);

    const nav = screen.getByRole("navigation");
    // Toggle via localStorage
    localStorage.setItem("sidebar-collapsed", "true");

    rerender(<DashboardPageWrapper />);

    // State should be persisted
    expect(localStorage.getItem("sidebar-collapsed")).toBe("true");
  });
});
```

Scope testów integracyjnych:
- [ ] DashboardPageWrapper z sidebar integration
- [ ] AppLayout z sidebar rendering
- [ ] Mobile toggle interaction
- [ ] State persistence

#### E2E tests:

Plik: `e2e/dashboard-sidebar.spec.ts`

```typescript
/**
 * E2E Tests: Dashboard Sidebar Navigation
 */

import { test, expect } from "@playwright/test";

test.describe("Dashboard Sidebar Navigation", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[name="email"]', "user@example.com");
    await page.fill('input[name="password"]', "ValidPassword123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should display sidebar on desktop", async ({ page }) => {
    // Desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });

    const sidebar = page.getByRole("navigation", {
      name: "Dashboard navigation",
    });
    await expect(sidebar).toBeVisible();

    // Should have navigation items
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Coming Soon" }),
    ).toBeVisible();
  });

  test("should navigate to dashboard from sidebar link", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Click Dashboard link
    await page.click('a:has-text("Dashboard")');

    // Should stay on dashboard
    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("should navigate to coming soon page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Click Coming Soon link
    await page.click('a:has-text("Coming Soon")');

    // Should navigate to coming-soon
    await expect(page).toHaveURL(/\/coming-soon/);

    // Should show coming soon message
    await expect(page.locator("text=/coming soon/i")).toBeVisible();

    // Should have back link
    const backLink = page.locator('a:has-text("Back to Dashboard")');
    await expect(backLink).toBeVisible();

    // Navigate back
    await backLink.click();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test("should highlight active navigation item", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const dashboardLink = page.locator('a:has-text("Dashboard")');

    // Should have aria-current="page"
    await expect(dashboardLink).toHaveAttribute("aria-current", "page");

    // Should have active styling (primary background)
    await expect(dashboardLink).toHaveClass(/bg-primary/);
  });

  test.describe("Mobile Sidebar", () => {
    test("should toggle sidebar on mobile", async ({ page }) => {
      // Mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      const sidebar = page.getByRole("navigation", {
        name: "Dashboard navigation",
      });

      // Sidebar should be hidden initially
      await expect(sidebar).not.toBeVisible();

      // Find and click hamburger button
      const hamburger = page.getByLabel(/open sidebar/i);
      await expect(hamburger).toBeVisible();
      await hamburger.click();

      // Sidebar should be visible
      await expect(sidebar).toBeVisible();

      // Click outside (backdrop) to close
      await page.click(".bg-black\\/50");

      // Sidebar should be hidden
      await expect(sidebar).not.toBeVisible();
    });

    test("should close sidebar after navigation on mobile", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Open sidebar
      await page.click('[aria-label*="Open sidebar"]');

      const sidebar = page.getByRole("navigation");
      await expect(sidebar).toBeVisible();

      // Click navigation link
      await page.click('a:has-text("Coming Soon")');

      // Sidebar should close automatically
      await expect(sidebar).not.toBeVisible();
    });
  });

  test.describe("Keyboard Navigation", () => {
    test("should be keyboard accessible", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // Tab to first navigation link
      await page.keyboard.press("Tab");
      // Multiple tabs to reach sidebar (skip header elements)
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press("Tab");
      }

      // Dashboard link should be focused
      const dashboardLink = page.locator('a:has-text("Dashboard")');
      await expect(dashboardLink).toBeFocused();

      // Press Enter to navigate
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/dashboard$/);
    });
  });

  test.describe("Accessibility", () => {
    test("should have correct ARIA attributes", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      const sidebar = page.getByRole("navigation", {
        name: "Dashboard navigation",
      });
      await expect(sidebar).toHaveAttribute(
        "aria-label",
        "Dashboard navigation",
      );

      // Active link should have aria-current
      const activeLink = page.locator('[aria-current="page"]');
      await expect(activeLink).toBeVisible();
    });

    test("mobile toggle should have correct ARIA", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      const toggle = page.getByLabel(/open sidebar/i);
      await expect(toggle).toHaveAttribute("aria-expanded", "false");

      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    });
  });

  test.describe("Theme Support", () => {
    test("should work in dark mode", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // Switch to dark mode
      const themeToggle = page.getByRole("button", {
        name: /switch to dark mode/i,
      });

      if (await themeToggle.isVisible()) {
        await themeToggle.click();
        await page.waitForTimeout(100);
      }

      // Sidebar should be visible with dark theme
      const sidebar = page.getByRole("navigation");
      await expect(sidebar).toBeVisible();

      // HTML should have dark class
      const html = page.locator("html");
      await expect(html).toHaveClass(/dark/);
    });
  });
});
```

Scope testów E2E:
- [ ] Desktop sidebar visibility
- [ ] Navigation links działają
- [ ] Active state highlighting
- [ ] Mobile toggle functionality
- [ ] Keyboard navigation
- [ ] Accessibility (ARIA attributes)
- [ ] Dark mode support
- [ ] Sidebar auto-close na mobile po nawigacji

## 7. Plan weryfikacji i testowania

### 7.1. Unit tests checklist

- [ ] Wszystkie funkcje/metody mają testy (useSidebarState, isActiveRoute, getDefaultDashboardNavigation)
- [ ] Edge cases są pokryte (viewport resize, localStorage failure, empty navigation items)
- [ ] Error handling jest przetestowany (localStorage errors, invalid paths)
- [ ] Code coverage > 80% dla nowego kodu

### 7.2. Integration tests checklist

- [ ] Integracja DashboardPageWrapper + Sidebar jest przetestowana
- [ ] AppLayout z sidebar działa poprawnie
- [ ] State management (useSidebarState) działa z komponentes
- [ ] Mobile toggle integration działa

### 7.3. E2E tests checklist

- [ ] Happy path jest przetestowany (user navigates via sidebar)
- [ ] Alternative flows są przetestowane (mobile toggle, keyboard navigation)
- [ ] Error scenarios są przetestowane (404 page)
- [ ] Responsive behavior jest przetestowany (desktop, tablet, mobile)

### 7.4. Manual testing checklist

- [ ] Funkcjonalność działa zgodnie z acceptance criteria
- [ ] Wszystkie edge cases są obsługiwane (długie nazwy, wiele items, narrow viewport)
- [ ] UI jest responsywne (test na różnych rozmiarach ekranu)
- [ ] Testowanie w różnych przeglądarkach:
  - [ ] Chrome (desktop, mobile)
  - [ ] Firefox
  - [ ] Safari (desktop, iOS)
  - [ ] Edge
- [ ] Testowanie na różnych rozmiarach ekranu:
  - [ ] Mobile (375px, 414px)
  - [ ] Tablet (768px, 1024px)
  - [ ] Desktop (1280px, 1920px)
- [ ] Testowanie z różną rolą użytkownika: wszyscy zalogowani użytkownicy (brak role-based restrictions)
- [ ] Testowanie dostępności:
  - [ ] ARIA attributes correct
  - [ ] Keyboard navigation (Tab, Enter, Escape)
  - [ ] Focus management
  - [ ] Screen reader testing (VoiceOver, NVDA)
- [ ] Testowanie performance:
  - [ ] Loading time < 100ms dla sidebar render
  - [ ] Smooth animations (60fps)
  - [ ] Brak layout shift przy render

### 7.5. Regression testing

- [ ] Dashboard główny widok - nie powinien być dotknięty (DashboardView działa jak poprzednio)
- [ ] Header - sprawdzić czy logo i user menu działają poprawnie
- [ ] Theme toggle - sprawdzić czy dark mode nadal działa
- [ ] Authentication - sprawdzić czy protected routes działają
- [ ] Subscription banner - sprawdzić czy renderuje się poprawnie
- [ ] Inne strony (landing, checkout) - nie powinny być dotknięte

## 8. Analiza ryzyka i mitigation

### 8.1. Zidentyfikowane ryzyka

#### Ryzyko 1: Layout breaking na różnych viewport sizes

- Severity: MEDIUM
- Prawdopodobieństwo: MEDIUM
- Wpływ: Sidebar może być zbyt szeroki na małych ekranach, overflow issues, content squeezed
- Mitigation:
  - Responsive design od początku (Tailwind breakpoints)
  - Testing na różnych viewport sizes
  - Fallback widths dla edge cases
- Contingency plan:
  - Zmniejszenie width sidebar (256px → 224px)
  - Collapsible sidebar domyślnie na tablet
  - Icon-only mode dla narrow screens

#### Ryzyko 2: Performance impact - dodatkowy component w render tree

- Severity: LOW
- Prawdopodobieństwo: LOW
- Wpływ: Potencjalnie wolniejszy render dashboard, szczególnie na mobile
- Mitigation:
  - React.memo dla DashboardSidebar jeśli needed
  - Minimalna logika w render
  - Brak heavy computations
  - Monitoring performance metrics
- Contingency plan:
  - Lazy loading sidebar na mobile
  - Code splitting jeśli bundle size wzrośnie znacząco
  - Virtualization jeśli lista navigation items będzie bardzo długa (> 50)

#### Ryzyko 3: Accessibility issues - focus management na mobile

- Severity: MEDIUM
- Prawdopodobieństwo: MEDIUM
- Wpływ: Użytkownicy keyboard/screen reader mogą mieć problem z nawigacją, focus trapped
- Mitigation:
  - ARIA attributes od początku
  - Focus trap management w overlay mode
  - Escape key closes sidebar
  - Testing z screen readers
- Contingency plan:
  - Focus trap library (focus-trap-react) jeśli własna implementacja nie działa
  - Dodatkowe ARIA live regions dla status announcements
  - Skip links dla keyboard users

#### Ryzyko 4: State persistence conflicts - localStorage quota exceeded

- Severity: LOW
- Prawdopodobieństwo: LOW
- Wpływ: Sidebar state nie persystuje, user musi toggle każdorazowo
- Mitigation:
  - Try/catch na localStorage operations
  - Fallback do default state jeśli localStorage fails
  - Minimal data stored (tylko boolean)
- Contingency plan:
  - Session storage jako fallback
  - In-memory state bez persistence
  - User preference w database (future enhancement)

### 8.2. Technical debt i trade-offs

Trade-off 1: Sidebar controlled przez props vs global state
- Decyzja: Props-based control (showSidebar, sidebarContent)
- Uzasadnienie: Prostsza implementacja, brak dependencies na state management library, łatwe do usunięcia
- Technical debt: Jeśli w przyszłości sidebar będzie potrzebny w wielu miejscach, może być repetitive code
- Mitigation: Abstrakcja do reusable hook/context jeśli needed w przyszłości

Trade-off 2: Active route detection - client-side pathname check vs server-side
- Decyzja: Client-side window.location.pathname
- Uzasadnienie: Prostsze, nie wymaga server-side logic, działa z Astro routing
- Technical debt: Może nie działać z complex routing (nested routes, query params)
- Mitigation: Rozbudowa isActiveRoute function jeśli needed

Trade-off 3: Mobile sidebar - drawer overlay vs inline collapse
- Decyzja: Drawer overlay (fixed position, backdrop)
- Uzasadnienie: Standard UX pattern, nie przesuwa content, smooth UX
- Technical debt: Więcej CSS, więcej state management
- Mitigation: CSS jest minimal, state jest encapsulated w hook

### 8.3. Rollback plan

Szczegółowy plan jak wycofać feature w razie problemu:

1. Natychmiastowy rollback (production issue):
   - W `DashboardPageWrapper.tsx`: zmienić `showSidebar={true}` na `showSidebar={false}`
   - Deploy tylko ten plik
   - Sidebar znika, dashboard działa jak przed feature

2. Pełny rollback (usunięcie kodu):
   - Revert commit z feature branch
   - Usunąć nowe pliki:
     - `src/components/layout/DashboardSidebar.tsx`
     - `src/components/layout/MobileSidebarToggle.tsx`
     - `src/hooks/useSidebarState.ts`
     - `src/lib/navigation.ts`
     - `src/types/navigation.ts`
     - `src/pages/coming-soon.astro`
   - Przywrócić poprzednie wersje:
     - `src/components/layout/AppLayout.tsx`
     - `src/components/dashboard/DashboardPageWrapper.tsx`
     - `src/components/layout/Header.tsx`
   - Deploy
   - Clear localStorage dla users: komunikat lub migration script

3. Partial rollback (wyłączenie na mobile):
   - W `useSidebarState`: return `{ isCollapsed: true, isMobile: true, ... }` dla mobile
   - Sidebar disabled tylko na mobile, desktop działa
   - Mniej invasive rollback

4. Data cleanup:
   - localStorage key "sidebar-collapsed" może zostać - nie szkodzi
   - Lub: dodać cleanup script który usuwa przy następnym load

### 8.4. Monitoring i observability

Co monitorować po wdrożeniu feature:

Metryki adoption:
- Liczba users którzy toggle sidebar (localStorage analytics)
- Preferred state (collapsed vs expanded) - ratio
- Mobile vs desktop usage breakdown

Metryki performance:
- Dashboard page load time (before vs after)
- Sidebar render time
- Time to Interactive (TTI)
- First Contentful Paint (FCP)
- Bundle size increase

User engagement:
- Click-through rate na navigation links
- Time spent on dashboard vs other sections
- Bounce rate z coming-soon page
- Navigation patterns (które linki najczęściej używane)

Error metrics:
- JavaScript errors related to sidebar
- localStorage quota exceeded errors
- Routing errors (404 not found)
- Console warnings/errors

Logi do monitorowania:
- Sidebar toggle events (frequency, timestamp)
- Navigation clicks (which items, timestamp)
- Mobile vs desktop breakdowns
- Failed localStorage operations

Alerty do skonfigurowania:
- JavaScript error rate > 1% for sidebar-related errors
- Dashboard load time > 3s (regression)
- 404 error rate spike (broken navigation links)
- localStorage errors > 0.5%

Narzędzia:
- Google Analytics / Plausible: user behavior, navigation patterns
- Sentry / Error tracking: JavaScript errors
- Lighthouse CI: performance regression detection
- Custom analytics event: sidebar interactions

## 9. Zgodność ze standardami

### 9.1. Copilot-instructions.md compliance

React patterns: ✅
- Functional components with hooks (useSidebarState)
- React.memo będzie używane jeśli performance issue
- Props-based composition
- TypeScript types dla wszystkich props

Astro patterns: ✅
- Layout.astro używany dla 404 page
- Client-side hydration tylko gdzie potrzebne (client:load)
- Minimal JavaScript footprint

Accessibility (ARIA, WCAG): ✅
- ARIA labels (aria-label="Dashboard navigation")
- ARIA roles (role="navigation", role="list")
- ARIA states (aria-current="page", aria-expanded)
- Keyboard navigation (Tab, Enter, Escape)
- Focus management
- Screen reader support

TypeScript best practices: ✅
- Wszystkie komponenty mają interfaces
- Strict types (no any)
- Export types separately (src/types/navigation.ts)

Testing patterns: ✅
- Unit tests dla hooks i utilities
- Integration tests dla component interactions
- E2E tests dla user journeys
- Playwright dla E2E (zgodnie z projektem)

Styling (Tailwind): ✅
- Tailwind utility classes
- Dark mode support (dark: prefix)
- Responsive breakpoints (sm:, md:, lg:)
- No custom CSS (wszystko Tailwind)

### 9.2. Tech-stack.md compliance

Framework/library compatibility: ✅
- Astro 5.x ✅
- React 19.x ✅
- TypeScript 5.x ✅
- Tailwind CSS 4.x ✅

New dependencies justified: ✅
- Brak nowych dependencies
- Używa istniejących: lucide-react (już zainstalowane)

Build tools compatibility: ✅
- Vite (Astro default) ✅
- TypeScript compiler ✅
- Playwright dla E2E ✅

### 9.3. Security checklist

- [x] Input validation - brak user inputs w sidebar (tylko static navigation)
- [x] Authorization - sidebar widoczny tylko dla authenticated users (w ramach /dashboard protected route)
- [x] Authentication - weryfikacja przez AuthContext (istniejący mechanism)
- [x] XSS protection - React automatyczny escaping, brak dangerouslySetInnerHTML
- [x] CSRF protection - N/A (brak form submissions)
- [x] SQL injection protection - N/A (brak database queries)
- [x] Secrets management - brak secrets w sidebar code
- [x] Rate limiting - N/A (client-side component)
- [x] Data privacy - brak personal data w sidebar (tylko navigation labels)
- [x] Secure communication - N/A (client-side, HTTPS handled by hosting)

### 9.4. Performance checklist

- [ ] Bundle size impact - sprawdzić przed/po (target: < 10KB increase)
- [ ] Code splitting - sidebar w main dashboard bundle (nie lazy loaded) - OK dla small component
- [ ] Rendering optimization:
  - [ ] React.memo dla DashboardSidebar jeśli re-renders są częste
  - [ ] useMemo dla navigationItems jeśli expensive computation (obecnie nie)
  - [ ] useCallback dla event handlers jeśli needed
- [ ] Loading states - nie wymagane (sidebar renderuje się synchronicznie)
- [ ] Error boundaries - AppLayout już ma error handling, sidebar covered
- [ ] Caching strategy - N/A (static navigation, no API calls)
- [ ] Image optimization - brak images w sidebar (tylko icons)
- [ ] Database query optimization - N/A

### 9.5. Accessibility checklist (dla UI features)

- [ ] ARIA attributes - poprawne dla navigation, list, links (już w kodzie)
- [ ] Keyboard navigation - Tab, Enter, Escape (już zaimplementowane)
- [ ] Focus management:
  - [ ] Focus trap w mobile overlay
  - [ ] Focus visible styles (Tailwind focus:ring)
  - [ ] Skip link do main content (future enhancement)
- [ ] Semantic HTML - `<nav>`, `<ul>`, `<li>`, `<a>` (semantyczne elementy)
- [ ] Color contrast:
  - [ ] Test kontrastu text vs background (Tailwind defaults powinny być OK)
  - [ ] Dark mode contrast również
  - [ ] Minimum 4.5:1 dla normalnego tekstu
- [ ] Screen reader testing:
  - [ ] NVDA (Windows)
  - [ ] VoiceOver (macOS, iOS)
  - [ ] TalkBack (Android)
- [ ] Alternative text - ikony mają aria-hidden="true" + text labels
- [ ] Form labels - N/A (brak formów w sidebar)
- [ ] Error messages - N/A

### 9.6. SEO checklist (jeśli dotyczy)

N/A - Dashboard jest authenticated area, nie indexed przez search engines

## 10. Dokumentacja

### 10.1. Changelog entry

```markdown
### Added

- Dashboard Sidebar Navigation - lewa nawigacja boczna w obszarze dashboard z linkami do sekcji aplikacji
- Sidebar responsywny - collapse na mobile z hamburger menu
- Dark mode support dla sidebar
- Keyboard navigation w sidebar
- Strona "Coming Soon" jako placeholder dla przyszłych sekcji
```

### 10.2. README update (jeśli wymagane)

Sekcja do dodania w README.md (po sekcji Features):

```markdown
#### Dashboard Navigation

The dashboard includes a collapsible sidebar navigation:

- **Desktop**: Always visible on the left side
- **Mobile**: Hidden by default, accessible via hamburger menu
- **Customization**: Easy to enable/disable via `showSidebar` prop in `DashboardPageWrapper`
- **Adding sections**: Edit `src/lib/navigation.ts` to add new navigation items

To disable sidebar completely:
```typescript
// In src/components/dashboard/DashboardPageWrapper.tsx
<AppLayout
  showSidebar={false} // Set to false to hide sidebar
  // ...
>
```
```

### 10.3. Dokumentacja techniczna

Dokumentacja dla developerów (może być w README lub osobny doc):

```markdown
## Dashboard Sidebar Architecture

### Components

#### DashboardSidebar
Main sidebar navigation component.

Props:
- `items: NavigationItem[]` - Array of navigation items to render
- `currentPath?: string` - Current URL path for active state highlighting
- `isCollapsed?: boolean` - Whether sidebar is collapsed (mobile)
- `isMobile?: boolean` - Whether viewport is mobile size
- `onNavigate?: (item: NavigationItem) => void` - Callback on navigation
- `onClose?: () => void` - Callback to close sidebar (mobile)

#### MobileSidebarToggle
Hamburger menu button for mobile devices.

Props:
- `isOpen: boolean` - Whether sidebar is open
- `onToggle: () => void` - Toggle callback

### Hooks

#### useSidebarState
Manages sidebar collapsed state with localStorage persistence and mobile detection.

Returns:
- `isCollapsed: boolean` - Current collapsed state
- `isMobile: boolean` - Whether viewport is mobile (<1024px)
- `toggle: () => void` - Toggle collapsed state
- `setIsCollapsed: (value: boolean) => void` - Set collapsed state directly

### Configuration

#### Navigation Items
Defined in `src/lib/navigation.ts`:

```typescript
export function getDefaultDashboardNavigation(): NavigationItem[] {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/dashboard",
      icon: Home, // Optional
    },
    // Add more items here
  ];
}
```

### Adding New Sections

1. Create new page/route (e.g., `src/pages/analytics.astro`)
2. Add navigation item to `src/lib/navigation.ts`:
```typescript
{
  id: "analytics",
  label: "Analytics",
  href: "/analytics",
  icon: BarChart, // from lucide-react
}
```
3. Navigation automatically updates

### Customization

#### Disabling Sidebar
```typescript
// DashboardPageWrapper.tsx
<AppLayout showSidebar={false}>
```

#### Changing Width
Edit `DashboardSidebar.tsx`:
```typescript
const sidebarClasses = isMobile
  ? "... w-64" // Change width here
  : "... w-64"; // And here
```

#### Custom Breakpoint
Edit `useSidebarState.ts`:
```typescript
const MOBILE_BREAKPOINT = 1024; // Change this value
```

### Architecture Decisions

1. **Props-based control** - Sidebar enabled via props, not global state. Easy to enable/disable per page.
2. **localStorage persistence** - User preference saved locally, survives page reloads.
3. **Responsive by default** - Mobile overlay, desktop static. No media queries in logic.
4. **Accessibility first** - ARIA attributes, keyboard navigation, screen reader support built-in.
```

### 10.4. User documentation (jeśli wymagane)

Dokumentacja dla użytkowników końcowych (może być w help center):

```markdown
## Dashboard Navigation

### Desktop

The dashboard includes a navigation menu on the left side:
- Click any section name to navigate
- The current section is highlighted

### Mobile

On mobile devices:
1. Tap the ☰ menu icon in the header
2. Tap a section to navigate
3. The menu closes automatically after selection
4. Or tap outside the menu to close it

### Keyboard Navigation

You can navigate using your keyboard:
- Press `Tab` to move between sections
- Press `Enter` or `Space` to select
- Press `Esc` to close the menu (mobile)
```

### 10.5. Release notes

Informacja dla użytkowników końcowych:

```markdown
## What's New

### Dashboard Sidebar Navigation

We've added a new navigation menu to help you move between sections more easily:

- **Quick Access** - All sections in one place on the left side
- **Mobile Friendly** - Swipe-friendly menu on phones and tablets
- **Remembers Your Preference** - The menu stays open/closed as you like it

Look for the menu on the left side of your dashboard (or tap the ☰ icon on mobile).
```

## 11. Timeline i effort estimation

### 11.1. Estymacja czasu

Breakdown szczegółowy:

- Analiza i design: 1 godzina (już wykonane w tym planie)
- Implementacja core:
  - Typy i interfaces: 30 min
  - Navigation config: 30 min
  - useSidebarState hook: 1h
  - DashboardSidebar component: 2h
  - MobileSidebarToggle: 30 min
  - AppLayout modification: 1h
  - DashboardPageWrapper integration: 1h
  - Header modification: 30 min
  - Coming Soon page: 30 min
  Subtotal: 7.5 godzin
- Testy (unit + integration): 2 godziny
- E2E testy: 2 godziny
- Code review: 1 godzina
- Bug fixes post-review: 1-2 godziny
- Documentation: 1 godzina
- Deployment: 30 min
- Monitoring post-deployment: 1 dzień (passive monitoring)

Łącznie: ~16 godzin (2 dni robocze) + 1 dzień monitoring

### 11.2. Zależności i blokery

Blokujące start:
- Dostęp do repozytorium ✅
- Dev environment setup ✅
- Brak blocking dependencies

Blokowane przez ten feature:
- Przyszłe sekcje dashboard (Settings, Profile, Analytics) będą łatwiejsze do dodania
- Mobile UX improvements mogą wykorzystać ten sidebar pattern

External dependencies:
- Brak - wszystkie dependencies już zainstalowane
- Design assets - nie wymagane (używamy lucide icons)

### 11.3. Sugerowany timeline

- Analysis & Planning complete: 2026-02-22 (dzisiaj) ✅
- Development start: 2026-02-23 (jutro)
- Core implementation complete: 2026-02-24 (koniec dnia 2)
- Tests complete: 2026-02-25 (połowa dnia)
- Code review: 2026-02-25 (koniec dnia)
- Fixes & polish: 2026-02-26 (rano)
- Deployment to staging: 2026-02-26 (południe)
- QA/UAT on staging: 2026-02-26-27 (1-2 dni testing)
- Deployment to production: 2026-02-28 (piątek)
- Post-launch monitoring: 2026-02-28 - 2026-03-07 (1 tydzień)

Total timeline: 6 dni roboczych (1 tydzień + weekend)

### 11.4. Milestones

Kluczowe punkty kontrolne:

- [ ] Milestone 1: Core components implemented - 2026-02-24
  - Wszystkie komponenty utworzone
  - Basic functionality działa
  - No blockers
  
- [ ] Milestone 2: Tests passing - 2026-02-25
  - Unit tests pass
  - Integration tests pass
  - E2E tests pass
  - Code coverage > 80%
  
- [ ] Milestone 3: Code review approved - 2026-02-25
  - Review completed
  - Feedback addressed
  - Ready for staging
  
- [ ] Milestone 4: Staging deployment successful - 2026-02-26
  - Deployed to staging
  - No deployment errors
  - Manual QA can begin
  
- [ ] Milestone 5: Production deployment - 2026-02-28
  - Deployed to production
  - Monitoring active
  - Feature flag enabled (if used)

## 12. Załączniki

### 12.1. Pliki do utworzenia (lista pełna)

```
src/types/navigation.ts
src/lib/navigation.ts
src/hooks/useSidebarState.ts
src/components/layout/DashboardSidebar.tsx
src/components/layout/MobileSidebarToggle.tsx
src/pages/coming-soon.astro
src/hooks/useSidebarState.test.ts
src/components/layout/DashboardSidebar.test.tsx
src/components/layout/MobileSidebarToggle.test.tsx
src/lib/navigation.test.ts
src/components/dashboard/DashboardPageWrapper.integration.test.tsx
e2e/dashboard-sidebar.spec.ts
```

### 12.2. Pliki do modyfikacji (lista pełna)

```
src/components/layout/AppLayout.tsx (dodanie showSidebar props i layout logic)
src/components/dashboard/DashboardPageWrapper.tsx (integracja sidebar)
src/components/layout/Header.tsx (dodanie leftContent prop dla mobile toggle)
```

### 12.3. Referencje

Powiązane resources:

- Related test file: `e2e/theme.spec.ts` - przykład E2E testów w projekcie
- Related test file: `e2e/dashboard.spec.ts` - istniejące testy dashboard do rozbudowy
- Tailwind CSS documentation: https://tailwindcss.com/docs
- WCAG 2.1 Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- ARIA Authoring Practices: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
- React Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Playwright docs: https://playwright.dev/

Inspiracja z podobnych projektów:
- Vercel Dashboard: https://vercel.com/dashboard (sidebar pattern)
- Linear App: https://linear.app (clean sidebar navigation)
- GitHub: https://github.com (responsive sidebar)

### 12.4. Mockupy/Wireframes

Brak formal mockups - prosta implementacja based on standard patterns.

Tekstowy wireframe:

Desktop (>= 1024px):
```
+------------------+------------------------------------------+
| Header                                                      |
+------------------+------------------------------------------+
| Sidebar          | Main Content                            |
| - Dashboard      |                                         |
| - Coming Soon    | [DashboardView]                         |
|                  |                                         |
|                  |                                         |
|                  |                                         |
+------------------+------------------------------------------+
```

Mobile (< 1024px):
```
+----------------------------------------------------------+
| ☰  Header                                          👤    |
+----------------------------------------------------------+
|                                                          |
| Main Content                                             |
|                                                          |
| [DashboardView]                                          |
|                                                          |
+----------------------------------------------------------+

Sidebar overlay (when open):
+----------------------------------------------------------+
| [Backdrop - dark overlay]                                |
|  +-------------------+                                   |
|  | Sidebar           |                                   |
|  | - Dashboard       |                                   |
|  | - Coming Soon     |                                   |
|  +-------------------+                                   |
+----------------------------------------------------------+
```

### 12.5. API Documentation (jeśli nowe API)

N/A - brak nowych API endpoints (frontendowa funkcjonalność)

---

## PODSUMOWANIE WYKONAWCZE

Feature: Dashboard Sidebar Navigation
Status: Zaplanowane, gotowe do implementacji
Priorytet: MEDIUM
Effort: S (2 dni, ~16 godzin)
Złożoność: LOW
Impact: LOW
Timeline: 6 dni roboczych (dev + testing + deployment)

Kluczowe korzyści:
- Lepsza nawigacja w dashboard
- Przygotowanie na przyszłe sekcje
- Łatwe włączenie/wyłączenie (modular design)
- Responsive i accessible

Next steps:
1. Utworzyć branch `feature/dashboard-sidebar-navigation`
2. Rozpocząć implementację zgodnie z Faza 2
3. Follow plan step by step

Risk level: LOW - minimalne zmiany w istniejącym kodzie, łatwy rollback, standardowy pattern.

