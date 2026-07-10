-- ============================================================
-- Online/offline meeting support for bookings + Google Calendar
-- OAuth token storage (server-side only, no client RLS policies).
-- ============================================================

ALTER TABLE public.bookings_la2024
  ADD COLUMN IF NOT EXISTS meeting_type text NOT NULL DEFAULT 'offline' CHECK (meeting_type IN ('online', 'offline')),
  ADD COLUMN IF NOT EXISTS meeting_link text;

-- Single-row table holding the site owner's connected Google account.
-- Deliberately has RLS enabled with NO policies at all: anon and
-- authenticated roles get zero access (not even admins, via the API).
-- Only server-side code using the service role key (edge functions)
-- can read or write it, since the service role bypasses RLS entirely.
CREATE TABLE IF NOT EXISTS public.google_calendar_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token text NOT NULL,
  refresh_token text NOT NULL,
  token_expiry timestamptz NOT NULL,
  connected_email text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.google_calendar_tokens ENABLE ROW LEVEL SECURITY;
