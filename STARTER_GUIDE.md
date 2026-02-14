# 📘 CORE STARTER - Complete Implementation Guide

**Version**: 1.0.0  
**Last Updated**: 2026-02-12  
**Purpose**: Detailed architecture documentation for AI assistants and developers

---

## 🎯 EXECUTIVE SUMMARY

**Core Starter** is a production-ready SaaS foundation built with Astro, React, TypeScript, Supabase, and Stripe. All core infrastructure (auth, subscriptions, payments) is complete and tested. Your job is to build premium features on top of this foundation.

**Key Principle**: DO NOT RECREATE what already exists. BUILD ON TOP of existing systems.

---

## 📐 ARCHITECTURE OVERVIEW

### Tech Stack

```yaml
Frontend:
  Framework: Astro 5.x (SSR + Islands Architecture)
  UI Library: React 19.x (functional components with hooks)
  Language: TypeScript 5.8.x
  Styling: Tailwind CSS 4.x
  Components: shadcn/ui (accessible, customizable)

Backend & Services:
  Authentication: Supabase Auth
  Database: Supabase PostgreSQL
  Payments: Stripe (Checkout + Webhooks)
  
Build & Tools:
  Package Manager: npm
  Linting: ESLint 9.x
  Testing: Vitest (unit), Playwright (E2E)
  Type Checking: TypeScript strict mode
```

### Architecture Pattern

**Astro Islands Architecture**: Pages are server-rendered (SSR) with interactive React components hydrated as "islands" using `client:load` or `client:only` directives.

**Context Pattern**: React Contexts (AuthContext, ToastContext) provide shared state across components within the same island.

**API Pattern**: RESTful API endpoints in `src/pages/api/` with Bearer token authentication.

---

## 🗂️ PROJECT STRUCTURE

```
src/
├── components/             # React components
│   ├── auth/              # ✅ COMPLETE - Login, Register, Password Reset
│   ├── account/           # ✅ COMPLETE - Account modal, subscription status
│   ├── checkout/          # ✅ COMPLETE - Checkout loader
│   ├── dashboard/         # 🔧 CUSTOMIZE - Your main feature goes here
│   ├── layout/            # ✅ COMPLETE - Header, AppLayout
│   └── ui/                # ✅ COMPLETE - shadcn/ui primitives
│
├── contexts/              # React Contexts
│   ├── AuthContext.tsx    # ✅ COMPLETE - User session management
│   ├── ToastContext.tsx   # ✅ COMPLETE - Toast notifications
│   └── ErrorBoundary.tsx  # ✅ COMPLETE - Error handling
│
├── db/
│   ├── database.types.ts  # ✅ COMPLETE - Supabase generated types
│   └── supabase.client.ts # ✅ COMPLETE - Supabase client config
│
├── hooks/
│   └── useAuth.ts         # ✅ COMPLETE - Auth hook
│
├── layouts/
│   └── Layout.astro       # ✅ COMPLETE - Base HTML layout
│
├── lib/                   # Utilities
│   ├── api-service.ts     # ✅ COMPLETE - API calls (checkout, portal, status)
│   ├── api-client.ts      # ✅ COMPLETE - HTTP client with auth
│   ├── auth.ts            # ✅ COMPLETE - Auth utilities
│   ├── stripe.ts          # ✅ COMPLETE - Stripe client
│   ├── errors.ts          # ✅ COMPLETE - Error classes
│   ├── validation.ts      # ✅ COMPLETE - Zod schemas
│   └── utils.ts           # ✅ COMPLETE - General utilities
│
├── middleware/
│   └── index.ts           # ✅ COMPLETE - Route protection
│
├── pages/                 # Routes
│   ├── index.astro        # ✅ COMPLETE - Landing page
│   ├── dashboard.astro    # 🔧 CUSTOMIZE - Main app view
│   ├── auth/              # ✅ COMPLETE - Auth pages
│   ├── checkout/          # ✅ COMPLETE - Checkout flow
│   └── api/               # API endpoints
│       ├── subscriptions/ # ✅ COMPLETE - Stripe integration
│       ├── users/         # ✅ COMPLETE - User management
│       └── webhooks/      # ✅ COMPLETE - Stripe webhooks
│
├── services/              # Business logic
│   ├── subscription.service.ts # ✅ COMPLETE
│   ├── user.service.ts         # ✅ COMPLETE
│   ├── webhook.service.ts      # ✅ COMPLETE
│   └── audit.service.ts        # ✅ COMPLETE
│
├── types/                 # TypeScript definitions
│   ├── subscription.types.ts   # ✅ COMPLETE
│   ├── ui.types.ts             # ✅ COMPLETE
│   ├── webhook.types.ts        # ✅ COMPLETE
│   └── types.ts                # ✅ COMPLETE
│
└── styles/
    └── global.css         # ✅ COMPLETE - Tailwind + custom styles
```

