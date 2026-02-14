/**
 * API Service Functions
 * High-level functions for API calls
 * Core Starter - Stripe & User management only
 */

import { apiClient, API_ENDPOINTS } from "./api-client";
import type { UserProfileDTO } from "@/types/types";

/**
 * Fetch user profile
 */
export async function fetchUserProfile(): Promise<UserProfileDTO> {
  const url = API_ENDPOINTS.userProfile();
  return apiClient.get<UserProfileDTO>(url);
}

/**
 * Initialize new user with trial
 */
export async function initializeUser(authUid: string, email?: string) {
  const url = API_ENDPOINTS.initializeUser();
  return apiClient.post(url, { auth_uid: authUid, email }, { skipAuth: true });
}

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(priceId: string) {
  const url = API_ENDPOINTS.createCheckout();
  return apiClient.post(url, { price_id: priceId });
}

/**
 * Create Stripe portal session
 */
export async function createPortalSession(returnUrl?: string) {
  const url = API_ENDPOINTS.createPortal();
  return apiClient.post(url, { return_url: returnUrl || window.location.href });
}

/**
 * Get subscription status
 */
export async function getSubscriptionStatus() {
  const url = API_ENDPOINTS.subscriptionStatus();
  return apiClient.get(url);
}

// ============================================
// PLACEHOLDER: Add your custom API functions here
// ============================================

/**
 * Example: Fetch your custom data
 *
 * export async function fetchMyData(params: MyParams): Promise<MyResponse> {
 *   const url = API_ENDPOINTS.myCustomEndpoint(params);
 *   return apiClient.get<MyResponse>(url);
 * }
 */
