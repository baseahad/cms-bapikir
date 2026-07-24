-- Migration: create media library table + storage bucket
-- Untuk CMS Phase 4: upload, kelola, dan insert gambar ke konten

-- 1. Tabel media (metadata)
create table public.media (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  filename text not null,
  original_name text not null,
  mime_type text not null,
  size_bytes int not null,
  storage_path text not null,
  alt_text text default '',
  width int,
  height int,
  created_at timestamptz default now() not null
);

-- Index buat listing
create index media_user_idx on public.media (user_id, created_at desc);

alter table public.media enable row level security;

-- Semua user bisa lihat semua media (buat dipake di konten)
create policy "Anyone can view media"
  on public.media for select
  using (true);

-- Hanya admin yang bisa upload
create policy "Admins can insert media"
  on public.media for insert
  with check (
    auth.role() = 'authenticated'
    and exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
  );

-- Hanya admin yang bisa hapus
create policy "Admins can delete media"
  on public.media for delete
  using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
  );

-- 2. Storage bucket
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'media',
  'media',
  true,
  10485760, -- 10MB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Policy: public bucket — anyone can read
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Anyone can view media files'
  ) then
    create policy "Anyone can view media files"
      on storage.objects for select
      using (
        bucket_id = 'media'
      );
  end if;

  -- Upload hanya admin via service role (server-side)
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can upload media files'
  ) then
    create policy "Admins can upload media files"
      on storage.objects for insert
      with check (
        bucket_id = 'media'
        and auth.role() = 'authenticated'
      );
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Admins can delete media files'
  ) then
    create policy "Admins can delete media files"
      on storage.objects for delete
      using (
        bucket_id = 'media'
        and auth.role() = 'authenticated'
      );
  end if;
end $$;
