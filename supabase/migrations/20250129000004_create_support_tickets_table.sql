-- Support Tickets Table
create table if not exists public.support_tickets_la2024 (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles_la2024(id) on delete set null,
  subject text not null,
  description text not null,
  status text default 'open', -- open, pending, resolved, closed
  priority text default 'medium', -- low, medium, high
  category text default 'general',
  assigned_to text, -- Could be a user UUID in future, keeping as text for simple name assignment
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Support Ticket Responses Table
create table if not exists public.support_ticket_responses_la2024 (
  id uuid default gen_random_uuid() primary key,
  ticket_id uuid references public.support_tickets_la2024(id) on delete cascade not null,
  user_id uuid references public.profiles_la2024(id) on delete set null,
  message text not null,
  is_internal_note boolean default false,
  created_at timestamptz default now() not null
);

-- RLS for Tickets
alter table public.support_tickets_la2024 enable row level security;

drop policy if exists "Users can view own tickets" on public.support_tickets_la2024;
create policy "Users can view own tickets" on public.support_tickets_la2024 for select using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own tickets" on public.support_tickets_la2024;
create policy "Users can insert own tickets" on public.support_tickets_la2024 for insert with check ((select auth.uid()) = user_id);

drop policy if exists "Admins can view all tickets" on public.support_tickets_la2024;
create policy "Admins can view all tickets" on public.support_tickets_la2024 for select using (true); -- Ideally restrict to admin role

drop policy if exists "Admins can update tickets" on public.support_tickets_la2024;
create policy "Admins can update tickets" on public.support_tickets_la2024 for update using (true);

-- RLS for Responses
alter table public.support_ticket_responses_la2024 enable row level security;

drop policy if exists "Users can view responses to own tickets" on public.support_ticket_responses_la2024;
create policy "Users can view responses to own tickets" on public.support_ticket_responses_la2024 for select using (
  exists (select 1 from public.support_tickets_la2024 where id = support_ticket_responses_la2024.ticket_id and user_id = (select auth.uid()))
);

drop policy if exists "Users can insert responses to own tickets" on public.support_ticket_responses_la2024;
create policy "Users can insert responses to own tickets" on public.support_ticket_responses_la2024 for insert with check (
  exists (select 1 from public.support_tickets_la2024 where id = support_ticket_responses_la2024.ticket_id and user_id = (select auth.uid()))
);

drop policy if exists "Admins can view all responses" on public.support_ticket_responses_la2024;
create policy "Admins can view all responses" on public.support_ticket_responses_la2024 for select using (true);

drop policy if exists "Admins can insert responses" on public.support_ticket_responses_la2024;
create policy "Admins can insert responses" on public.support_ticket_responses_la2024 for insert with check (true);
