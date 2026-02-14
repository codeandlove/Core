/**
 * Playwright Test Configuration
 * Global setup and helpers for E2E tests
 */

import type { Page } from "@playwright/test";

/**
 * Test user credentials
 */
export const TEST_USERS = {
  free: {
    email: "free-user@example.com",
    password: "ValidPassword123!",
  },
  premium: {
    email: "premium-user@example.com",
    password: "ValidPassword123!",
  },
  trial: {
    email: "trial-user@example.com",
    password: "ValidPassword123!",
  },
  expired: {
    email: "expired-trial@example.com",
    password: "ValidPassword123!",
  },
  admin: {
    email: "admin@example.com",
    password: "AdminPassword123!",
  },
};

/**
 * Login helper
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
}

/**
 * Logout helper
 */
export async function logout(page: Page) {
  await page.click('[aria-label="User menu"]');
  await page.click("text=/logout|sign out/i");
  await page.waitForURL(/\/(login|$)/);
}

/**
 * Register helper
 */
export async function register(
  page: Page,
  email: string,
  password: string,
  confirmPassword?: string,
) {
  await page.goto("/register");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.fill('input[name="confirmPassword"]', confirmPassword || password);
  await page.click('button[type="submit"]');
}

/**
 * Wait for network idle
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000) {
  await page.waitForLoadState("networkidle", { timeout });
}

/**
 * Clear all storage
 */
export async function clearStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

/**
 * Mock Stripe checkout
 */
export async function mockStripeCheckout(page: Page) {
  await page.route("**/api/checkout", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        url: "https://checkout.stripe.com/test_session_123",
      }),
    });
  });
}

/**
 * Mock successful webhook
 * Note: If you need to differentiate webhook types, restore the type parameter
 */
export async function mockWebhook(page: Page) {
  await page.route("**/api/webhooks/stripe", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ received: true }),
    });
  });
}

/**
 * Check if element is in viewport
 */
export async function isInViewport(
  page: Page,
  selector: string,
): Promise<boolean> {
  const element = page.locator(selector);
  const box = await element.boundingBox();

  if (!box) return false;

  const viewport = page.viewportSize();
  if (!viewport) return false;

  return (
    box.y >= 0 &&
    box.x >= 0 &&
    box.y + box.height <= viewport.height &&
    box.x + box.width <= viewport.width
  );
}

/**
 * Scroll to element
 */
export async function scrollToElement(page: Page, selector: string) {
  const element = page.locator(selector);
  await element.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Wait for smooth scroll
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(page: Page, name: string) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  await page.screenshot({
    path: `screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

/**
 * Check for console errors
 */
export function setupConsoleErrorCapture(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

/**
 * Wait for element to be stable (no animation)
 */
export async function waitForStable(
  page: Page,
  selector: string,
  timeout = 3000,
) {
  const element = page.locator(selector);
  let previousBox = await element.boundingBox();

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    await page.waitForTimeout(100);
    const currentBox = await element.boundingBox();

    if (
      previousBox &&
      currentBox &&
      previousBox.x === currentBox.x &&
      previousBox.y === currentBox.y &&
      previousBox.width === currentBox.width &&
      previousBox.height === currentBox.height
    ) {
      return true;
    }

    previousBox = currentBox;
  }

  return false;
}

/**
 * Fill form with data
 */
export async function fillForm(page: Page, formData: Record<string, string>) {
  for (const [name, value] of Object.entries(formData)) {
    await page.fill(`input[name="${name}"]`, value);
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  await page.goto("/dashboard");
  return page.url().includes("/dashboard");
}

/**
 * Set viewport to common device sizes
 */
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1920, height: 1080 },
  smallMobile: { width: 320, height: 568 },
  largeMobile: { width: 414, height: 896 },
} as const;

/**
 * Common timeouts
 */
export const TIMEOUTS = {
  short: 1000,
  medium: 3000,
  long: 5000,
  veryLong: 10000,
} as const;
