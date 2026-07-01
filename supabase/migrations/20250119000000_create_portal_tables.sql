-- Profiles Table (Extension of auth.users)
create table if not exists public.profiles_la2024 (
  id uuid references auth.users on delete cascade not null primary key,
  first_name text,
  last_name text,
  avatar_url text,
  membership_tier text default 'basic',
  bio text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Courses Table
create table if not exists public.courses_la2024 (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  category text,
  instructor text,
  price numeric,
  original_price numeric,
  rating numeric default 0,
  students_count int default 0,
  duration text,
  lessons_count int default 0,
  level text,
  image_url text,
  is_featured boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Shop Products Table
create table if not exists public.products_la2024 (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  category text,
  price numeric not null,
  original_price numeric,
  rating numeric default 0,
  reviews_count int default 0,
  image_url text,
  is_bestseller boolean default false,
  in_stock boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- User Goals Table
create table if not exists public.goals_la2024 (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles_la2024(id) on delete cascade not null,
  title text not null,
  description text,
  category text,
  priority text,
  progress int default 0,
  target_date timestamptz,
  status text default 'in-progress',
  milestones jsonb default '[]'::jsonb, -- Store milestones as JSON array
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Community Posts Table
create table if not exists public.community_posts_la2024 (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles_la2024(id) on delete cascade not null,
  title text not null,
  content text not null,
  category text,
  likes_count int default 0,
  replies_count int default 0,
  views_count int default 0,
  is_trending boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS Settings
alter table public.profiles_la2024 enable row level security;
alter table public.courses_la2024 enable row level security;
alter table public.products_la2024 enable row level security;
alter table public.goals_la2024 enable row level security;
alter table public.community_posts_la2024 enable row level security;

-- Permissive Policies (Review for Production)
drop policy if exists "Public profiles are viewable by everyone" on public.profiles_la2024;
create policy "Public profiles are viewable by everyone" on public.profiles_la2024 for select using (true);

drop policy if exists "Users can insert their own profile" on public.profiles_la2024;
create policy "Users can insert their own profile" on public.profiles_la2024 for insert with check ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles_la2024;
create policy "Users can update own profile" on public.profiles_la2024 for update using ((select auth.uid()) = id);

drop policy if exists "Courses are viewable by everyone" on public.courses_la2024;
create policy "Courses are viewable by everyone" on public.courses_la2024 for select using (true);

drop policy if exists "Admins can insert courses" on public.courses_la2024;
create policy "Admins can insert courses" on public.courses_la2024 for insert with check (true); -- Ideally restrict to admin role

drop policy if exists "Admins can update courses" on public.courses_la2024;
create policy "Admins can update courses" on public.courses_la2024 for update using (true);

drop policy if exists "Products are viewable by everyone" on public.products_la2024;
create policy "Products are viewable by everyone" on public.products_la2024 for select using (true);

drop policy if exists "Admins can insert products" on public.products_la2024;
create policy "Admins can insert products" on public.products_la2024 for insert with check (true);

drop policy if exists "Admins can update products" on public.products_la2024;
create policy "Admins can update products" on public.products_la2024 for update using (true);

drop policy if exists "Users can view own goals" on public.goals_la2024;
create policy "Users can view own goals" on public.goals_la2024 for select using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own goals" on public.goals_la2024;
create policy "Users can insert own goals" on public.goals_la2024 for insert with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own goals" on public.goals_la2024;
create policy "Users can update own goals" on public.goals_la2024 for update using ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own goals" on public.goals_la2024;
create policy "Users can delete own goals" on public.goals_la2024 for delete using ((select auth.uid()) = user_id);

drop policy if exists "Community posts are viewable by everyone" on public.community_posts_la2024;
create policy "Community posts are viewable by everyone" on public.community_posts_la2024 for select using (true);

drop policy if exists "Users can insert posts" on public.community_posts_la2024;
create policy "Users can insert posts" on public.community_posts_la2024 for insert with check ((select auth.uid()) = author_id);

drop policy if exists "Users can update own posts" on public.community_posts_la2024;
create policy "Users can update own posts" on public.community_posts_la2024 for update using ((select auth.uid()) = author_id);
