/**
 * E2E Tests: Landing Page
 * Tests for public landing page, header, and footer
 */

import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.describe("Page Load and Structure", () => {
    test("should load landing page successfully", async ({ page }) => {
      await page.goto("/");

      // Page should load
      await expect(page).toHaveTitle(/.*Core.*/i);

      // Should have main content
      await expect(page.locator("main")).toBeVisible();
    });

    test("should display header", async ({ page }) => {
      await page.goto("/");

      // Should have header with logo
      const header = page.locator("header");
      await expect(header).toBeVisible();

      // Should have logo or brand name
      await expect(header.locator('[alt*="logo" i]')).toBeVisible();
    });

    test("should display navigation", async ({ page }) => {
      await page.goto("/");

      // Should have navigation with key links
      await expect(page.locator('a:has-text("Login")')).toBeVisible();
      await expect(page.locator('a:has-text("Register")')).toBeVisible();
    });

    test("should display footer", async ({ page }) => {
      await page.goto("/");

      const footer = page.locator("footer");
      await expect(footer).toBeVisible();
    });
  });

  test.describe("Hero Section", () => {
    test("should display hero content", async ({ page }) => {
      await page.goto("/");

      // Should have hero section with headline
      const hero = page
        .locator('[data-testid="hero-section"]')
        .or(page.locator("main section").first());
      await expect(hero).toBeVisible();

      // Should have headline text
      await expect(hero.locator("h1")).toBeVisible();
    });

    test("should have CTA button", async ({ page }) => {
      await page.goto("/");

      // Should have primary CTA
      const ctaButton = page
        .locator('button:has-text("Get Started")')
        .or(page.locator('a:has-text("Get Started")'));
      await expect(ctaButton.first()).toBeVisible();
    });

    test("should redirect to register on CTA click", async ({ page }) => {
      await page.goto("/");

      const ctaButton = page
        .locator('button:has-text("Get Started")')
        .or(page.locator('a:has-text("Get Started")'));

      await ctaButton.first().click();

      // Should redirect to register or login
      await expect(page).toHaveURL(/\/(register|login|signup)/);
    });
  });

  test.describe("Features Section", () => {
    test("should display features section", async ({ page }) => {
      await page.goto("/");

      // Should have features section
      const featuresSection = page
        .locator('[data-testid="features-section"]')
        .or(page.locator("text=/features/i"));

      await expect(featuresSection.first()).toBeVisible();
    });

    test("should show feature cards or list", async ({ page }) => {
      await page.goto("/");

      // Look for feature items
      // Should have at least one feature described
      const featureItems = page.locator('[data-testid="feature-item"]');

      if ((await featureItems.count()) > 0) {
        await expect(featureItems.first()).toBeVisible();
      }
    });
  });

  test.describe("Pricing Section", () => {
    test("should display pricing section", async ({ page }) => {
      await page.goto("/");

      // Scroll to pricing section
      const pricingSection = page
        .locator('[data-testid="pricing-section"]')
        .or(page.locator("text=/pricing|plans/i"));

      await pricingSection.first().scrollIntoViewIfNeeded();
      await expect(pricingSection.first()).toBeVisible();
    });

    test("should show pricing tiers", async ({ page }) => {
      await page.goto("/");

      // Should have free and premium pricing
      await expect(page.locator("text=/free/i")).toBeVisible();
      await expect(page.locator("text=/premium|pro|paid/i")).toBeVisible();
    });

    test("should display price", async ({ page }) => {
      await page.goto("/");

      // Should show price amount (e.g., $9.99)
      await expect(page.locator("text=/\\$[0-9]+/")).toBeVisible();
    });

    test("should have subscribe button", async ({ page }) => {
      await page.goto("/");

      const subscribeButton = page
        .locator('button:has-text("Subscribe")')
        .or(page.locator('button:has-text("Get Started")'));

      await expect(subscribeButton.first()).toBeVisible();
    });
  });

  test.describe("Header Navigation", () => {
    test("should navigate to login page", async ({ page }) => {
      await page.goto("/");

      await page.click('a:has-text("Login")');

      await expect(page).toHaveURL(/\/login/);
    });

    test("should navigate to register page", async ({ page }) => {
      await page.goto("/");

      const registerLink = page
        .locator('a:has-text("Register")')
        .or(page.locator('a:has-text("Sign up")'));

      await registerLink.first().click();

      await expect(page).toHaveURL(/\/register|signup/);
    });

    test("should have logo link to home", async ({ page }) => {
      await page.goto("/login");

      // Click logo
      const logo = page.locator('header a[href="/"]').first();
      await logo.click();

      await expect(page).toHaveURL("/");
    });
  });

  test.describe("Footer", () => {
    test("should display footer content", async ({ page }) => {
      await page.goto("/");

      const footer = page.locator("footer");
      await expect(footer).toBeVisible();

      // Should have copyright or company name
      await expect(footer).toContainText(/©|copyright|2026/i);
    });

    test("should have footer links", async ({ page }) => {
      await page.goto("/");

      const footer = page.locator("footer");

      // Should have some navigation links
      const footerLinks = footer.locator("a");
      expect(await footerLinks.count()).toBeGreaterThan(0);
    });

    test("should have privacy policy link", async ({ page }) => {
      await page.goto("/");

      const privacyLink = page.locator('a:has-text("Privacy")');

      if (await privacyLink.isVisible()) {
        await expect(privacyLink).toBeVisible();
        await expect(privacyLink).toHaveAttribute("href", /privacy/i);
      }
    });

    test("should have terms of service link", async ({ page }) => {
      await page.goto("/");

      const termsLink = page.locator('a:has-text("Terms")');

      if (await termsLink.isVisible()) {
        await expect(termsLink).toBeVisible();
        await expect(termsLink).toHaveAttribute("href", /terms/i);
      }
    });
  });

  test.describe("Responsive Design", () => {
    test("should be responsive on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Should display on mobile
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("footer")).toBeVisible();
    });

    test("should have mobile menu", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto("/");

      // Look for hamburger menu button
      const mobileMenuButton = page
        .locator('[aria-label="Menu"]')
        .or(page.locator('button:has([data-icon="menu"])'));

      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();

        // Should show navigation
        await expect(page.locator('a:has-text("Login")')).toBeVisible();
      }
    });

    test("should be responsive on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto("/");

      // Should display properly
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
    });

    test("should be responsive on desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto("/");

      // Should display properly
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
    });
  });

  test.describe("SEO and Meta", () => {
    test("should have proper title", async ({ page }) => {
      await page.goto("/");

      await expect(page).toHaveTitle(/.+/);
    });

    test("should have meta description", async ({ page }) => {
      await page.goto("/");

      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute("content", /.+/);
    });

    test("should have favicon", async ({ page }) => {
      await page.goto("/");

      const favicon = page.locator('link[rel="icon"]');
      expect(await favicon.count()).toBeGreaterThan(0);
    });
  });

  test.describe("Performance", () => {
    test("should load within reasonable time", async ({ page }) => {
      const startTime = Date.now();

      await page.goto("/");
      await page.waitForLoadState("networkidle");

      const loadTime = Date.now() - startTime;

      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test("should have no console errors", async ({ page }) => {
      const errors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });

      await page.goto("/");

      // Allow some time for any async errors
      await page.waitForTimeout(1000);

      // Should have no critical errors
      const criticalErrors = errors.filter(
        (error) => !error.includes("favicon") && !error.includes("404"),
      );

      expect(criticalErrors).toHaveLength(0);
    });
  });

  test.describe("Call to Action Flow", () => {
    test("should complete full CTA flow from landing to register", async ({
      page,
    }) => {
      await page.goto("/");

      // Click main CTA
      await page.click('a:has-text("Get Started")');

      // Should be on register page
      await expect(page).toHaveURL(/\/(register|signup)/);

      // Should be able to see registration form
      await expect(page.locator('input[name="email"]')).toBeVisible();
    });

    test("should complete pricing CTA flow", async ({ page }) => {
      await page.goto("/");

      // Scroll to pricing
      await page
        .locator('[data-testid="pricing-section"]')
        .scrollIntoViewIfNeeded();

      // Click subscribe button
      await page.click('button:has-text("Subscribe")');

      // Should redirect to register or checkout
      await expect(page).toHaveURL(/\/(register|signup|checkout)/);
    });
  });
});