### Legend
- ✅ COMPLETE = Do not modify unless necessary
- 🔧 CUSTOMIZE = This is where you build your features

---

## 🔒 CORE SYSTEMS (DO NOT MODIFY)

### 1. Authentication System

**Status**: ✅ Production-ready  
**Last Modified**: 2026-02-12

#### Components

```
src/components/auth/
├── AuthForm.tsx              # Login/Register form with validation
├── AuthPageWrapper.tsx       # Wrapper with AuthProvider context
├── ForgotPasswordForm.tsx    # Password reset request
├── ResetPasswordForm.tsx     # Password reset completion
├── PasswordResetPageWrapper.tsx
├── PasswordRequirements.tsx  # Password strength indicator
└── PasswordStrengthIndicator.tsx
```

#### Pages

```
src/pages/auth/
├── login.astro      # Login page
├── register.astro   # Registration page
└── reset-password.astro
```

#### Context

```typescript
// src/contexts/AuthContext.tsx
interface AuthContextValue {
  user: User | null;              // Supabase user
  profile: UserProfileDTO | null; // App user profile
  session: Session | null;        // Supabase session
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
```

#### Usage Pattern

```typescript
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, profile, isLoading } = useAuth();
  
  if (isLoading) return <Loader />;
  if (!user) return <LoginPrompt />;
  
  return <div>Welcome {user.email}</div>;
}
```

#### API Endpoints

- `POST /api/users/initialize` - Create user profile after registration
- `GET /api/users/me` - Get current user profile

#### Database Schema

```sql
-- app_users table (see migrations)
CREATE TABLE app_users (
  id UUID PRIMARY KEY,
  auth_uid UUID NOT NULL REFERENCES auth.users(id),
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'trial',
  trial_expires_at TIMESTAMPTZ,
  -- ... more fields
);
```

#### Key Features

- ✅ Email/password authentication
- ✅ Email verification required
- ✅ Password reset flow
- ✅ Session persistence
- ✅ Automatic profile initialization
- ✅ Protected routes via middleware

#### DO NOT MODIFY
- AuthContext logic
- Auth form validation
- Session management
- Supabase client configuration

---

### 2. Subscription Management System

**Status**: ✅ Production-ready  
**Last Modified**: 2026-02-12

#### Services

```
src/services/
├── subscription.service.ts  # Stripe operations
├── user.service.ts          # User CRUD
└── audit.service.ts         # Audit trail logging
```

#### API Endpoints

```
src/pages/api/subscriptions/
├── create-checkout.ts       # POST - Create Stripe Checkout session
├── create-portal.ts         # POST - Create customer portal session
└── status.ts                # GET - Get subscription status
```

#### Subscription Lifecycle

```
Trial (7 days)
  ↓ (user subscribes)
Active
  ↓ (user cancels)
Canceled (still has access until period end)
  ↓ (period ends)
Expired
  ↓ (payment fails)
Past Due
```

