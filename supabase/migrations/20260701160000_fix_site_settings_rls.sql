-- ============================================================
-- Fix site_settings_la2024 Row Level Security (RLS) policies
-- Allow anyone to read settings, but restrict writes to admins.
-- ============================================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Admin manage site settings" ON public.site_settings_la2024;
  DROP POLICY IF EXISTS "Enable read access for all users" ON public.site_settings_la2024;
  DROP POLICY IF EXISTS "Enable insert access for all users" ON public.site_settings_la2024;
  DROP POLICY IF EXISTS "Enable update access for all users" ON public.site_settings_la2024;
  DROP POLICY IF EXISTS "Enable delete access for all users" ON public.site_settings_la2024;
END
$$;

-- Allow public read access to anyone (visitors need to load titles/logos/socials)
CREATE POLICY "Enable read access for all users"
  ON public.site_settings_la2024 FOR SELECT
  USING (true);

-- Restrict insert, update, and delete access to authenticated administrators
CREATE POLICY "Admin manage site settings"
  ON public.site_settings_la2024 FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
