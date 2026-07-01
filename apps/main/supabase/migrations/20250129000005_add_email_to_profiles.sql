-- Add email column to profiles
alter table public.profiles_la2024 add column if not exists email text;

-- Function to handle new user creation and sync email
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles_la2024 (id, email, first_name, last_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update set
    email = excluded.email,
    first_name = coalesce(public.profiles_la2024.first_name, excluded.first_name),
    last_name = coalesce(public.profiles_la2024.last_name, excluded.last_name),
    avatar_url = coalesce(public.profiles_la2024.avatar_url, excluded.avatar_url);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation (if it doesn't already exist, or recreates it)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill email for existing profiles if possible (simplistic approach)
-- Note: We can't easily read auth.users from here in a simple migration without more privileges or specific setup, 
-- but future users will have it. For existing demo users, we might need a separate update or just accept empty for now.
-- In a real scenario, we'd run a script to update this.
