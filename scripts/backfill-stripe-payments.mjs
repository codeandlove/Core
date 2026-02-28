#!/usr/bin/env node
/**
 * Stripe Payment History Backfill
 * ================================
 * Pobiera historyczne faktury z Stripe API i wstawia je do stripe_webhook_events
 * w formacie identycznym jak prawdziwe webhooki.
 *
 * Użycie:
 *   node scripts/backfill-stripe-payments.mjs
 *
 * Wymagane zmienne środowiskowe (z .env):
 *   STRIPE_SECRET_KEY     - klucz Stripe (sk_test_... lub sk_live_...)
 *   SUPABASE_SERVICE_ROLE_KEY
 *   PUBLIC_SUPABASE_URL
 */

import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env manually (no dotenv dependency needed in newer Node)
function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const [key, ...rest] = trimmed.split("=");
      if (key && rest.length > 0) {
        process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    console.log("No .env file found, using existing environment variables");
  }
}

loadEnv();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Missing required environment variables:");
  if (!STRIPE_SECRET_KEY) console.error("   - STRIPE_SECRET_KEY");
  if (!SUPABASE_URL) console.error("   - PUBLIC_SUPABASE_URL");
  if (!SUPABASE_SERVICE_KEY) console.error("   - SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2023-10-16" });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function main() {
  console.log("🔄 Stripe Payment History Backfill");
  console.log("====================================");

  // 1. Pobierz wszystkich użytkowników z stripe_customer_id
  const { data: users, error: usersError } = await supabase
    .from("app_users")
    .select("auth_uid, stripe_customer_id")
    .not("stripe_customer_id", "is", null)
    .is("deleted_at", null);

  if (usersError) {
    console.error("❌ Failed to fetch users:", usersError.message);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    console.log("ℹ️  No users with stripe_customer_id found.");
    console.log("   Users get a stripe_customer_id after first checkout.");
    process.exit(0);
  }

  console.log(`✅ Found ${users.length} user(s) with Stripe customer IDs\n`);

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const user of users) {
    const { auth_uid, stripe_customer_id } = user;
    console.log(`👤 Processing customer: ${stripe_customer_id} (user: ${auth_uid})`);

    // 2. Pobierz faktury z Stripe dla tego klienta
    let invoices: Stripe.Invoice[] = [];
    try {
      const response = await stripe.invoices.list({
        customer: stripe_customer_id,
        limit: 100,
        expand: ["data.subscription"],
      });
      invoices = response.data;
    } catch (err) {
      console.error(`   ❌ Failed to fetch invoices: ${err.message}`);
      continue;
    }

    console.log(`   📄 Found ${invoices.length} invoice(s)`);

    for (const invoice of invoices) {
      // Mapuj status faktury na typ eventu webhookowego
      const eventType =
        invoice.status === "paid"
          ? "invoice.payment_succeeded"
          : invoice.status === "open" || invoice.status === "uncollectible"
          ? "invoice.payment_failed"
          : null;

      if (!eventType) {
        console.log(`   ⏭️  Skip invoice ${invoice.id} (status: ${invoice.status})`);
        totalSkipped++;
        continue;
      }

      // Zbuduj payload identyczny z prawdziwym webhookiem Stripe
      const eventId = `backfill_${invoice.id}`;
      const payload = {
        id: eventId,
        type: eventType,
        created: invoice.created,
        data: {
          object: {
            id: invoice.id,
            amount_paid: invoice.amount_paid,
            currency: invoice.currency,
            customer: invoice.customer,
            subscription: invoice.subscription,
            status: invoice.status,
            hosted_invoice_url: invoice.hosted_invoice_url,
            invoice_pdf: invoice.invoice_pdf,
            number: invoice.number,
            period_start: invoice.period_start,
            period_end: invoice.period_end,
          },
        },
      };

      const { error: insertError } = await supabase
        .from("stripe_webhook_events")
        .insert({
          event_id: eventId,
          payload,
          received_at: new Date(invoice.created * 1000).toISOString(),
          processed_at: new Date(invoice.created * 1000).toISOString(),
          status: "processed",
          user_id: auth_uid,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          // unique violation — już istnieje
          console.log(`   ⏭️  Already exists: ${invoice.id}`);
          totalSkipped++;
        } else {
          console.error(`   ❌ Insert error for ${invoice.id}:`, insertError.message);
        }
      } else {
        console.log(`   ✅ Inserted: ${invoice.id} | ${eventType} | ${(invoice.amount_paid / 100).toFixed(2)} ${invoice.currency.toUpperCase()}`);
        totalInserted++;
      }
    }
    console.log();
  }

  console.log("====================================");
  console.log(`✅ Done. Inserted: ${totalInserted}, Skipped: ${totalSkipped}`);
}

main().catch((err) => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});

