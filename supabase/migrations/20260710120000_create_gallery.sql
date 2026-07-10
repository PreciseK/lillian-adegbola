-- ============================================================
-- Gallery: photo/video items table, dedicated storage bucket,
-- and a storage-usage RPC for the admin quota meter.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.gallery_items_la2024 (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('image', 'video')),
  title text,
  caption text,
  image_url text,
  video_url text,
  thumbnail_url text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT gallery_items_media_check CHECK (
    (type = 'image' AND image_url IS NOT NULL) OR
    (type = 'video' AND video_url IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS gallery_items_published_idx
  ON public.gallery_items_la2024 (is_published, sort_order, created_at DESC);

ALTER TABLE public.gallery_items_la2024 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published gallery items" ON public.gallery_items_la2024;
DROP POLICY IF EXISTS "Admin manage gallery items" ON public.gallery_items_la2024;

CREATE POLICY "Public read published gallery items"
  ON public.gallery_items_la2024 FOR SELECT
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Admin manage gallery items"
  ON public.gallery_items_la2024 FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================
-- Storage bucket for gallery images (photos only — videos are
-- stored as external URLs, never uploaded).
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('gallery-images', 'gallery-images', true, 5242880, ARRAY['image/*'])
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Allow public select gallery images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin insert gallery images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin update gallery images" ON storage.objects;
  DROP POLICY IF EXISTS "Allow admin delete gallery images" ON storage.objects;
END
$$;

CREATE POLICY "Allow public select gallery images" ON storage.objects
  FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY "Allow admin insert gallery images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery-images' AND public.is_admin());

CREATE POLICY "Allow admin update gallery images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'gallery-images' AND public.is_admin());

CREATE POLICY "Allow admin delete gallery images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'gallery-images' AND public.is_admin());

-- ============================================================
-- Storage usage RPC — sums bytes used in the gallery-images
-- bucket so the admin panel can enforce the 2GB quota without
-- listing every object client-side.
-- ============================================================

CREATE OR REPLACE FUNCTION public.gallery_storage_usage_bytes()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT CASE WHEN public.is_admin() THEN
    COALESCE((
      SELECT SUM((metadata->>'size')::bigint)
      FROM storage.objects
      WHERE bucket_id = 'gallery-images'
    ), 0)
  ELSE 0 END;
$$;

GRANT EXECUTE ON FUNCTION public.gallery_storage_usage_bytes() TO authenticated;
