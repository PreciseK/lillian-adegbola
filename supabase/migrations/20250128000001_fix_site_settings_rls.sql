-- Ensure RLS is enabled
ALTER TABLE IF EXISTS public.site_settings_la2024 ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to start fresh
DROP POLICY IF EXISTS "Enable read access for all users" ON public.site_settings_la2024;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.site_settings_la2024;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.site_settings_la2024;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.site_settings_la2024;

-- Re-create permissive policies for development/initialization
CREATE POLICY "Enable read access for all users" ON public.site_settings_la2024 FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON public.site_settings_la2024 FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON public.site_settings_la2024 FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON public.site_settings_la2024 FOR DELETE USING (true);
