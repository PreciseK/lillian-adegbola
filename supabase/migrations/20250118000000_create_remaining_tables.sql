-- Bookings
create table if not exists public.bookings_la2024 (
  id uuid default gen_random_uuid() primary key,
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  company text,
  service_name text not null,
  service_type text,
  appointment_date timestamptz not null,
  appointment_time text not null,
  timezone text not null,
  status text default 'pending',
  message text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Contact Messages
create table if not exists public.contact_messages_la2024 (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  service text,
  message text not null,
  status text default 'unread',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Newsletter Subscribers
create table if not exists public.newsletter_subscribers_la2024 (
  id uuid default gen_random_uuid() primary key,
  email text not null unique,
  source text,
  status text default 'active',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Site Settings
create table if not exists public.site_settings_la2024 (
  key text primary key,
  value text,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.bookings_la2024 enable row level security;
alter table public.contact_messages_la2024 enable row level security;
alter table public.newsletter_subscribers_la2024 enable row level security;
alter table public.site_settings_la2024 enable row level security;

-- Policies (Permissive for now)
drop policy if exists "Enable read access for all users" on public.bookings_la2024;
create policy "Enable read access for all users" on public.bookings_la2024 for select using (true);

drop policy if exists "Enable insert access for all users" on public.bookings_la2024;
create policy "Enable insert access for all users" on public.bookings_la2024 for insert with check (true);

drop policy if exists "Enable update access for all users" on public.bookings_la2024;
create policy "Enable update access for all users" on public.bookings_la2024 for update using (true);

drop policy if exists "Enable delete access for all users" on public.bookings_la2024;
create policy "Enable delete access for all users" on public.bookings_la2024 for delete using (true);

drop policy if exists "Enable read access for all users" on public.contact_messages_la2024;
create policy "Enable read access for all users" on public.contact_messages_la2024 for select using (true);

drop policy if exists "Enable insert access for all users" on public.contact_messages_la2024;
create policy "Enable insert access for all users" on public.contact_messages_la2024 for insert with check (true);

drop policy if exists "Enable update access for all users" on public.contact_messages_la2024;
create policy "Enable update access for all users" on public.contact_messages_la2024 for update using (true);

drop policy if exists "Enable delete access for all users" on public.contact_messages_la2024;
create policy "Enable delete access for all users" on public.contact_messages_la2024 for delete using (true);

drop policy if exists "Enable read access for all users" on public.newsletter_subscribers_la2024;
create policy "Enable read access for all users" on public.newsletter_subscribers_la2024 for select using (true);

drop policy if exists "Enable insert access for all users" on public.newsletter_subscribers_la2024;
create policy "Enable insert access for all users" on public.newsletter_subscribers_la2024 for insert with check (true);

drop policy if exists "Enable update access for all users" on public.newsletter_subscribers_la2024;
create policy "Enable update access for all users" on public.newsletter_subscribers_la2024 for update using (true);

drop policy if exists "Enable delete access for all users" on public.newsletter_subscribers_la2024;
create policy "Enable delete access for all users" on public.newsletter_subscribers_la2024 for delete using (true);

drop policy if exists "Enable read access for all users" on public.site_settings_la2024;
create policy "Enable read access for all users" on public.site_settings_la2024 for select using (true);

drop policy if exists "Enable insert access for all users" on public.site_settings_la2024;
create policy "Enable insert access for all users" on public.site_settings_la2024 for insert with check (true);

drop policy if exists "Enable update access for all users" on public.site_settings_la2024;
create policy "Enable update access for all users" on public.site_settings_la2024 for update using (true);

drop policy if exists "Enable delete access for all users" on public.site_settings_la2024;
create policy "Enable delete access for all users" on public.site_settings_la2024 for delete using (true);
