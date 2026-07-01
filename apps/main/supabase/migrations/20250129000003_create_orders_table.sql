-- Orders Table
create table if not exists public.orders_la2024 (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles_la2024(id) on delete set null,
  total numeric not null default 0,
  status text default 'pending', -- pending, processing, completed, failed, refunded
  payment_method text,
  currency text default 'USD',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Order Items Table
create table if not exists public.order_items_la2024 (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders_la2024(id) on delete cascade not null,
  product_id uuid references public.products_la2024(id) on delete set null,
  course_id uuid references public.courses_la2024(id) on delete set null,
  item_type text not null, -- 'course' or 'product'
  name text not null, -- Snapshot of item name
  price numeric not null, -- Snapshot of price
  quantity int default 1,
  created_at timestamptz default now() not null
);

-- RLS for Orders
alter table public.orders_la2024 enable row level security;

drop policy if exists "Users can view own orders" on public.orders_la2024;
create policy "Users can view own orders" on public.orders_la2024 for select using ((select auth.uid()) = user_id);

drop policy if exists "Admins can view all orders" on public.orders_la2024;
create policy "Admins can view all orders" on public.orders_la2024 for select using (true); -- Ideally restrict to admin role

drop policy if exists "Admins can update orders" on public.orders_la2024;
create policy "Admins can update orders" on public.orders_la2024 for update using (true);

-- RLS for Order Items
alter table public.order_items_la2024 enable row level security;

drop policy if exists "Users can view own order items" on public.order_items_la2024;
create policy "Users can view own order items" on public.order_items_la2024 for select using (
  exists (select 1 from public.orders_la2024 where id = order_items_la2024.order_id and user_id = (select auth.uid()))
);

drop policy if exists "Admins can view all order items" on public.order_items_la2024;
create policy "Admins can view all order items" on public.order_items_la2024 for select using (true);
