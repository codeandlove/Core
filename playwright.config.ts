import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
dotenv.config();
/**
 * Playwright Configuration
 * E2E tests for Core Starter
 *
 * IMPORTANT: Most tests require Supabase running locally.
 * Start with: supabase start
 *
 * Smoke tests (smoke.spec.ts) can run without database.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 60000,
  workers: 2,
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "playwright-report/results.json" }],
    ["list"],
  ],
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: {
    command: process.env.CI ? "npm run preview" : "npm run dev",
    url: "http://localhost:3000",
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "smoke-tests",
      testMatch: /smoke\.spec/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "auth-tests",
      testMatch: /auth\.spec/,
      use: {
        ...devices["Desktop Chrome"],
      },
      fullyParallel: false,
    },
    {
      name: "stripe-tests",
      testMatch: /stripe\.spec/,
      use: {
        ...devices["Desktop Chrome"],
      },
      fullyParallel: false,
    },
    {
      name: "dashboard-tests",
      testMatch: /dashboard\.spec/,
      use: {
        ...devices["Desktop Chrome"],
      },
      fullyParallel: false,
    },
    {
      name: "landing-tests",
      testMatch: /landing\.spec/,
      use: {
        ...devices["Desktop Chrome"],
      },
      fullyParallel: false,
    },
  ],
});
