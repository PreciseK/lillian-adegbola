-- ============================================================
-- Give admin privileges to user ID
-- ============================================================

UPDATE public.profiles_la2024
SET role = 'admin'
WHERE id = 'USER ID';
