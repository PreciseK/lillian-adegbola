-- ============================================================
-- Seed download_leadership_guide_url with default value
-- ============================================================

INSERT INTO public.site_settings_la2024 (key, value, created_at, updated_at)
VALUES ('download_leadership_guide_url', '""', now(), now())
ON CONFLICT (key) DO NOTHING;
