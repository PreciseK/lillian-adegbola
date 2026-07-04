-- ============================================================
-- Add video_url column to courses for preview playback
-- ============================================================

ALTER TABLE public.courses_la2024
  ADD COLUMN IF NOT EXISTS video_url text;
