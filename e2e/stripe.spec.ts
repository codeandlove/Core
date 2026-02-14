/**
 * E2E Tests: Stripe Integration
 * Tests for subscription checkout, webhooks, and payment processing
 */

import { test, expect } from "@playwright/test";

test.describe("Stripe Integration", () => {
  test.describe("Subscription Checkout", () => {
    test("should redirect to Stripe checkout", async ({ page }) => {
      // Login first
      await page.goto("/login");
      await page.fill('input[name="email"]', "free-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/dashboard/);

      // Click upgrade button
      await page.click('button:has-text("Upgrade")');

      // Should redirect to Stripe checkout
      await expect(page).toHaveURL(/checkout\.stripe\.com/);
    });

    test("should show pricing information before checkout", async ({
      page,
    }) => {
      await page.goto("/");

      // Find pricing section
      const pricingSection = page.locator('[data-testid="pricing-section"]');
      await expect(pricingSection).toBeVisible();

      // Should show price
      await expect(pricingSection.locator("text=/\\$[0-9]+/")).toBeVisible();

      // Should have CTA button
      await expect(
        pricingSection.locator('button:has-text("Subscribe")'),
      ).toBeVisible();
    });

    test("should handle checkout cancellation", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "free-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      // Start checkout
      await page.click('button:has-text("Upgrade")');

      // Wait for Stripe checkout
      await page.waitForURL(/checkout\.stripe\.com/);

      // Go back to the app (simulating cancellation)
      await page.goto("/dashboard");

      // Should still be on free tier
      await expect(page.locator("text=/free plan|upgrade/i")).toBeVisible();
    });
  });

  test.describe("Subscription Status", () => {
    test("should display active subscription status", async ({ page }) => {
      // Login with premium user
      await page.goto("/login");
      await page.fill('input[name="email"]', "premium-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await page.goto("/dashboard/settings");

      // Should show active subscription
      await expect(
        page.locator("text=/active subscription|premium/i"),
      ).toBeVisible();
    });

    test("should show manage subscription button for active users", async ({
      page,
    }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "premium-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await page.goto("/dashboard/settings");

      // Should have manage button
      const manageButton = page.locator(
        'button:has-text("Manage Subscription")',
      );
      await expect(manageButton).toBeVisible();
    });

    test("should redirect to billing portal when managing subscription", async ({
      page,
    }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "premium-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await page.goto("/dashboard/settings");

      await page.click('button:has-text("Manage Subscription")');

      // Should redirect to Stripe billing portal
      await expect(page).toHaveURL(/billing\.stripe\.com/);
    });

    test("should show trial status for trial users", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "trial-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await page.goto("/dashboard");

      // Should show trial indicator
      await expect(
        page.locator("text=/trial|[0-9]+ days left/i"),
      ).toBeVisible();
    });

    test("should show upgrade prompt for expired trial", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "expired-trial@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      // Should show upgrade modal or banner
      await expect(
        page.locator("text=/trial expired|upgrade now/i"),
      ).toBeVisible();
    });
  });

  test.describe("Feature Access Control", () => {
    test("should allow premium features for subscribed users", async ({
      page,
    }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "premium-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await page.goto("/dashboard");

      // Premium features should be accessible
      // TODO: Replace with actual premium feature selectors
      const premiumFeature = page.locator('[data-premium="true"]');
      await expect(premiumFeature).not.toHaveAttribute("disabled");
    });

    test("should block premium features for free users", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "free-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await page.goto("/dashboard");

      // Should show upgrade prompt when trying to access premium features
      // TODO: Replace with actual premium feature selectors
      const premiumFeature = page.locator('[data-premium="true"]');
      await premiumFeature.click();

      await expect(
        page.locator("text=/upgrade|premium feature/i"),
      ).toBeVisible();
    });

    test("should show paywall modal for free users", async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "free-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await page.goto("/dashboard");

      // Click on premium feature
      await page.click('[data-premium="true"]');

      // Should show paywall modal
      const modal = page.locator('[role="dialog"]');
      await expect(modal).toBeVisible();
      await expect(modal.locator("text=/upgrade|subscribe/i")).toBeVisible();
    });
  });

  test.describe("Webhook Handling", () => {
    test.skip("should update user status after successful payment webhook", async () => {
      // This test would require setting up webhook testing infrastructure
      // Skip for now, but keep as placeholder for future implementation
    });

    test.skip("should handle subscription cancellation webhook", async () => {
      // This test would require setting up webhook testing infrastructure
      // Skip for now, but keep as placeholder for future implementation
    });

    test.skip("should handle payment failure webhook", async () => {
      // This test would require setting up webhook testing infrastructure
      // Skip for now, but keep as placeholder for future implementation
    });
  });

  test.describe("Checkout Success", () => {
    test("should show success message after checkout", async ({ page }) => {
      // Navigate to success page with session ID
      await page.goto("/checkout/success?session_id=test_session_123");

      // Should show success message
      await expect(
        page.locator("text=/success|thank you|activated/i"),
      ).toBeVisible();

      // Should have button to go to dashboard
      await expect(page.locator('a:has-text("Go to Dashboard")')).toBeVisible();
    });

    test("should redirect to dashboard from success page", async ({ page }) => {
      await page.goto("/checkout/success?session_id=test_session_123");

      await page.click('a:has-text("Go to Dashboard")');

      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe("Checkout Cancel", () => {
    test("should show cancellation message", async ({ page }) => {
      await page.goto("/checkout/cancel");

      // Should show cancellation message
      await expect(page.locator("text=/cancelled|try again/i")).toBeVisible();

      // Should have button to try again
      await expect(page.locator('button:has-text("Try Again")')).toBeVisible();
    });

    test("should allow user to restart checkout", async ({ page }) => {
      await page.goto("/checkout/cancel");

      await page.click('button:has-text("Try Again")');

      // Should redirect back to pricing or checkout
      await expect(page).toHaveURL(/\/(pricing|checkout)/);
    });
  });
});
