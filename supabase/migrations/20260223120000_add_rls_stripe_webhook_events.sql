-- ============================================================================
-- Migration: RLS Policies for stripe_webhook_events
-- Created: 2026-02-23
-- Purpose: Umożliwia odczyt historii płatności przez zalogowanego użytkownika
--          tylko dla własnych rekordów (user_id = auth.uid())
--          Backend (anon key) zachowuje pełny dostęp do INSERT/UPDATE
-- ============================================================================

-- RLS powinno już być włączone (włączone w initial migration), ale upewniamy się
ALTER TABLE stripe_webhook_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Policy 1: Backend może INSERT dowolne eventy (anon key = service operations)
-- ============================================================================
CREATE POLICY "Allow INSERT for anon (backend webhook processing)"
ON stripe_webhook_events
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- ============================================================================
-- Policy 2: Backend może UPDATE status przetwarzania (anon key)
-- ============================================================================
CREATE POLICY "Allow UPDATE for anon (backend webhook processing)"
ON stripe_webhook_events
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- Policy 3: Użytkownik widzi tylko swoje eventy przez profil API
--           Backend (anon) widzi wszystkie (potrzebne do przetwarzania)
-- ============================================================================
CREATE POLICY "Allow SELECT for own events (authenticated) or all (anon)"
ON stripe_webhook_events
FOR SELECT
TO anon, authenticated
USING (
  -- anon (backend) widzi wszystko
  auth.role() = 'anon'
  OR
  -- authenticated widzi tylko swoje
  user_id = auth.uid()
);

