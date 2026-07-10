-- ============================================================
-- Grant base table privileges on bookings_la2024 to anon/authenticated
-- Row Level Security policies only apply once a role already has the
-- underlying table privilege; bookings_la2024 was missing these
-- grants entirely (unlike every other public-write table), which is
-- why anonymous booking submissions kept failing with a row-level
-- security violation even after the INSERT policy was restored.
-- Fine-grained access is still enforced by the existing RLS policies.
-- ============================================================

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings_la2024 TO anon, authenticated;
