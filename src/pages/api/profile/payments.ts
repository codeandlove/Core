/**
 * GET /api/profile/payments
 * Returns payment history for the authenticated user
 */
import type { APIRoute } from "astro";
import { ProfileService } from "@/services/profile.service";
import { getAuthUid } from "@/lib/auth";
import { createSuccessResponse, createErrorResponse } from "@/lib/api-utils";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const { supabase } = locals;

  const authUid = await getAuthUid(request, supabase);
  if (!authUid) {
    return createErrorResponse("Unauthorized", 401, "Valid session required");
  }

  const profileService = new ProfileService(supabase);
  const payments = await profileService.getPaymentHistory(authUid);

  return createSuccessResponse({ payments }, 200);
};
