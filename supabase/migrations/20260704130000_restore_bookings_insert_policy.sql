-- ============================================================
-- Restore the public booking-submission policy on bookings_la2024
-- The live database had drifted from this repo's migration history
-- (this policy was missing/altered outside of a migration), causing
-- anonymous visitors to get a 401 RLS violation when submitting the
-- public booking form.
-- ============================================================

DROP POLICY IF EXISTS "Anyone can submit booking" ON public.bookings_la2024;
CREATE POLICY "Anyone can submit booking"
  ON public.bookings_la2024 FOR INSERT
  WITH CHECK (true);
