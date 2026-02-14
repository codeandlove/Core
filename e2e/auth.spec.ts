/**
 * E2E Tests: Authentication
 * Tests for user registration, login, logout, and password reset
 */

import { test, expect } from "@playwright/test";

const TEST_USER = {
  email: `test-${Date.now()}@example.com`,
  password: "TestPassword123!",
  name: "Test User",
};

test.describe("Authentication", () => {
  test.describe("Registration", () => {
    test("should register a new user successfully", async ({ page }) => {
      await page.goto("/register");

      // Fill registration form
      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', TEST_USER.password);
      await page.fill('input[name="confirmPassword"]', TEST_USER.password);

      // Submit form
      await page.click('button[type="submit"]');

      // Should redirect to dashboard or show success message
      await expect(page).toHaveURL(/\/(dashboard|verify-email)/);
    });

    test("should show error for existing email", async ({ page }) => {
      await page.goto("/register");

      await page.fill('input[name="email"]', "existing@example.com");
      await page.fill('input[name="password"]', TEST_USER.password);
      await page.fill('input[name="confirmPassword"]', TEST_USER.password);

      await page.click('button[type="submit"]');

      // Should show error message
      await expect(
        page.locator("text=/already exists|already registered/i"),
      ).toBeVisible();
    });

    test("should validate password strength", async ({ page }) => {
      await page.goto("/register");

      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', "weak");
      await page.fill('input[name="confirmPassword"]', "weak");

      // Should show password strength indicator
      await expect(page.locator("text=/weak|too short/i")).toBeVisible();
    });

    test("should validate password confirmation match", async ({ page }) => {
      await page.goto("/register");

      await page.fill('input[name="email"]', TEST_USER.email);
      await page.fill('input[name="password"]', TEST_USER.password);
      await page.fill('input[name="confirmPassword"]', "DifferentPassword123!");

      await page.click('button[type="submit"]');

      // Should show error
      await expect(page.locator("text=/passwords.*match/i")).toBeVisible();
    });
  });

  test.describe("Login", () => {
    test("should login successfully with valid credentials", async ({
      page,
    }) => {
      await page.goto("/login");

      await page.fill('input[name="email"]', "user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");

      await page.click('button[type="submit"]');

      // Should redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test("should show error with invalid credentials", async ({ page }) => {
      await page.goto("/login");

      await page.fill('input[name="email"]', "wrong@example.com");
      await page.fill('input[name="password"]', "WrongPassword123!");

      await page.click('button[type="submit"]');

      // Should show error message
      await expect(
        page.locator("text=/invalid.*credentials|incorrect/i"),
      ).toBeVisible();
    });

    test("should persist session after page reload", async ({ page }) => {
      await page.goto("/login");

      await page.fill('input[name="email"]', "user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/dashboard/);

      // Reload page
      await page.reload();

      // Should still be on dashboard
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe("Logout", () => {
    test("should logout successfully", async ({ page }) => {
      // Login first
      await page.goto("/login");
      await page.fill('input[name="email"]', "user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/dashboard/);

      // Logout
      await page.click('button[aria-label="User menu"]');
      await page.click("text=/logout|sign out/i");

      // Should redirect to home or login
      await expect(page).toHaveURL(/\/(login|$)/);
    });

    test("should clear session after logout", async ({ page }) => {
      // Login and logout
      await page.goto("/login");
      await page.fill('input[name="email"]', "user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await page.click('button[aria-label="User menu"]');
      await page.click("text=/logout|sign out/i");

      // Try to access protected route
      await page.goto("/dashboard");

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe("Password Reset", () => {
    test("should send password reset email", async ({ page }) => {
      await page.goto("/forgot-password");

      await page.fill('input[name="email"]', "user@example.com");
      await page.click('button[type="submit"]');

      // Should show success message
      await expect(
        page.locator("text=/email sent|check your email/i"),
      ).toBeVisible();
    });

    test("should handle invalid email gracefully", async ({ page }) => {
      await page.goto("/forgot-password");

      await page.fill('input[name="email"]', "invalid-email");
      await page.click('button[type="submit"]');

      // Should show validation error
      await expect(page.locator("text=/valid email/i")).toBeVisible();
    });

    test("should reset password with valid token", async ({ page }) => {
      // Navigate to reset password page with token
      await page.goto("/reset-password?token=valid-token");

      await page.fill('input[name="password"]', "NewPassword123!");
      await page.fill('input[name="confirmPassword"]', "NewPassword123!");
      await page.click('button[type="submit"]');

      // Should show success and redirect to login
      await expect(
        page.locator("text=/password.*reset|success/i"),
      ).toBeVisible();
    });

    test("should handle expired token", async ({ page }) => {
      await page.goto("/reset-password?token=expired-token");

      await page.fill('input[name="password"]', "NewPassword123!");
      await page.fill('input[name="confirmPassword"]', "NewPassword123!");
      await page.click('button[type="submit"]');

      // Should show error
      await expect(
        page.locator("text=/expired|invalid.*token/i"),
      ).toBeVisible();
    });
  });

  test.describe("Protected Routes", () => {
    test("should redirect to login when accessing protected route without auth", async ({
      page,
    }) => {
      await page.goto("/dashboard");

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test("should redirect to dashboard when accessing login page while authenticated", async ({
      page,
    }) => {
      // Login first
      await page.goto("/login");
      await page.fill('input[name="email"]', "user@example.com");
      await page.fill('input[name="password"]', "ValidPassword123!");
      await page.click('button[type="submit"]');

      await expect(page).toHaveURL(/\/dashboard/);

      // Try to access login page
      await page.goto("/login");

      // Should stay on or redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });
});
