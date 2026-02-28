/**
 * E2E Tests: User Profile
 * Tests for /profile/* pages: navigation, access control, sections
 */
import { test, expect, type Page } from "@playwright/test";
const AUTH_USER = {
  email: process.env.TEST_USER_EMAIL ?? "test@example.com",
  password: process.env.TEST_USER_PASSWORD ?? "TestPassword123!",
};
async function loginAs(page: Page) {
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', AUTH_USER.email);
  await page.fill('input[name="password"]', AUTH_USER.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/dashboard/);
}
test.describe("Profile - dostep i nawigacja", () => {
  test("niezalogowany uzytkownik jest przekierowywany do login", async ({
    page,
  }) => {
    await page.goto("/profile/info");
    await expect(page).toHaveURL(/auth\/login/);
  });
  test("niezalogowany uzytkownik nie ma dostepu do zadnej podstrony profilu", async ({
    page,
  }) => {
    const profileRoutes = [
      "/profile/subscription",
      "/profile/payments",
      "/profile/consents",
      "/profile/delete-account",
    ];
    for (const route of profileRoutes) {
      await page.goto(route);
      await expect(page).toHaveURL(/auth\/login/);
    }
  });
});
test.describe("Profile - zalogowany uzytkownik", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });
  test("link Profil w menu avatara prowadzi do /profile/info", async ({
    page,
  }) => {
    await page.goto("/dashboard");
    await page.click('[aria-label="User menu"]');
    await page.click('a[href="/profile/info"]');
    await expect(page).toHaveURL("/profile/info");
  });
  test("wyswietla nawigacje profilu z aktywna zakladka Informacje", async ({
    page,
  }) => {
    await page.goto("/profile/info");
    await expect(
      page.getByRole("navigation", { name: "Nawigacja profilu" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Informacje" }),
    ).toBeVisible();
  });
  test("wyswietla email uzytkownika na /profile/info", async ({ page }) => {
    await page.goto("/profile/info");
    await expect(page.getByText("@")).toBeVisible();
  });
  test("przelaczanie zakladek nawigacji profilu", async ({ page }) => {
    await page.goto("/profile/info");
    await page.getByRole("link", { name: "Subskrypcja" }).click();
    await expect(page).toHaveURL("/profile/subscription");
    await expect(
      page.getByRole("link", { name: "Subskrypcja" }),
    ).toBeVisible();
  });
  test("wszystkie zakladki profilu sa dostepne", async ({ page }) => {
    const tabs = [
      { name: "Informacje", href: "/profile/info" },
      { name: "Subskrypcja", href: "/profile/subscription" },
      { name: "Historia wplat", href: "/profile/payments" },
      { name: "Zgody", href: "/profile/consents" },
      { name: "Usun konto", href: "/profile/delete-account" },
    ];
    await page.goto("/profile/info");
    for (const tab of tabs) {
      await page.getByRole("link", { name: tab.name }).click();
      await expect(page).toHaveURL(tab.href);
    }
  });
});
test.describe("Profile - sekcja Usun konto", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });
  test("przycisk usunięcia konta jest nieaktywny bez potwierdzenia", async ({
    page,
  }) => {
    await page.goto("/profile/delete-account");
    await expect(
      page.getByRole("button", { name: /Usun konto/ }),
    ).toBeDisabled();
  });
  test("przycisk usunięcia konta aktywuje sie po zaznaczeniu checkboxa", async ({
    page,
  }) => {
    await page.goto("/profile/delete-account");
    await page.getByRole("checkbox").check();
    await expect(
      page.getByRole("button", { name: /Usun konto/ }),
    ).toBeEnabled();
  });
});
test.describe("Profile - sekcja Zgody", () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
  });
  test("wyswietla checkboxy zgod", async ({ page }) => {
    await page.goto("/profile/consents");
    await expect(page.locator('input[type="checkbox"]')).toHaveCount(2);
  });
});
