/**
 * E2E tests for Dark Mode functionality
 */

import { test, expect } from "@playwright/test";

test.describe("Dark Mode", () => {
  test.beforeEach(async ({ context }) => {
    // Clear cookies and storage
    await context.clearCookies();
    // Use addInitScript to clear localStorage before page loads
    await context.addInitScript(() => {
      window.localStorage.clear();
    });
  });

  test("should toggle dark mode on dashboard", async ({ page }) => {
    // Navigate to dashboard (assuming user is logged in or we're testing with public access)
    await page.goto("/dashboard");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Find theme toggle button
    const toggleButton = page.getByRole("button", {
      name: /switch to (dark|light) mode/i,
    });
    await expect(toggleButton).toBeVisible();

    // Get initial theme state
    const htmlElement = page.locator("html");
    const initialHasDark = await htmlElement.evaluate((el) =>
      el.classList.contains("dark"),
    );

    // Click to toggle theme
    await toggleButton.click();

    // Wait a bit for class to be applied
    await page.waitForTimeout(100);

    // Verify dark class toggled
    const afterHasDark = await htmlElement.evaluate((el) =>
      el.classList.contains("dark"),
    );
    expect(afterHasDark).toBe(!initialHasDark);
  });

  test("should persist theme after page reload", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Switch to dark mode
    const toggleButton = page.getByRole("button", {
      name: /switch to dark mode/i,
    });

    if (await toggleButton.isVisible()) {
      await toggleButton.click();
      await page.waitForTimeout(100);
    } else {
      // Already in dark mode, switch to light first
      const lightToggle = page.getByRole("button", {
        name: /switch to light mode/i,
      });
      await lightToggle.click();
      await page.waitForTimeout(100);
      await lightToggle.click();
      await page.waitForTimeout(100);
    }

    // Verify dark mode is active
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Verify dark mode is still active (no flicker)
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test("should not flicker on first load with dark mode preference", async ({
    page,
  }) => {
    // Set dark mode in localStorage before navigation
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("theme-preference", "dark");
    });

    // Navigate to dashboard
    await page.goto("/dashboard");

    // Check immediately - dark class should be present (no flicker)
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test("should be keyboard accessible", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Find the toggle button
    const toggleButton = page.getByRole("button", {
      name: /switch to (dark|light) mode/i,
    });

    // Focus the button (simulate Tab navigation)
    await toggleButton.focus();

    // Verify button is focused
    await expect(toggleButton).toBeFocused();

    // Get initial theme
    const htmlElement = page.locator("html");
    const initialHasDark = await htmlElement.evaluate((el) =>
      el.classList.contains("dark"),
    );

    // Press Enter to toggle
    await page.keyboard.press("Enter");
    await page.waitForTimeout(100);

    // Verify theme toggled
    const afterHasDark = await htmlElement.evaluate((el) =>
      el.classList.contains("dark"),
    );
    expect(afterHasDark).toBe(!initialHasDark);
  });

  test("should work across different pages", async ({ page }) => {
    // Start on landing page
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Set dark mode
    await page.evaluate(() => {
      localStorage.setItem("theme-preference", "dark");
      document.documentElement.classList.add("dark");
    });

    // Navigate to dashboard
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Verify dark mode is maintained
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);

    // Navigate to checkout (if accessible)
    await page.goto("/checkout").catch(() => {
      // Checkout might require auth, that's ok
    });

    // If we got there, verify dark mode
    if (page.url().includes("/checkout")) {
      await expect(htmlElement).toHaveClass(/dark/);
    }
  });

  test("should handle system preference on first visit", async ({ page }) => {
    // Emulate dark mode preference in OS
    await page.emulateMedia({ colorScheme: "dark" });

    // Clear any stored preference
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());

    // Navigate fresh
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Should detect system preference and apply dark mode
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);
  });

  test("should respect manual preference over system preference", async ({
    page,
  }) => {
    // Emulate dark mode preference in OS
    await page.emulateMedia({ colorScheme: "dark" });

    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Should start with dark mode (system preference)
    const htmlElement = page.locator("html");
    await expect(htmlElement).toHaveClass(/dark/);

    // User manually switches to light
    const toggleButton = page.getByRole("button", {
      name: /switch to light mode/i,
    });
    await toggleButton.click();
    await page.waitForTimeout(100);

    // Should be in light mode now
    await expect(htmlElement).not.toHaveClass(/dark/);

    // Reload page
    await page.reload();
    await page.waitForLoadState("networkidle");

    // Should still be in light mode (manual preference persisted)
    await expect(htmlElement).not.toHaveClass(/dark/);
  });
});
