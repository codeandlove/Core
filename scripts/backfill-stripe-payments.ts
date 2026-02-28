#!/usr/bin/env tsx
/**
 * Stripe Payment History Backfill
 * ================================
 * Pobiera historyczne faktury z Stripe API i wstawia je do stripe_webhook_events
 * w formacie identycznym jak prawdziwe webhooki.
 *
 * Użycie:
 *   npx tsx scripts/backfill-stripe-payments.ts
 *   -- lub --
 *   npm run stripe:backfill
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

// ---------------------------------------------------------------------------
// Load .env (tsx nie ładuje dotenv automatycznie)
// ---------------------------------------------------------------------------
function loadEnv(): void {
  try {
    const envPath = resolve(process.cwd(), ".env");
    const lines = readFileSync(envPath, "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed
        .slice(eqIdx + 1)
        .trim()
        .replace(/^["']|["']$/g, "");
      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    // brak .env — używamy zmiennych z procesu
  }
}

loadEnv();

// ---------------------------------------------------------------------------
// Validate env
// ---------------------------------------------------------------------------
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  const missing = [
    !STRIPE_SECRET_KEY && "STRIPE_SECRET_KEY",
    !SUPABASE_URL && "PUBLIC_SUPABASE_URL",
    !SUPABASE_SERVICE_KEY && "SUPABASE_SERVICE_ROLE_KEY",
  ].filter(Boolean);
  process.stderr.write(
    `❌ Missing required environment variables:\n${missing.map((v) => `   - ${v}`).join("\n")}\n`,
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion,
});

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  process.stdout.write("🔄 Stripe Payment History Backfill\n");
  process.stdout.write("====================================\n");

  // 1. Pobierz użytkowników z stripe_customer_id
  const { data: users, error: usersError } = await supabase
    .from("app_users")
    .select("auth_uid, stripe_customer_id")
    .not("stripe_customer_id", "is", null)
    .is("deleted_at", null);

  if (usersError) {
    process.stderr.write(`❌ Failed to fetch users: ${usersError.message}\n`);
    process.exit(1);
  }

  if (!users || users.length === 0) {
    process.stdout.write("ℹ️  No users with stripe_customer_id found.\n");
    process.stdout.write(
      "   Users get a stripe_customer_id after first checkout.\n",
    );
    process.exit(0);
  }

  process.stdout.write(
    `✅ Found ${users.length} user(s) with Stripe customer IDs\n\n`,
  );

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const user of users) {
    const { auth_uid, stripe_customer_id } = user;
    if (!stripe_customer_id) continue;

    process.stdout.write(
      `👤 Processing customer: ${stripe_customer_id} (user: ${auth_uid})\n`,
    );

    // 2. Pobierz faktury z Stripe
    let invoices: Stripe.Invoice[] = [];
    try {
      const response = await stripe.invoices.list({
        customer: stripe_customer_id,
        limit: 100,
      });
      invoices = response.data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`   ❌ Failed to fetch invoices: ${msg}\n`);
      continue;
    }

    process.stdout.write(`   📄 Found ${invoices.length} invoice(s)\n`);

    for (const invoice of invoices) {
      // Mapuj status na typ eventu
      const eventType: string | null =
        invoice.status === "paid"
          ? "invoice.payment_succeeded"
          : invoice.status === "open" || invoice.status === "uncollectible"
            ? "invoice.payment_failed"
            : null;

      if (!eventType) {
        process.stdout.write(
          `   ⏭️  Skip invoice ${invoice.id} (status: ${invoice.status})\n`,
        );
        totalSkipped++;
        continue;
      }

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
            customer:
              typeof invoice.customer === "string"
                ? invoice.customer
                : invoice.customer?.id,
            subscription:
              typeof invoice.subscription === "string"
                ? invoice.subscription
                : (invoice.subscription as Stripe.Subscription | null)?.id ??
                  null,
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
          process.stdout.write(`   ⏭️  Already exists: ${invoice.id}\n`);
          totalSkipped++;
        } else {
          process.stderr.write(
            `   ❌ Insert error for ${invoice.id}: ${insertError.message}\n`,
          );
        }
      } else {
        const amount = (invoice.amount_paid / 100).toFixed(2);
        const currency = invoice.currency.toUpperCase();
        process.stdout.write(
          `   ✅ Inserted: ${invoice.id} | ${eventType} | ${amount} ${currency}\n`,
        );
        totalInserted++;
      }
    }
    process.stdout.write("\n");
  }

  process.stdout.write("====================================\n");
  process.stdout.write(
    `✅ Done. Inserted: ${totalInserted}, Skipped: ${totalSkipped}\n`,
  );
}

main().catch((err: unknown) => {
  const msg = err instanceof Error ? err.message : String(err);
  process.stderr.write(`❌ Fatal error: ${msg}\n`);
  process.exit(1);
});

