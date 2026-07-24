-- Migration: create blog_posts table for CMS Phase 4
-- Replaces file-based .mdx with database-driven posts

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  content text not null, -- MDX content stored as text
  author text default 'Avathur Rahman',
  tags text[] default '{}',
  category text,
  access text default 'free' check (access in ('free', 'member', 'premium', 'exclusive')),
  published boolean default false,
  featured boolean default false,
  reading_time int default 1,
  cover_image text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Index for listing
create index blog_posts_published_idx on blog_posts (published, created_at desc);
create index blog_posts_slug_idx on blog_posts (slug);
create index blog_posts_category_idx on blog_posts (category);

-- RLS: only admins can write, everyone can read published
alter table public.blog_posts enable row level security;

create policy "Anyone can read published posts"
  on public.blog_posts for select
  using (published = true);

create policy "Admins can insert posts"
  on public.blog_posts for insert
  with check (
    auth.role() = 'authenticated'
    and exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
  );

create policy "Admins can update posts"
  on public.blog_posts for update
  using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
  );

create policy "Admins can delete posts"
  on public.blog_posts for delete
  using (
    auth.role() = 'authenticated'
    and exists (select 1 from public.user_roles where user_id = auth.uid() and role = 'admin')
  );

-- Trigger to auto-update updated_at
create extension if not exists moddatetime;
create trigger handle_blog_posts_updated_at
  before update on public.blog_posts
  for each row execute function moddatetime (updated_at);
