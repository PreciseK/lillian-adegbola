-- ============================================================
-- Seed discover_story_content and discover_story_images defaults
-- Prevents anonymous visitors from triggering a failed client-side
-- insert attempt (RLS restricts writes on site_settings_la2024 to
-- admins), same issue previously hit by home_video_url.
-- ============================================================

INSERT INTO public.site_settings_la2024 (key, value, created_at, updated_at)
VALUES
  ('discover_story_content', '""', now(), now()),
  ('discover_story_images', '[]', now(), now())
ON CONFLICT (key) DO NOTHING;
