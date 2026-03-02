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

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  readable_id text,
  name text not null,
  price integer not null,
  stock integer not null default 0,
  category text not null,
  code text,
  detail text,
  image_url text,
  is_featured boolean default false,
  is_offer boolean default false,
  created_at timestamptz default now()
);

alter table public.products enable row level security;

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

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  readable_id text,
  items jsonb not null,
  customer_details jsonb,
  total integer not null,
  status text default 'new',
  created_at timestamptz default now()
);

alter table public.orders enable row level security;

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

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

create policy "Public read product images"
on storage.objects
for select
using (bucket_id = 'products');

create policy "Admin upload product images"
on storage.objects
for insert
with check (bucket_id = 'products' and auth.role() = 'authenticated');

create policy "Admin update product images"
on storage.objects
for update
using (bucket_id = 'products' and auth.role() = 'authenticated');

create policy "Admin delete product images"
on storage.objects
for delete
using (bucket_id = 'products' and auth.role() = 'authenticated');
