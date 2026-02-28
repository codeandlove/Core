-- ============================================================================
-- Seed: Testowe dane historii płatności w stripe_webhook_events
-- Użycie: Wklej do Supabase SQL Editor i podmień USER_AUTH_UID
--
-- Skąd wziąć USER_AUTH_UID:
--   Supabase Dashboard → Authentication → Users → skopiuj UUID zalogowanego użytkownika
--   LUB: SELECT auth_uid FROM app_users WHERE ... LIMIT 1;
-- ============================================================================

DO $$
DECLARE
  -- ❗ PODMIEŃ na prawdziwy auth_uid użytkownika testowego
  v_user_id uuid := 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
BEGIN
  -- Sprawdź czy użytkownik istnieje
  IF NOT EXISTS (SELECT 1 FROM app_users WHERE auth_uid = v_user_id) THEN
    RAISE EXCEPTION 'User % not found in app_users. Update v_user_id.', v_user_id;
  END IF;

  -- Wstaw testowe eventy płatności
  INSERT INTO stripe_webhook_events (event_id, payload, received_at, processed_at, status, user_id)
  VALUES
    (
      'evt_test_001_succeeded',
      '{
        "id": "evt_test_001_succeeded",
        "type": "invoice.payment_succeeded",
        "data": {
          "object": {
            "id": "in_test_001",
            "amount_paid": 4900,
            "currency": "pln",
            "customer": "cus_test_001",
            "subscription": "sub_test_001",
            "status": "paid"
          }
        }
      }'::jsonb,
      now() - interval '5 days',
      now() - interval '5 days',
      'processed',
      v_user_id
    ),
    (
      'evt_test_002_succeeded',
      '{
        "id": "evt_test_002_succeeded",
        "type": "invoice.payment_succeeded",
        "data": {
          "object": {
            "id": "in_test_002",
            "amount_paid": 4900,
            "currency": "pln",
            "customer": "cus_test_001",
            "subscription": "sub_test_001",
            "status": "paid"
          }
        }
      }'::jsonb,
      now() - interval '35 days',
      now() - interval '35 days',
      'processed',
      v_user_id
    ),
    (
      'evt_test_003_failed',
      '{
        "id": "evt_test_003_failed",
        "type": "invoice.payment_failed",
        "data": {
          "object": {
            "id": "in_test_003",
            "amount_paid": 0,
            "currency": "pln",
            "customer": "cus_test_001",
            "subscription": "sub_test_001",
            "status": "open"
          }
        }
      }'::jsonb,
      now() - interval '65 days',
      now() - interval '65 days',
      'processed',
      v_user_id
    ),
    (
      'evt_test_004_succeeded',
      '{
        "id": "evt_test_004_succeeded",
        "type": "invoice.payment_succeeded",
        "data": {
          "object": {
            "id": "in_test_004",
            "amount_paid": 4900,
            "currency": "pln",
            "customer": "cus_test_001",
            "subscription": "sub_test_001",
            "status": "paid"
          }
        }
      }'::jsonb,
      now() - interval '95 days',
      now() - interval '95 days',
      'processed',
      v_user_id
    )
  ON CONFLICT (event_id) DO NOTHING;

  RAISE NOTICE 'Seed complete: % payment events inserted for user %',
    (SELECT COUNT(*) FROM stripe_webhook_events WHERE user_id = v_user_id),
    v_user_id;
END $$;

