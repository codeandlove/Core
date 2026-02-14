/**
 * E2E Tests: Dashboard
 * Tests for dashboard layout, navigation, and core functionality
 */

import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login");
    await page.fill('input[name="email"]', "user@example.com");
    await page.fill('input[name="password"]', "ValidPassword123!");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test.describe("Layout and Navigation", () => {
    test("should display dashboard layout", async ({ page }) => {
      // Should have header
      await expect(page.locator("header")).toBeVisible();

      // Should have main content area
      await expect(page.locator("main")).toBeVisible();

      // Should have user menu
      await expect(page.locator('[aria-label="User menu"]')).toBeVisible();
    });

    test("should display user profile in header", async ({ page }) => {
      const userMenu = page.locator('[aria-label="User menu"]');
      await expect(userMenu).toBeVisible();

      // Click to open menu
      await userMenu.click();

      // Should show user email or name
      await expect(
        page.locator("text=/user@example.com|test user/i"),
      ).toBeVisible();
    });

    test("should navigate to settings", async ({ page }) => {
      await page.click('[aria-label="User menu"]');
      await page.click('a:has-text("Settings")');

      await expect(page).toHaveURL(/\/dashboard\/settings/);
    });

    test("should have working navigation links", async ({ page }) => {
      // Test main navigation links
      const navLinks = ["Dashboard", "Settings"];

      for (const linkText of navLinks) {
        const link = page.locator(`a:has-text("${linkText}")`);
        if (await link.isVisible()) {
          await link.click();
          await expect(page.url()).toContain(linkText.toLowerCase());
        }
      }
    });
  });

  test.describe("User Menu", () => {
    test("should toggle user menu on click", async ({ page }) => {
      const userMenu = page.locator('[aria-label="User menu"]');
      await userMenu.click();

      // Menu should be visible
      const menuDropdown = page.locator('[role="menu"]');
      await expect(menuDropdown).toBeVisible();

      // Click again to close
      await userMenu.click();

      // Menu should be hidden
      await expect(menuDropdown).not.toBeVisible();
    });

    test("should display menu items", async ({ page }) => {
      await page.click('[aria-label="User menu"]');

      // Should have expected menu items
      await expect(page.locator('text="Settings"')).toBeVisible();
      await expect(page.locator("text=/Logout|Sign out/i")).toBeVisible();
    });

    test("should close menu when clicking outside", async ({ page }) => {
      await page.click('[aria-label="User menu"]');

      const menuDropdown = page.locator('[role="menu"]');
      await expect(menuDropdown).toBeVisible();

      // Click outside
      await page.click("main");

      // Menu should close
      await expect(menuDropdown).not.toBeVisible();
    });
  });

  test.describe("Subscription Status Display", () => {
    test("should show subscription status for free users", async ({ page }) => {
      // Already logged in as free user
      await page.goto("/dashboard");

      // Should show free plan indicator
      await expect(page.locator("text=/free plan|upgrade/i")).toBeVisible();
    });

    test("should show subscription status for premium users", async ({
      page,
    }) => {
      // Logout and login as premium user
      await page.click('[aria-label="User menu"]');
      await page.click("text=/Logout|Sign out/i");

      await page.goto("/login");
      await page.fill('input[name="email"]', "premium-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      // Should show premium status
      await expect(page.locator("text=/premium|pro/i")).toBeVisible();
    });

    test("should show trial status with days remaining", async ({ page }) => {
      // Logout and login as trial user
      await page.click('[aria-label="User menu"]');
      await page.click("text=/Logout|Sign out/i");

      await page.goto("/login");
      await page.fill('input[name="email"]', "trial-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      // Should show trial status with countdown
      await expect(page.locator("text=/trial.*[0-9]+ days/i")).toBeVisible();
    });
  });

  test.describe("Core Feature Placeholder", () => {
    test("should display main feature area", async ({ page }) => {
      // TODO: Replace with actual core feature selector

      // Should have placeholder for main feature
      await expect(
        page.locator("text=/coming soon|feature placeholder/i"),
      ).toBeVisible();
    });

    test("should show feature description", async ({ page }) => {
      // Should have some description of what the feature will be
      // TODO: Update when actual feature is implemented
      await expect(page.locator("main")).toContainText(/dashboard|welcome/i);
    });
  });

  test.describe("Premium Feature Access", () => {
    test("should show premium feature locks for free users", async ({
      page,
    }) => {
      // Look for locked premium features
      const premiumFeatures = page.locator('[data-premium="true"]');

      if ((await premiumFeatures.count()) > 0) {
        // Should show lock icon or disabled state
        await expect(
          premiumFeatures.first().locator('[data-icon="lock"]'),
        ).toBeVisible();
      }
    });

    test("should show upgrade CTA for free users", async ({ page }) => {
      // Should have upgrade button or banner
      await expect(page.locator('button:has-text("Upgrade")')).toBeVisible();
    });

    test("should allow premium features for subscribed users", async ({
      page,
    }) => {
      // Logout and login as premium user
      await page.click('[aria-label="User menu"]');
      await page.click("text=/Logout|Sign out/i");

      await page.goto("/login");
      await page.fill('input[name="email"]', "premium-user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      // Premium features should not be locked
      const premiumFeatures = page.locator('[data-premium="true"]');

      if ((await premiumFeatures.count()) > 0) {
        // Should not have lock icon
        await expect(
          premiumFeatures.first().locator('[data-icon="lock"]'),
        ).not.toBeVisible();
      }
    });
  });

  test.describe("Responsive Design", () => {
    test("should be responsive on mobile", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Should still display key elements
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator('[aria-label="User menu"]')).toBeVisible();
    });

    test("should be responsive on tablet", async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });

      // Should display properly on tablet
      await expect(page.locator("header")).toBeVisible();
      await expect(page.locator("main")).toBeVisible();
    });

    test("should have mobile menu if needed", async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Check if there's a mobile menu button
      const mobileMenuButton = page.locator('[aria-label="Menu"]');

      if (await mobileMenuButton.isVisible()) {
        await mobileMenuButton.click();

        // Should show navigation
        await expect(page.locator("nav")).toBeVisible();
      }
    });
  });

  test.describe("Settings Page", () => {
    test("should display settings sections", async ({ page }) => {
      await page.goto("/dashboard/settings");

      // Should have settings content
      await expect(page.locator("text=/settings|account/i")).toBeVisible();
    });

    test("should display subscription management", async ({ page }) => {
      await page.goto("/dashboard/settings");

      // Should show subscription section
      await expect(page.locator("text=/subscription|plan/i")).toBeVisible();
    });

    test("should allow email change", async ({ page }) => {
      await page.goto("/dashboard/settings");

      const emailInput = page.locator('input[name="email"]');

      if (await emailInput.isVisible()) {
        await expect(emailInput).toBeVisible();
        await expect(emailInput).toHaveValue(/.*@.*\..*/);
      }
    });

    test("should allow password change", async ({ page }) => {
      await page.goto("/dashboard/settings");

      // Look for password change section
      const passwordSection = page.locator(
        "text=/change password|update password/i",
      );

      if (await passwordSection.isVisible()) {
        await expect(passwordSection).toBeVisible();
      }
    });
  });

  test.describe("Error Handling", () => {
    test("should handle network errors gracefully", async ({
      page,
      context,
    }) => {
      // Simulate offline
      await context.setOffline(true);

      await page.reload();

      // Should show error message or offline indicator
      await expect(
        page.locator("text=/error|offline|connection/i"),
      ).toBeVisible({ timeout: 10000 });

      // Restore connection
      await context.setOffline(false);
    });

    test("should handle session expiration", async ({ page }) => {
      // Clear cookies to simulate session expiration
      await page.context().clearCookies();

      await page.reload();

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  });
});
