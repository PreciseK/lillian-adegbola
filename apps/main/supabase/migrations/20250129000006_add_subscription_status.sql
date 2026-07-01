-- Add subscription_status column to profiles
alter table public.profiles_la2024 add column if not exists subscription_status text default 'active';
