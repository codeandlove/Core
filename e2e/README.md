# E2E Tests

This directory contains End-to-End tests for Core Starter using Playwright.

## Test Files

### 🟢 `smoke.spec.ts` - Basic Smoke Tests

**Requirements:** None (just needs app running)

- Verifies pages load correctly
- Tests routing and redirects
- Checks responsive design
- No database or authentication needed

**Run:** `npm run test:e2e -- --project=smoke-tests`

### 🟡 `auth.spec.ts` - Authentication Tests

**Requirements:** Supabase running + test users

- User registration
- Login/logout flows
- Password reset
- Protected routes
- Session management

### 🟡 `stripe.spec.ts` - Payment & Subscription Tests

**Requirements:** Supabase + Stripe configured

- Checkout flow
- Subscription management
- Trial handling
- Feature access control
- Webhook handling (skipped - requires setup)

### 🟡 `dashboard.spec.ts` - Dashboard Tests

**Requirements:** Supabase + authenticated users

- Dashboard layout
- User menu functionality
- Settings page
- Subscription status display
- Responsive design

### 🟡 `landing.spec.ts` - Landing Page Tests

**Requirements:** App running (partial Supabase)

- Hero section
- Features section
- Pricing section
- Footer and navigation
- SEO meta tags
- Responsive design

### `helpers.ts` - Test Utilities

Helper functions for E2E tests:

- Login/logout helpers
- User credentials
- Mock functions
- Common utilities

---

## Quick Start

### Run Smoke Tests (No Setup Required)

```bash
npm run test:e2e -- --project=smoke-tests
```

### Run All Tests (Requires Setup)

```bash
# 1. Start Supabase
supabase start

# 2. Run tests
npm run test:e2e
```

---

## Prerequisites for Full Tests

### 1. Supabase Running Locally

```bash
supabase start
```

Verify it's running:

```bash
curl http://127.0.0.1:54321/rest/v1/
```

### 2. Test Users in Database

You need to create test users with different subscription statuses:

| Email                       | Password            | Subscription Status | Purpose               |
| --------------------------- | ------------------- | ------------------- | --------------------- |
| `user@example.com`          | `ValidPassword123!` | free                | General user tests    |
| `free-user@example.com`     | `ValidPassword123!` | free                | Free tier tests       |
| `premium-user@example.com`  | `ValidPassword123!` | active              | Premium feature tests |
| `trial-user@example.com`    | `ValidPassword123!` | trial               | Trial period tests    |
| `expired-trial@example.com` | `ValidPassword123!` | trial_expired       | Expired trial tests   |

**TODO:** Create script to seed these users automatically.

### 3. Environment Variables

Ensure `.env` has correct Supabase and Stripe configuration:

```env
PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

STRIPE_SECRET_KEY=sk_test_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Running Tests

### All Tests

```bash
npm run test:e2e
```

### Specific Project

```bash
npm run test:e2e -- --project=smoke-tests
npm run test:e2e -- --project=auth-tests
npm run test:e2e -- --project=stripe-tests
npm run test:e2e -- --project=dashboard-tests
npm run test:e2e -- --project=landing-tests
```

### Interactive Mode (UI)

```bash
npm run test:e2e:ui
```

### Debug Mode

```bash
npm run test:e2e:debug
```

### Specific Test File

```bash
npm run test:e2e -- smoke.spec.ts
npm run test:e2e -- auth.spec.ts
```

### Headed Mode (See Browser)

```bash
npm run test:e2e -- --headed
```

---

## Test Configuration

See `playwright.config.ts` in project root.

**Key settings:**

- **Timeout:** 60 seconds per test
- **Workers:** 2 (to avoid overwhelming local services)
- **Auto-start:** Dev server starts automatically
- **Retries:** 2 retries in CI, 0 locally
- **Reporters:** HTML, JSON, List

---

## Troubleshooting

### Tests Time Out

**Problem:** Tests can't connect to app

**Solutions:**

1. Verify app is running: `curl http://localhost:3000`
2. Check Supabase is running: `supabase status`
3. Increase timeout in `playwright.config.ts`

### Authentication Tests Fail

**Problem:** Can't login or create users

**Solutions:**

1. Check Supabase is running
2. Verify test users exist in database
3. Check `.env` has correct Supabase keys
4. Verify JWT secrets match

### Stripe Tests Fail

**Problem:** Checkout or webhook tests fail

**Solutions:**

1. Verify Stripe keys in `.env`
2. Use test mode keys (sk*test*... / pk*test*...)
3. Check webhook secret is configured
4. For webhook tests - may need Stripe CLI

### Database Connection Errors

**Problem:** Can't connect to database

**Solutions:**

1. Start Supabase: `supabase start`
2. Check connection: `curl http://127.0.0.1:54321/rest/v1/`
3. Verify `.env` has correct URL
4. Check Supabase migrations: `supabase db push`

---

## CI/CD Integration

Tests are configured to work in CI with:

- `npm run preview` instead of dev server
- Build step before tests
- 2 retries on failure
- Strict mode enabled

**GitHub Actions example:**

```yaml
- name: Start Supabase
  run: supabase start

- name: Build app
  run: npm run build

- name: Run E2E tests
  run: npm run test:e2e
  env:
    CI: true
```

---

## Test Structure

Each test follows this pattern:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test.describe("Sub-feature", () => {
    test("should do something", async ({ page }) => {
      // Arrange
      await page.goto("/some-page");

      // Act
      await page.click("button");

      // Assert
      await expect(page.locator("result")).toBeVisible();
    });
  });
});
```

---

## Best Practices

1. **Use data-testid** for stable selectors
2. **Wait for network idle** before assertions
3. **Use specific selectors** (avoid generic `div`, `span`)
4. **Test user flows** not implementation details
5. **Clean up test data** after each test
6. **Mock external services** when possible
7. **Keep tests independent** (no shared state)
8. **Use page object pattern** for complex pages

---

## Future Improvements

- [ ] Create test user seeder script
- [ ] Mock Supabase for faster tests
- [ ] Add visual regression testing
- [ ] Add accessibility tests
- [ ] Add performance tests
- [ ] Create test data factories
- [ ] Add parallelization for faster runs
- [ ] Add test coverage reporting

---

## Need Help?

- 📚 [Playwright Docs](https://playwright.dev)
- 🐛 Check `E2E_TEST_DIAGNOSIS.md` for common issues
- 💬 See test patterns in existing spec files
- 🔍 Use debug mode: `npm run test:e2e:debug`