#### Database Fields

```typescript
interface UserProfile {
  subscription_status: "trial" | "active" | "canceled" | "expired" | "past_due";
  trial_expires_at: string | null;        // ISO timestamp
  stripe_customer_id: string | null;      // Stripe customer ID
  stripe_subscription_id: string | null;  // Stripe subscription ID
  current_period_end: string | null;      // Next billing date
  plan_id: string | null;                 // Stripe price ID
}
```

#### Usage Pattern

```typescript
// Check subscription status
import { useAuth } from "@/contexts/AuthContext";

function PremiumFeature() {
  const { profile } = useAuth();
  
  const hasAccess = profile?.subscription_status === "active" ||
    (profile?.subscription_status === "trial" && 
     new Date(profile.trial_expires_at!) > new Date());
  
  if (!hasAccess) {
    return <UpgradePrompt />;
  }
  
  return <PremiumContent />;
}
```

#### Stripe Integration

**Checkout Flow**:
1. User clicks "Upgrade" button
2. Frontend calls `POST /api/subscriptions/create-checkout`
3. Backend creates Stripe Checkout session
4. User redirects to Stripe hosted checkout
5. After payment, Stripe sends webhook
6. Webhook updates user subscription_status to "active"

**Customer Portal**:
1. User clicks "Manage Subscription"
2. Frontend calls `POST /api/subscriptions/create-portal`
3. User redirects to Stripe customer portal
4. User can cancel/update subscription
5. Stripe sends webhook on changes
6. Webhook updates subscription status

#### DO NOT MODIFY
- Subscription service logic
- Webhook processing
- Trial calculation
- Stripe API calls

---

### 3. Webhook System

**Status**: ✅ Production-ready  
**Last Modified**: 2026-02-12

#### Webhook Handler

```
src/services/webhook.service.ts
src/pages/api/webhooks/stripe.ts
```

#### Supported Events

```typescript
- checkout.session.completed      // New subscription created
- customer.subscription.created   // Subscription confirmed
- customer.subscription.updated   // Subscription changed
- customer.subscription.deleted   // Subscription canceled
- invoice.payment_succeeded       // Payment successful
- invoice.payment_failed          // Payment failed
```

#### Event Processing Flow

```
Stripe Event → Webhook Endpoint
  ↓
Signature Verification
  ↓
Event Type Routing (webhook.service.ts)
  ↓
Business Logic Processing
  ↓
Database Update
  ↓
Audit Trail Logging
  ↓
Response 200 OK
```

#### Security

- ✅ Stripe signature verification required
- ✅ Idempotent processing (event_id tracking)
- ✅ Audit trail for all changes
- ✅ Error logging

#### Setup Required

1. Create webhook endpoint in Stripe dashboard
2. Point to: `https://yourdomain.com/api/webhooks/stripe`
3. Select events (all subscription-related)
4. Copy webhook signing secret to `.env`

#### DO NOT MODIFY
- Webhook signature verification
- Event processing logic
- Idempotency handling
- Audit trail creation

---

### 4. Database Schema

**Status**: ✅ Production-ready  
**Migrations**: `supabase/migrations/`

#### Tables

**app_users**
```sql
CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'trial',
  trial_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  stripe_subscription_id TEXT,
  current_period_end TIMESTAMPTZ,
  plan_id TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**subscription_audit_log**
```sql
CREATE TABLE subscription_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES app_users(id),
  event_type TEXT NOT NULL,
  event_id TEXT,
  previous_state JSONB,
  new_state JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Row Level Security (RLS)

```sql
-- Users can only read their own data
CREATE POLICY "Users can view own profile"
ON app_users FOR SELECT
USING (auth.uid() = auth_uid);

-- Service role can do everything
-- (webhooks use service role)
```

#### DO NOT MODIFY
- Existing migrations
- RLS policies
- Table structure

#### Adding Custom Fields

If you need custom fields, create NEW migration:

