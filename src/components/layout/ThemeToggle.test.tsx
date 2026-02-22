/**
 * Unit tests for ThemeToggle component
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ThemeToggle } from "./ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";

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

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("should render toggle button", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = await screen.findByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should show Moon icon in light mode", async () => {
    localStorage.setItem("theme-preference", "light");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = await screen.findByLabelText("Switch to dark mode");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("should show Sun icon in dark mode", async () => {
    localStorage.setItem("theme-preference", "dark");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = await screen.findByLabelText("Switch to light mode");
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("should toggle theme on click", async () => {
    localStorage.setItem("theme-preference", "light");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = await screen.findByRole("button");
    const initialLabel = button.getAttribute("aria-label");

    fireEvent.click(button);

    const newLabel = button.getAttribute("aria-label");
    expect(newLabel).not.toBe(initialLabel);
    expect(newLabel).toBe("Switch to light mode");
  });

  it("should be keyboard accessible", async () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = await screen.findByRole("button");
    button.focus();

    expect(button).toHaveFocus();
  });

  it("should have proper ARIA attributes", async () => {
    localStorage.setItem("theme-preference", "light");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = await screen.findByRole("button");

    expect(button).toHaveAttribute("aria-label");
    expect(button).toHaveAttribute("aria-pressed");
    expect(button).toHaveAttribute("type", "button");
  });

  it("should update aria-pressed when theme changes", async () => {
    localStorage.setItem("theme-preference", "light");

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = await screen.findByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(button);

    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
