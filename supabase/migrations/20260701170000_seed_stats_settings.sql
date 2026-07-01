-- ============================================================
-- Seed impact metric settings with default values
-- ============================================================

INSERT INTO public.site_settings_la2024 (key, value, created_at, updated_at)
VALUES 
  ('stat_leaders_transformed', '"500+"', now(), now()),
  ('stat_success_rate', '"95%"', now(), now()),
  ('stat_years_experience', '"15+"', now(), now()),
  ('stat_organizations_served', '"50+"', now(), now())
ON CONFLICT (key) DO NOTHING;
