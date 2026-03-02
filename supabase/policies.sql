-- Apply this script on existing environments to harden RLS policies.
-- It assumes tables already exist.

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

grant execute on function public.is_admin() to authenticated, anon;

alter table public.products enable row level security;
alter table public.orders enable row level security;

drop policy if exists "Public read products" on public.products;
drop policy if exists "Admin insert products" on public.products;
drop policy if exists "Admin update products" on public.products;
drop policy if exists "Admin delete products" on public.products;

create policy "Public read products"
on public.products
for select
using (true);

create policy "Admin insert products"
on public.products
for insert
with check (public.is_admin());

create policy "Admin update products"
on public.products
for update
using (public.is_admin());

create policy "Admin delete products"
on public.products
for delete
using (public.is_admin());

drop policy if exists "Public insert orders" on public.orders;
drop policy if exists "Admin read orders" on public.orders;
drop policy if exists "Admin update orders" on public.orders;
drop policy if exists "Admin delete orders" on public.orders;

create policy "Public insert orders"
on public.orders
for insert
with check (true);

create policy "Admin read orders"
on public.orders
for select
using (public.is_admin());

create policy "Admin update orders"
on public.orders
for update
using (public.is_admin());

create policy "Admin delete orders"
on public.orders
for delete
using (public.is_admin());