```bash
supabase migration new add_custom_fields
```

```sql
-- supabase/migrations/XXXXXX_add_custom_fields.sql
ALTER TABLE app_users
ADD COLUMN custom_field TEXT;
```

---

### 5. Middleware & Route Protection

**Status**: ✅ Production-ready  
**File**: `src/middleware/index.ts`

#### Protected Routes

```typescript
// Routes requiring auth + active subscription
const PROTECTED_ROUTES: string[] = [
  // Add your premium API endpoints here
];

// Routes requiring auth only (no subscription check)
const AUTH_ONLY_ROUTES = [
  "/api/users",
  "/api/subscriptions"
];

// Public routes (no auth required)
const PUBLIC_ROUTES = [
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/reset-password",
  "/auth/forgot-password"
];
```

#### How It Works

1. Request comes in
2. Middleware checks route type
3. If protected: verify Bearer token
4. If auth required: check user exists
5. If subscription required: check has_access
6. If checks fail: return 401/403
7. If checks pass: continue to handler

#### Usage

Protected API routes automatically check auth:

```typescript
// src/pages/api/my-feature/data.ts
import { getAuthUidAndToken } from "@/lib/auth";

export const GET: APIRoute = async ({ request }) => {
  // This throws if no valid token
  const { uid, token } = await getAuthUidAndToken(request);
  
  // User is authenticated at this point
  // Proceed with your logic
};
```

#### DO NOT MODIFY
- Auth check logic
- Token verification
- Public routes list (except adding your own)

---

## 🔧 CUSTOMIZATION GUIDE

### Where to Add Your Code

#### 1. Dashboard (Main Feature)

**File**: `src/components/dashboard/DashboardView.tsx`

Replace the placeholder section (line ~200):

```tsx
{/* Premium Feature Placeholder */}
<Card className="mt-6 p-8">
  <div className="text-center">
    {/* REPLACE THIS ENTIRE SECTION */}
    <YourMainFeature />
  </div>
</Card>
```

**Example: Add a data grid**

```tsx
import { DataGrid } from "./DataGrid";

// In DashboardView:
<Card className="mt-6 p-6">
  <h2 className="mb-4 text-xl font-semibold">Your Data</h2>
  <DataGrid data={yourData} />
</Card>
```

#### 2. New Protected Pages

Create new routes in `src/pages/`:

```astro
---
// src/pages/analytics.astro
import Layout from "@/layouts/Layout.astro";
import { AppLayout } from "@/components/layout/AppLayout";
import { Header } from "@/components/layout/Header";
import { AvatarMenu } from "@/components/layout/AvatarMenu";
import { AnalyticsView } from "@/components/analytics/AnalyticsView";
import { AuthProvider } from "@/contexts/AuthContext";
---

<Layout title="Analytics - Core Starter">
  <AuthProvider client:load>
    <AppLayout
      client:load
      header={<Header client:only="react" avatarMenu={<AvatarMenu client:only="react" />} />}
    >
      <AnalyticsView client:load />
    </AppLayout>
  </AuthProvider>
</Layout>
```

#### 3. New API Endpoints

Create API routes in `src/pages/api/`:

```typescript
// src/pages/api/data/fetch.ts
import type { APIRoute } from "astro";
import { getAuthUidAndToken } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Verify authentication
    const { uid } = await getAuthUidAndToken(request);
    
    // Your business logic here
    const data = await fetchUserData(uid);
    
    return createSuccessResponse({ data });
  } catch (error) {
    return createErrorResponse(error);
  }
};
```

Add to middleware if premium-only:

```typescript
// src/middleware/index.ts
const PROTECTED_ROUTES: string[] = [
  "/api/data"  // Add your endpoint
];
```

#### 4. Premium Feature Gating

