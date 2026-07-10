-- ============================================================
-- Revised booking plan: admin manually pastes the meeting link
-- (no Google OAuth integration needed), and can record a reason
-- when declining a booking.
-- ============================================================

-- The Google Calendar OAuth token table from the previous plan is no
-- longer needed - meeting links are entered manually by the admin.
DROP TABLE IF EXISTS public.google_calendar_tokens;

ALTER TABLE public.bookings_la2024
  ADD COLUMN IF NOT EXISTS decline_reason text;
