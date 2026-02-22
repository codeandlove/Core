/**
 * Unit tests for ThemeContext
 */

import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeContext";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

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

  it("should toggle theme from light to dark", () => {
    // Set initial light mode
    localStorage.setItem("theme-preference", "light");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("dark");
  });

  it("should toggle theme from dark to light", () => {
    // Set initial dark mode
    localStorage.setItem("theme-preference", "dark");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe("light");
  });

  it("should set theme explicitly", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");

    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.theme).toBe("light");
  });

  it("should persist theme to localStorage", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(localStorage.getItem("theme-preference")).toBe("dark");

    act(() => {
      result.current.setTheme("light");
    });

    expect(localStorage.getItem("theme-preference")).toBe("light");
  });

  it("should apply dark class to document element", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("dark");
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);

    act(() => {
      result.current.setTheme("light");
    });

    expect(document.documentElement.classList.contains("dark")).toBe(false);
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

  it("should handle invalid localStorage value", () => {
    localStorage.setItem("theme-preference", "invalid-theme");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    // Should fallback to system preference
    expect(["light", "dark"]).toContain(result.current.theme);
  });
});
