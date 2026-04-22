-- ============================================
--  ServiceDesk v2.0 — Supabase Schema
--  Run this in: Supabase Dashboard → SQL Editor
-- ============================================

-- CLIENTS
create table if not exists clients (
  id text primary key,
  name text not null,
  phone text,
  email text,
  address text,
  notes text,
  archived boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- JOBS
create table if not exists jobs (
  id text primary key,
  description text not null,
  client_id text references clients(id) on delete set null,
  date text,
  time text,
  status text default 'Pending',
  cost numeric default 0,
  notes text,
  recur text,
  created_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- INVOICES
create table if not exists invoices (
  id text primary key,
  inv_number text,
  date text,
  due_date text,
  client_id text references clients(id) on delete set null,
  items jsonb default '[]',
  total numeric default 0,
  paid numeric default 0,
  status text default 'Unpaid',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- EXPENSES
create table if not exists expenses (
  id text primary key,
  description text not null,
  amount numeric default 0,
  date text,
  category text,
  notes text,
  created_by text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- TEAM MEMBERS (PIN-based auth)
create table if not exists team_members (
  id text primary key,
  name text not null,
  role text default 'member',
  pin_hash text not null,
  created_at timestamptz default now()
);

-- BUSINESS SETTINGS (single row)
create table if not exists business_settings (
  id text primary key default 'main',
  name text,
  owner text,
  phone text,
  wa text,
  email text,
  address text,
  currency text default 'JMD $',
  payment text,
  updated_at timestamptz default now()
);

-- ============================================
--  ROW LEVEL SECURITY — allow anon key access
--  (your app uses the anon key, no user login)
-- ============================================
alter table clients          enable row level security;
alter table jobs             enable row level security;
alter table invoices         enable row level security;
alter table expenses         enable row level security;
alter table team_members     enable row level security;
alter table business_settings enable row level security;

-- Allow full access with anon key (PIN = your auth layer)
create policy "allow_all_clients"           on clients           for all using (true) with check (true);
create policy "allow_all_jobs"              on jobs              for all using (true) with check (true);
create policy "allow_all_invoices"          on invoices          for all using (true) with check (true);
create policy "allow_all_expenses"          on expenses          for all using (true) with check (true);
create policy "allow_all_team_members"      on team_members      for all using (true) with check (true);
create policy "allow_all_business_settings" on business_settings for all using (true) with check (true);