Use subscription status to control access:

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function PremiumAnalytics() {
  const { profile } = useAuth();
  
  // Check subscription
  const hasAccess = profile?.subscription_status === "active";
  
  if (!hasAccess) {
    return (
      <div className="text-center p-8">
        <h3 className="mb-4 text-xl font-semibold">Premium Feature</h3>
        <p className="mb-4 text-muted-foreground">
          Upgrade to access advanced analytics
        </p>
        <Button onClick={() => window.location.href = "/checkout"}>
          Upgrade Now
        </Button>
      </div>
    );
  }
  
  // Premium content
  return <AdvancedAnalytics />;
}
```

#### 5. API Client Usage

Call your API endpoints:

```typescript
import { apiClient } from "@/lib/api-client";

// GET request
const data = await apiClient.get<{ items: Item[] }>(
  "/api/data/fetch"
);

// POST request
const result = await apiClient.post("/api/data/create", {
  name: "Item",
  value: 123
});
```

API client automatically:
- ✅ Adds Bearer token from session
- ✅ Handles JSON encoding/decoding
- ✅ Extracts `data` from response envelope
- ✅ Throws errors on failure

#### 6. Toast Notifications

Show feedback to users:

```typescript
import { useToast } from "@/contexts/ToastContext";

function MyComponent() {
  const { showToast } = useToast();
  
  const handleAction = async () => {
    try {
      await doSomething();
      showToast("Action completed!", "success");
    } catch (error) {
      showToast("Action failed", "error");
    }
  };
}
```

#### 7. Custom Types

Add your types to `src/types/`:

```typescript
// src/types/app.types.ts
export interface CustomData {
  id: string;
  name: string;
  value: number;
  created_at: string;
}

export interface CustomAPIResponse {
  items: CustomData[];
  total: number;
  page: number;
}
```

---

## 📝 COMMON PATTERNS

### Pattern 1: Protected Component

```tsx
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";

export function ProtectedComponent() {
  const { user, profile, isLoading } = useAuth();
  
  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  // Not authenticated
  if (!user) {
    return <div>Please log in</div>;
  }
  
  // No subscription
  if (profile?.subscription_status !== "active") {
    return <UpgradePrompt />;
  }
  
  // Render premium content
  return <Card>Premium Content</Card>;
}
```

### Pattern 2: API Endpoint with Auth

```typescript
// src/pages/api/my-feature.ts
import type { APIRoute } from "astro";
import { getAuthUidAndToken } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get authenticated user
    const { uid } = await getAuthUidAndToken(request);
    
    // Parse request body
    const body = await request.json();
    
    // Validate input
    if (!body.name) {
      throw new Error("Name is required");
    }
    
    // Business logic
    const result = await processData(uid, body);
    
    // Return success
    return createSuccessResponse(result);
    
  } catch (error) {
    return createErrorResponse(error);
  }
};
```

### Pattern 3: Form with Validation

```tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import { apiClient } from "@/lib/api-client";

export function MyForm() {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      showToast("Name is required", "error");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await apiClient.post("/api/my-feature", { name });
      showToast("Success!", "success");
      setName("");
    } catch (error) {
      showToast("Failed to submit", "error");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
}
```

### Pattern 4: Loading States

```tsx
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export function DataDisplay() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await apiClient.get("/api/data");
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data</div>;
  
  return <div>{/* Render data */}</div>;
}
```

---

## 🧪 TESTING

### Unit Tests (Vitest)

Located next to source files: `*.test.ts`

**Example**:

```typescript
// src/lib/utils.test.ts
import { describe, it, expect } from "vitest";
import { formatDate } from "./utils";

describe("formatDate", () => {
  it("formats date correctly", () => {
    const date = "2024-01-15";
    expect(formatDate(date)).toBe("15/01/2024");
  });
});
```

Run tests:
```bash
npm run test        # Watch mode
npm run test:unit   # Run once
```

### E2E Tests (Playwright)

Located in `e2e/` directory.

**Example**:

```typescript
// e2e/my-feature.spec.ts
import { test, expect } from "@playwright/test";
import { loginViaAPI } from "./helpers/auth.helper";

