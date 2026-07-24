-- Migration: Koin & Product System
-- Added: 2026-07-15
-- Tables: koin_ledger, products, purchases
-- Column: profiles.sapaan

-- ── 1. Kolom sapaan di profiles ──
alter table public.profiles 
  add column if not exists sapaan text default 'halo' not null;

-- ── 2. Tabel koin_ledger ──
create table if not exists public.koin_ledger (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  tipe text not null check (tipe in ('bapikir', 'protokol')),
  produk text,
  mutasi integer not null,
  saldo_setelah integer not null,
  keterangan text,
  created_at timestamptz default now() not null
);

alter table public.koin_ledger enable row level security;

create policy "Users view own ledger"
  on public.koin_ledger for select
  using (auth.uid() = user_id);

-- ── 3. Tabel produk ──
create table if not exists public.produk (
  id uuid default gen_random_uuid() primary key,
  nama text not null,
  slug text unique not null,
  deskripsi text,
  tipe text not null check (tipe in ('artikel', 'ebook', 'ecourse', 'sertifikasi', 'konsultasi', 'software')),
  harga_koin integer not null default 0,
  koin_tipe text not null default 'bapikir' check (koin_tipe in ('bapikir', 'protokol')),
  url_konten text,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.produk enable row level security;

create policy "Anyone view published produk"
  on public.produk for select
  using (status = 'published');

-- ── 4. Tabel pembelian ──
create table if not exists public.pembelian (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  produk_id uuid references public.produk(id) on delete cascade not null,
  tipe_koin text not null,
  koin_terpakai integer not null,
  created_at timestamptz default now() not null,
  unique(user_id, produk_id)
);

alter table public.pembelian enable row level security;

create policy "Users view own purchases"
  on public.pembelian for select
  using (auth.uid() = user_id);
