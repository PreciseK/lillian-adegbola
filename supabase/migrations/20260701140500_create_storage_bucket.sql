-- ============================================================
-- Create storage bucket for website images
-- Public read access enabled, admin write access enforced.
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('website-images', 'website-images', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- Recreate storage policies to ensure clean setup
-- ============================================================

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow public select" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin insert" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin update" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin delete" ON storage.objects;
END
$$;

-- Allow public read access to anyone
CREATE POLICY "Allow public select" ON storage.objects
  FOR SELECT USING (bucket_id = 'website-images');

-- Allow only authenticated admin users to upload/modify/delete images
CREATE POLICY "Allow admin insert" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'website-images' AND public.is_admin());

CREATE POLICY "Allow admin update" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'website-images' AND public.is_admin());

CREATE POLICY "Allow admin delete" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'website-images' AND public.is_admin());
