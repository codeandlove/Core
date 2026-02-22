# Core Starter

## Project Description

**Core Starter** is a production-ready SaaS foundation that provides complete authentication, subscription management, and payment processing out of the box. Built with modern technologies and best practices, it allows you to focus on your unique features instead of rebuilding the same infrastructure for every project.

Perfect for rapid prototyping, MVPs, and production applications.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Core Systems (Do Not Modify)](#core-systems-do-not-modify)
- [Customization Guide](#customization-guide)
- [Testing](#testing)
- [Deployment](#deployment)
- [AI Context](#ai-context)
- [License](#license)

---

## Features

### ✅ Complete & Production-Ready

- **🔐 Authentication System**
  - User registration with email verification
  - Login/logout with session management
  - Password reset and forgot password flows
  - Protected routes via middleware
  - Supabase Auth integration

- **💳 Subscription & Payments**
  - Stripe Checkout integration
  - 7-day free trial management
  - Subscription lifecycle handling (active, canceled, past_due, expired)
  - Webhook processing for real-time updates
  - Customer portal for subscription management

- **📊 User Dashboard**
  - Subscription status display
  - Account information
  - Premium feature placeholders
  - Responsive design (mobile, tablet, desktop)

- **🎨 Modern UI**
  - shadcn/ui components (accessible & customizable)
  - Tailwind CSS for styling
  - Toast notifications
  - Loading states and error handling
  - Dark mode with theme toggle and persistence

- **⚡ Developer Experience**
  - TypeScript for type safety
  - ESLint + Prettier for code quality
  - Hot module replacement in dev mode
  - Comprehensive testing setup (Vitest + Playwright)

---

## Tech Stack

| Category            | Technology          | Version |
| ------------------- | ------------------- | ------- |
| **Framework**       | Astro               | 5.x     |
| **UI Library**      | React               | 19.x    |
| **Language**        | TypeScript          | 5.8.x   |
| **Styling**         | Tailwind CSS        | 4.x     |
| **Components**      | shadcn/ui           | Latest  |
| **Authentication**  | Supabase Auth       | Latest  |
| **Database**        | Supabase PostgreSQL | Latest  |
| **Payments**        | Stripe              | Latest  |
| **Testing**         | Vitest + Playwright | Latest  |
| **Package Manager** | npm                 | Latest  |

---

## Getting Started

### Prerequisites

- **Node.js** (version 22.14.0 - see `.nvmrc`)
- **npm** (comes with Node.js)
- **Supabase account** (free tier available)
- **Stripe account** (test mode for development)

### Quick Start

**1. Install Node.js version**

```bash
nvm install
nvm use
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Fill in your credentials (see [Environment Variables](#environment-variables) section).

**4. Run Supabase migrations**

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

**5. Start development server**

```bash
npm run dev
```

Visit `http://localhost:4321` to see your app!

---

## Project Structure

```
Core/
├── src/
│   ├── components/          # React components
│   │   ├── auth/           # Authentication forms
│   │   ├── account/        # Account management
│   │   ├── checkout/       # Checkout flow
│   │   ├── dashboard/      # Dashboard view (CUSTOMIZE HERE)
│   │   ├── layout/         # Layout components (Header, AppLayout)
│   │   └── ui/             # UI primitives (shadcn/ui)
│   │
│   ├── contexts/           # React Contexts
│   │   ├── AuthContext.tsx # User session management
│   │   ├── ToastContext.tsx # Toast notifications
│   │   └── ErrorBoundary.tsx # Error handling
│   │
│   ├── db/                 # Database
│   │   ├── database.types.ts # Supabase types
│   │   └── supabase.client.ts # Supabase client
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useAuth.ts      # Auth hook
│   │
│   ├── layouts/            # Astro layouts
│   │   └── Layout.astro    # Base layout
│   │
│   ├── lib/                # Utilities & helpers
│   │   ├── api-service.ts  # API calls
│   │   ├── auth.ts         # Auth utilities
│   │   ├── stripe.ts       # Stripe integration
│   │   └── utils.ts        # General utilities
│   │
│   ├── middleware/         # Astro middleware
│   │   └── index.ts        # Auth & route protection
│   │
│   ├── pages/              # Routes (Astro pages)
│   │   ├── index.astro     # Landing page
│   │   ├── dashboard.astro # Main app view (CUSTOMIZE HERE)
│   │   ├── auth/           # Auth pages
│   │   ├── checkout/       # Checkout pages
│   │   └── api/            # API endpoints
│   │       ├── subscriptions/ # Stripe integration
│   │       ├── users/      # User management
│   │       └── webhooks/   # Stripe webhooks
│   │
│   ├── services/           # Business logic
│   │   ├── subscription.service.ts
│   │   ├── user.service.ts
│   │   └── webhook.service.ts
│   │
│   ├── styles/
│   │   └── global.css      # Global styles
│   │
│   ├── test/               # Unit tests setup (Vitest)
│   │   ├── mocks/          # Mock handlers (MSW)
│   │   └── setup.ts        # Test configuration
│   │
│   └── types/              # TypeScript types
│       ├── subscription.types.ts
│       ├── ui.types.ts
│       └── webhook.types.ts
│
├── supabase/
│   └── migrations/         # Database migrations (DO NOT MODIFY)
│
├── e2e/                    # E2E tests (Playwright)
│   ├── auth.spec.ts        # Auth flow tests
│   ├── stripe.spec.ts      # Stripe integration tests
│   ├── dashboard.spec.ts   # Dashboard tests
│   ├── landing.spec.ts     # Landing page tests
│   └── helpers.ts          # Test helpers
│
├── public/                 # Static assets
├── astro.config.mjs        # Astro configuration
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── STARTER_GUIDE.md        # Detailed guide for AI
```

---

## Environment Variables

Create a `.env` file with the following variables:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Custom API Integration (Add your own)
# CUSTOM_API_URL=
# CUSTOM_API_KEY=
```

### How to Get API Keys

**Supabase:**

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings > API
4. Copy `URL` and `anon public` key
5. Copy `service_role` key (keep secret!)

**Stripe:**

1. Go to [stripe.com](https://stripe.com)
2. Create an account (use test mode)
3. Go to Developers > API Keys
4. Copy `Publishable key` and `Secret key`
5. Set up webhook endpoint in Stripe dashboard
6. Copy webhook signing secret

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format with Prettier

# Testing
npm run test             # Run unit tests (watch mode)
npm run test:unit        # Run unit tests once
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests
npm run test:e2e:ui      # Run E2E tests with UI
npm run test:e2e:debug   # Debug E2E tests
```

---

## Core Systems (Do Not Modify)

These systems are **production-ready** and should **not be modified** unless you have a specific reason:

### 1. Authentication System

- **Files**: `src/components/auth/*`, `src/contexts/AuthContext.tsx`, `src/pages/auth/*`
- **What it does**: Complete user registration, login, password reset, email verification
- **Status**: ✅ Production-ready

### 2. Subscription Management

- **Files**: `src/services/subscription.service.ts`, `src/pages/api/subscriptions/*`
- **What it does**: Stripe checkout, trial management, subscription lifecycle
- **Status**: ✅ Production-ready

### 3. Webhook Handling

- **Files**: `src/services/webhook.service.ts`, `src/pages/api/webhooks/stripe.ts`
- **What it does**: Real-time subscription updates from Stripe
- **Status**: ✅ Production-ready

### 4. Database Schema

- **Files**: `supabase/migrations/*`
- **What it does**: User profiles, subscription data, audit trails
- **Status**: ✅ Production-ready

### 5. Middleware

- **Files**: `src/middleware/index.ts`
- **What it does**: Route protection, authentication checks
- **Status**: ✅ Production-ready

---

## Customization Guide

### Where to Add Your Code

#### 1. **Main Feature (Premium Content)**

**Location**: `src/components/dashboard/DashboardView.tsx`

Replace the placeholder section with your main feature:

```tsx
{
  /* Premium Feature Placeholder */
}
<Card className="mt-6 p-8">
  {/* REPLACE THIS SECTION WITH YOUR FEATURE */}
  <YourCustomFeature />
</Card>;
```

#### 2. **New Protected Routes**

Create new pages in `src/pages/`:

```astro
---
// src/pages/my-feature.astro
import Layout from "@/layouts/Layout.astro";
import { MyFeatureComponent } from "@/components/my-feature/MyFeatureComponent";
---

<Layout title="My Feature">
  <MyFeatureComponent client:load />
</Layout>
```

Add to middleware protection in `src/middleware/index.ts`:

```typescript
const PROTECTED_ROUTES = ["/api/my-feature"];
```

#### 3. **New API Endpoints**

Create API routes in `src/pages/api/`:

```typescript
// src/pages/api/my-feature/data.ts
import type { APIRoute } from "astro";
import { getAuthUidAndToken } from "@/lib/auth";

export const GET: APIRoute = async ({ request }) => {
  const { uid, token } = await getAuthUidAndToken(request);

  // Your API logic here

  return new Response(JSON.stringify({ data: result }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
```

#### 4. **Premium Feature Gating**

Use subscription status to gate features:

```tsx
import { useAuth } from "@/contexts/AuthContext";

export function PremiumFeature() {
  const { profile } = useAuth();

  if (profile?.subscription_status !== "active") {
    return <UpgradePrompt />;
  }

  return <YourPremiumContent />;
}
```

### Best Practices

- ✅ Keep auth/subscription code untouched
- ✅ Use `useAuth()` hook for user data
- ✅ Follow existing component patterns
- ✅ Add your types to `src/types/`
- ✅ Write tests for new features
- ✅ Use toast notifications for feedback
- ❌ Don't modify core services
- ❌ Don't change database migrations
- ❌ Don't bypass middleware protection

---

## Testing

### Unit Tests (Vitest)

Located in `src/test/` for setup and `src/**/*.test.ts` for test files.

```bash
npm run test              # Watch mode
npm run test:unit         # Run once
npm run test:coverage     # With coverage
```

**Test Structure:**

- `src/test/setup.ts` - Global test configuration
- `src/test/mocks/` - Mock Service Worker handlers
- `*.test.ts` - Co-located with source files

### E2E Tests (Playwright)

Located in `e2e/` directory - separate from unit tests.

```bash
npm run test:e2e          # Run all E2E tests
npm run test:e2e:ui       # Interactive mode
npm run test:e2e:debug    # Debug mode
```

**Test Files:**

- `e2e/auth.spec.ts` - Registration, login, logout, password reset
- `e2e/stripe.spec.ts` - Checkout, subscriptions, webhooks
- `e2e/dashboard.spec.ts` - Dashboard layout, navigation, settings
- `e2e/landing.spec.ts` - Landing page, header, footer
- `e2e/helpers.ts` - Shared test utilities

### Adding New Tests

**Unit Tests:** Create `*.test.ts` files next to your source code.

**E2E Tests:** Add new spec files in `e2e/` directory following existing patterns.

---

## Theme System

The application supports light and dark color modes with automatic system preference detection and user preference persistence.

### Using Theme in Components

```tsx
import { useTheme } from "@/contexts/ThemeContext";

function MyComponent() {
  const { theme, toggleTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={() => setTheme("dark")}>Dark Mode</button>
      <button onClick={() => setTheme("light")}>Light Mode</button>
    </div>
  );
}
```

### Theme API

The `useTheme()` hook provides:

- `theme: "light" | "dark"` - Current active theme
- `setTheme(theme)` - Set theme explicitly
- `toggleTheme()` - Toggle between light and dark

### Color Variables

All colors use CSS variables defined in `src/styles/global.css`. Always use CSS variables instead of hardcoded colors:

```tsx
// ✅ Good - Uses theme variables
<div className="bg-background text-foreground border-border">

// ❌ Bad - Hardcoded colors
<div className="bg-white text-black border-gray-200">
```

### Theme Toggle Placement

The `ThemeToggle` component can be placed anywhere:

```tsx
import { ThemeToggle } from "@/components/layout/ThemeToggle";

<ThemeToggle />;
```

### Theme Persistence

Theme preference is automatically saved to `localStorage` and persists across sessions. On first visit, the app detects system color scheme preference (`prefers-color-scheme`).

---

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Environment Setup

Ensure all production environment variables are set:

- Use production Supabase project
- Use live Stripe keys (not test mode)
- Set up Stripe webhook endpoint pointing to your domain

### Recommended Platforms

- **DigitalOcean** (Docker deployment)
- **Vercel** (automatic deployments)
- **Netlify** (edge functions support)
- **Railway** (simple Docker deployment)

### Docker Deployment

See `ecosystem.config.cjs` for PM2 configuration (if using Docker).

---

## AI Context

### 🤖 Important Information for AI Assistants

**This is a PRODUCTION-READY starter project.**

#### What's Already Built (DO NOT RECREATE):

1. ✅ **Complete authentication system** - Registration, login, password reset, email verification
2. ✅ **Subscription management** - Stripe integration, trial handling, webhooks
3. ✅ **Payment processing** - Checkout flow, customer portal, subscription lifecycle
4. ✅ **Database schema** - User profiles, subscriptions, audit trails
5. ✅ **Protected routes** - Middleware authentication and authorization
6. ✅ **UI components** - Full shadcn/ui library with custom components
7. ✅ **Testing infrastructure** - Unit tests (Vitest) and E2E tests (Playwright)

#### Where to Implement New Features:

1. **Main Feature**: `src/components/dashboard/DashboardView.tsx` - Replace placeholder
2. **New Routes**: `src/pages/your-feature.astro` - Create new pages
3. **API Endpoints**: `src/pages/api/your-feature/` - Add new API routes
4. **Premium Logic**: Use `useAuth()` hook to check `subscription_status`

#### Key Principles:

- **DO NOT modify** core auth/subscription/webhook code
- **DO NOT recreate** existing infrastructure
- **DO** build on top of existing foundation
- **DO** follow established patterns and structure
- **DO** refer to `STARTER_GUIDE.md` for detailed architecture

#### Common Patterns:

```typescript
// Access user data
import { useAuth } from "@/contexts/AuthContext";
const { user, profile } = useAuth();

// Check subscription
if (profile?.subscription_status === "active") {
  // Premium feature
}

// Protected API route
const { uid } = await getAuthUidAndToken(request);

// Show notification
import { useToast } from "@/contexts/ToastContext";
const { showToast } = useToast();
showToast("Success!", "success");
```

For complete architecture details, see **STARTER_GUIDE.md**.

---

## License

MIT License - Feel free to use this starter for any project.

---

## Support

For detailed implementation guide and architecture documentation, see **STARTER_GUIDE.md**.

For issues or questions, check the existing code patterns and follow the established conventions.
