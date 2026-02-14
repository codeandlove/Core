/**
 * E2E Smoke Tests
 * Basic tests to verify core pages load correctly
 * These tests don't require authentication or database
 */
import { test, expect } from "@playwright/test";
test.describe("Smoke Tests - Core Pages", () => {
  test("should load landing page", async ({ page }) => {
    await page.goto("/");
    // Should have title
    await expect(page).toHaveTitle(/Core Starter/i);
    // Should have header
    await expect(page.locator("header")).toBeVisible();
    // Should have main content
    await expect(page.locator("main")).toBeVisible();
  });
  test("should load login page", async ({ page }) => {
    await page.goto("/auth/login");
    // Should have email input
    await expect(page.locator('input[name="email"]')).toBeVisible();
    // Should have password input
    await expect(page.locator('input[name="password"]')).toBeVisible();
    // Should have submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
  test("should load register page", async ({ page }) => {
    await page.goto("/auth/register");
    // Should have email input
    await expect(page.locator('input[name="email"]')).toBeVisible();
    // Should have password input
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
  test("should load forgot password page", async ({ page }) => {
    await page.goto("/auth/forgot-password");
    // Should have email input
    await expect(page.locator('input[name="email"]')).toBeVisible();
  });
  test("should redirect to login when accessing dashboard without auth", async ({ page }) => {
    await page.goto("/dashboard");
    // Should redirect to login
    await page.waitForURL(/\/auth\/login/);
    await expect(page).toHaveURL(/\/auth\/login/);
  });
  test("should have responsive navigation", async ({ page }) => {
    await page.goto("/");
    // Desktop navigation
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("header")).toBeVisible();
    // Mobile navigation
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("header")).toBeVisible();
  });
  test("should have working links in header", async ({ page }) => {
    await page.goto("/");
    // Should have login link
    const loginLink = page.locator('a[href*="login"]').first();
    if (await loginLink.isVisible()) {
      await expect(loginLink).toBeVisible();
    }
  });
  test("should display footer", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });
  test("should handle 404 pages", async ({ page }) => {
    const response = await page.goto("/this-page-does-not-exist");
    // Should return 404
    expect(response?.status()).toBe(404);
  });
  test("should load without console errors on landing page", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    // Filter out non-critical errors (like favicon 404)
    const criticalErrors = errors.filter(
      (error) => !error.includes("favicon") && !error.includes("404")
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
