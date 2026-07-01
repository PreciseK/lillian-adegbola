-- ============================================================
-- Ensure profiles table has email column and upgrade new user trigger
-- ============================================================

-- Ensure the email column exists on profiles
ALTER TABLE public.profiles_la2024 ADD COLUMN IF NOT EXISTS email text;

-- Upgrade handle_new_user function with robust name parsing and null-safety
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  meta jsonb;
  f_name text;
  l_name text;
  full_nm text;
BEGIN
  meta := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  
  f_name := meta->>'first_name';
  l_name := meta->>'last_name';
  full_nm := meta->>'full_name';
  
  -- If first/last names are missing but full name is provided, parse it
  IF f_name IS NULL AND full_nm IS NOT NULL THEN
    f_name := split_part(full_nm, ' ', 1);
    l_name := substring(full_nm FROM position(' ' in full_nm) + 1);
    IF l_name = f_name THEN
      l_name := NULL;
    END IF;
  END IF;

  INSERT INTO public.profiles_la2024 (id, email, first_name, last_name, avatar_url)
  VALUES (
    new.id,
    coalesce(new.email, ''),
    coalesce(f_name, ''),
    coalesce(l_name, ''),
    coalesce(meta->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = excluded.email,
    first_name = CASE WHEN public.profiles_la2024.first_name IS NULL OR public.profiles_la2024.first_name = '' THEN excluded.first_name ELSE public.profiles_la2024.first_name END,
    last_name = CASE WHEN public.profiles_la2024.last_name IS NULL OR public.profiles_la2024.last_name = '' THEN excluded.last_name ELSE public.profiles_la2024.last_name END,
    avatar_url = CASE WHEN public.profiles_la2024.avatar_url IS NULL OR public.profiles_la2024.avatar_url = '' THEN excluded.avatar_url ELSE public.profiles_la2024.avatar_url END;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
