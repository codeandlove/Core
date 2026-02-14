/**
 * MSW Request Handlers
 * Mock API responses for testing
 */

import { http, HttpResponse } from "msw";

export const handlers = [
  // Supabase Auth endpoints
  http.post("https://test.supabase.co/auth/v1/token", () => {
    return HttpResponse.json({
      access_token: "mock-access-token",
      token_type: "bearer",
      expires_in: 3600,
      refresh_token: "mock-refresh-token",
      user: {
        id: "test-user-id",
        email: "test@example.com",
        role: "authenticated",
      },
    });
  }),

  http.get("https://test.supabase.co/auth/v1/user", () => {
    return HttpResponse.json({
      id: "test-user-id",
      email: "test@example.com",
      role: "authenticated",
    });
  }),

  // Stripe endpoints
  http.post("https://api.stripe.com/v1/checkout/sessions", () => {
    return HttpResponse.json({
      id: "cs_test_mock",
      url: "https://checkout.stripe.com/pay/cs_test_mock",
    });
  }),
];
