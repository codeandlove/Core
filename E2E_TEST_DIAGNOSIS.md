# E2E Tests Diagnosis Report

## Date: 2026-02-13

## Problem

All E2E tests are timing out after 32 seconds, indicating they cannot connect to the application.

---

## Root Causes Identified

### 1. Missing Web Server Configuration ❌
**Problem:** Playwright config had `webServer: undefined` for local development
- Tests expected app to be running on `http://localhost:3000`
- No automatic server startup was configured
- Users had to manually start server before tests

**Fix Applied:**
```typescript
webServer: {
  command: process.env.CI ? "npm run preview" : "npm run dev",
  url: "http://localhost:3000",
  timeout: 120 * 1000,
  reuseExistingServer: !process.env.CI,
}
```

### 2. Tests Require Database ❌
**Problem:** All existing tests require:
- Supabase running locally (`supabase start`)
- Test users created in database
- Valid authentication tokens
- Subscription data

**Current Status:** Supabase NOT running locally
- `.env` points to `http://127.0.0.1:54321` (local Supabase)
- Connection test failed - no response from Supabase

---

## Solution Implemented

### Created Smoke Tests (`e2e/smoke.spec.ts`)
Basic tests that **DO NOT require database**:

1. ✅ Landing page loads
2. ✅ Login page displays form
3. ✅ Register page displays form  
4. ✅ Forgot password page displays form
5. ✅ Dashboard redirects to login without auth
6. ✅ Responsive navigation works
7. ✅ Header links present
8. ✅ Footer displays
9. ✅ 404 pages handled
10. ✅ No console errors on landing

### Updated Playwright Config
- Added `timeout: 60000` (60 seconds per test)
- Added `webServer` auto-start configuration
- Reduced `workers: 2` to avoid overwhelming local services
- Created `smoke-tests` project (no database needed)
- Marked other projects as `fullyParallel: false`

---

## Test Categories

### Category 1: Smoke Tests (smoke.spec.ts) ✅
**Status:** Ready to run
**Requirements:** None - just needs app running
**Purpose:** Verify basic page rendering and routing

**Run with:**
```bash
npm run test:e2e -- --project=smoke-tests
```

### Category 2: Auth Tests (auth.spec.ts) ⚠️
**Status:** Requires setup
**Requirements:**
- Supabase running (`supabase start`)
- Test users in database
- Valid auth configuration

**Tests:**
- User registration
- Login/logout flows
- Password reset
- Protected routes
- Session persistence

### Category 3: Stripe Tests (stripe.spec.ts) ⚠️
**Status:** Requires setup
**Requirements:**
- Supabase running
- Stripe configured
- Test subscription data
- Webhook endpoints

**Tests:**
- Checkout flow
- Subscription management
- Payment success/cancel
- Feature access control
- Trial handling

### Category 4: Dashboard Tests (dashboard.spec.ts) ⚠️
**Status:** Requires setup
**Requirements:**
- Supabase running
- Authenticated test users
- Subscription data

**Tests:**
- Dashboard layout
- User menu
- Settings page
- Subscription display
- Responsive design

### Category 5: Landing Tests (landing.spec.ts) ⚠️
**Status:** Requires setup
**Requirements:**
- Supabase running (for links to work)
- Full app functionality

**Tests:**
- Hero section
- Features section
- Pricing section
- Footer links
- Responsive design
- SEO meta tags

---

## How to Run Tests

### Quick Test (No Database)
```bash
# Smoke tests only - verifies pages load
npm run test:e2e -- --project=smoke-tests
```

### Full Test Suite (Requires Setup)

**Step 1: Start Supabase**
```bash
supabase start
```

**Step 2: Verify Supabase is running**
```bash
curl http://127.0.0.1:54321/rest/v1/
```

**Step 3: Create test users (if needed)**
```bash
# TODO: Create script to seed test users
# test@example.com
# free-user@example.com
# premium-user@example.com
# trial-user@example.com
# expired-trial@example.com
```

**Step 4: Run all tests**
```bash
npm run test:e2e
```

**Step 5: Run specific project**
```bash
npm run test:e2e -- --project=auth-tests
npm run test:e2e -- --project=stripe-tests
npm run test:e2e -- --project=dashboard-tests
npm run test:e2e -- --project=landing-tests
```

---

## Recommendations

### Immediate Actions

1. **Run smoke tests first** ✅
   - Verify basic functionality without database
   - Smoke tests will pass if app builds correctly

2. **Set up local Supabase** (for full tests)
   ```bash
   supabase init
   supabase start
   supabase db push
   ```

3. **Create test user seeder script**
   - Script to create test users with different subscription statuses
   - Should be idempotent (safe to run multiple times)

### Long-term Improvements

1. **Mock Supabase for E2E tests**
   - Use MSW (Mock Service Worker) to intercept Supabase calls
   - Allow tests to run without real database
   - Faster and more reliable

2. **Separate integration vs E2E tests**
   - Integration: Test with real Supabase locally
   - E2E: Test with mocked backend for speed

3. **CI/CD Setup**
   - Use Supabase CLI in CI to start ephemeral database
   - Seed test data automatically
   - Run full test suite on every PR

4. **Test Data Management**
   - Create dedicated test database
   - Auto-cleanup after tests
   - Isolated test accounts

---

## Current Test Status

| Test Suite | Count | Requires DB | Status | Can Run? |
|------------|-------|-------------|--------|----------|
| Smoke Tests | 10 | ❌ No | ✅ Ready | ✅ Yes |
| Auth Tests | 15 | ✅ Yes | ⚠️ Setup needed | ❌ No |
| Stripe Tests | 18 | ✅ Yes | ⚠️ Setup needed | ❌ No |
| Dashboard Tests | 20 | ✅ Yes | ⚠️ Setup needed | ❌ No |
| Landing Tests | 15 | ⚠️ Partial | ⚠️ Setup needed | ❌ No |
| **Total** | **78** | - | - | **10 ready** |

---

## Files Modified

1. **`playwright.config.ts`**
   - Added `webServer` configuration
   - Added `timeout: 60000`
   - Added `smoke-tests` project
   - Reduced workers to 2

2. **`e2e/smoke.spec.ts`** (NEW)
   - 10 basic smoke tests
   - No database required
   - Tests page rendering and routing

---

## Next Steps

### For You (User)

**Option A: Run Smoke Tests Only**
```bash
npm run test:e2e -- --project=smoke-tests
```
This will verify that pages load correctly without needing Supabase.

**Option B: Set Up Full Testing**
1. Start Supabase: `supabase start`
2. Verify it's running: `curl http://127.0.0.1:54321/rest/v1/`
3. Create test users (manual or script)
4. Run all tests: `npm run test:e2e`

### For Future Development

1. Create `scripts/seed-test-users.ts` to automate test user creation
2. Consider mocking Supabase for faster E2E tests
3. Add test data cleanup scripts
4. Document test user credentials in README

---

## Summary

**Problem:** Tests were failing because:
1. No web server was configured to start automatically
2. Supabase is not running locally
3. No test users exist in database

**Solution:** 
1. ✅ Fixed web server configuration
2. ✅ Created smoke tests that don't need database
3. ⚠️ Full test suite requires Supabase setup

**Result:**
- **10 smoke tests** can run immediately without setup
- **68 integration tests** require local Supabase + test data
- Clear documentation for both scenarios

---

**Diagnosis completed on 2026-02-13**

