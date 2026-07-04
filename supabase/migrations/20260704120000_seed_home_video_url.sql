-- ============================================================
-- Seed home_video_url with default value
-- Prevents anonymous visitors from triggering a failed client-side
-- insert attempt (RLS restricts writes on this table to admins).
-- ============================================================

INSERT INTO public.site_settings_la2024 (key, value, created_at, updated_at)
VALUES ('home_video_url', '""', now(), now())
ON CONFLICT (key) DO NOTHING;