test.describe("My Feature", () => {
  test.beforeEach(async ({ page, context }) => {
    await loginViaAPI(context, "test@example.com", "password");
  });
  
  test("displays data correctly", async ({ page }) => {
    await page.goto("/my-feature");
    await expect(page.getByText("My Data")).toBeVisible();
  });
});
```

Run tests:
```bash
npm run test:e2e        # Run all
npm run test:e2e:ui     # Interactive mode
```

---

## 🚀 DEPLOYMENT

### Build

```bash
npm run build
```

Output: `dist/` directory

### Environment Variables

Set in production:
- `PUBLIC_SUPABASE_URL`
- `PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

⚠️ Use **production** keys, not test keys!

### Stripe Webhook Setup

1. Deploy your app
2. Go to Stripe Dashboard > Webhooks
3. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
4. Select all subscription events
5. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### Database Migrations

```bash
# Connect to production
supabase link --project-ref your-prod-project

# Push migrations
supabase db push
```

---

## 🐛 TROUBLESHOOTING

### Issue: "AuthContext is undefined"

**Cause**: Component not wrapped in AuthProvider  
**Fix**: Ensure component is inside AuthProvider in page:

```astro
<AuthProvider client:load>
  <YourComponent client:load />
</AuthProvider>
```

### Issue: "401 Unauthorized" on API calls

**Cause**: No valid session  
**Fix**: 
1. Check user is logged in
2. Verify token in localStorage
3. Check middleware protection

### Issue: Stripe webhook not working

**Cause**: Invalid webhook secret or signature  
**Fix**:
1. Verify `STRIPE_WEBHOOK_SECRET` is correct
2. Check webhook endpoint URL in Stripe dashboard
3. Test with Stripe CLI: `stripe listen --forward-to localhost:4321/api/webhooks/stripe`

### Issue: TypeScript errors

**Cause**: Missing types or outdated types  
**Fix**:
1. Run `npm run build` to see all errors
2. Generate Supabase types: `supabase gen types typescript --local > src/db/database.types.ts`
3. Check imports

---

## 📚 ADDITIONAL RESOURCES

### Documentation

- **Astro**: https://docs.astro.build
- **React**: https://react.dev
- **TypeScript**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Supabase**: https://supabase.com/docs
- **Stripe**: https://stripe.com/docs

### Code Examples

See existing components for patterns:
- `src/components/auth/AuthForm.tsx` - Form handling
- `src/components/dashboard/DashboardView.tsx` - Layout
- `src/pages/api/subscriptions/create-checkout.ts` - API endpoint

---

## ✅ CHECKLIST FOR NEW FEATURES

Before implementing a new feature, ensure:

- [ ] Understand existing auth system (don't recreate)
- [ ] Understand subscription gating (use `useAuth` hook)
- [ ] Know where to add code (Dashboard, new pages, API endpoints)
- [ ] Follow existing patterns (see examples above)
- [ ] Use TypeScript types properly
- [ ] Handle loading and error states
- [ ] Add toast notifications for feedback
- [ ] Write tests for new functionality
- [ ] Update this guide if adding complex features

---

## 🎯 SUMMARY

**What's Done**:
- ✅ Authentication (complete)
- ✅ Subscriptions (complete)
- ✅ Payments (complete)
- ✅ Database schema (complete)
- ✅ UI components (complete)
- ✅ Testing setup (complete)

**What You Build**:
- 🔧 Dashboard main feature (replace placeholder)
- 🔧 Premium features (using subscription gating)
- 🔧 Custom API endpoints (follow patterns)
- 🔧 Additional pages (follow structure)

**Remember**:
- DO NOT modify core systems
- DO build on top of existing foundation
- DO follow established patterns
- DO refer to this guide when stuck

---

**Need Help?** Check existing code patterns, they're your best examples.
