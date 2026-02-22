/**
 * Theme Context for managing light/dark mode
 * Provides theme state, persistence, and system preference detection
 */

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

/**
 * Get system color scheme preference
 */
function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";

  try {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    return mediaQuery && mediaQuery.matches ? "dark" : "light";
  } catch {
    // matchMedia might not be available in test environment
    return "light";
  }
}

/**
 * Get stored theme from localStorage
 */
function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // localStorage might be blocked (e.g., private browsing)
  }
  return null;
}

/**
 * Apply theme to document element
 */
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
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage might be blocked (e.g., private browsing)
    }
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

/**
 * Hook to access theme context
 * Must be used within ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
