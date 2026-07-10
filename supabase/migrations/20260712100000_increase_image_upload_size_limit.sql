-- ============================================================
-- Raise the per-file upload size limit on both image buckets from
-- 5MB to 15MB. Modern phone photos and uncompressed PNG screenshots
-- routinely exceed 5MB, and admins were hitting a raw storage error
-- ("The object exceeded the maximum allowed size") with no
-- indication of what the actual limit was.
-- ============================================================

UPDATE storage.buckets SET file_size_limit = 15728640 WHERE id = 'website-images';
UPDATE storage.buckets SET file_size_limit = 15728640 WHERE id = 'gallery-images';
