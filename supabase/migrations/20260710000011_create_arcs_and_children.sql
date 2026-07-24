-- CMS Bapikir: Arc Kehidupan + Arsip Anak
-- Migration 11: Arc & Child tables

-- Arc Kehidupan
create table if not exists arcs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    title text not null,
    description text,
    slug text not null,
    cover_url text,
    is_public boolean default false,
    sort_order int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, slug)
);

create table if not exists arc_entries (
    id uuid primary key default gen_random_uuid(),
    arc_id uuid not null references arcs(id) on delete cascade,
    title text not null,
    content text,
    year int not null,
    month int,
    day int,
    media_urls text[] default '{}',
    tags text[] default '{}',
    sort_order int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Arsip Anak
create table if not exists children (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    name text not null,
    slug text not null,
    birth_date date,
    photo_url text,
    bio text,
    sort_order int default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, slug)
);

create table if not exists child_milestones (
    id uuid primary key default gen_random_uuid(),
    child_id uuid not null references children(id) on delete cascade,
    phase text not null check (phase in ('lahir','balita','tk','sd','smp','sma','kuliah')),
    title text not null,
    description text,
    event_date date,
    media_urls text[] default '{}',
    sort_order int default 0,
    created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_arcs_user on arcs(user_id);
create index if not exists idx_arc_entries_arc on arc_entries(arc_id);
create index if not exists idx_arc_entries_year on arc_entries(year);
create index if not exists idx_children_user on children(user_id);
create index if not exists idx_child_milestones_child on child_milestones(child_id);
create index if not exists idx_child_milestones_phase on child_milestones(phase);

-- Enable RLS
alter table arcs enable row level security;
alter table arc_entries enable row level security;
alter table children enable row level security;
alter table child_milestones enable row level security;

-- RLS: users can only see their own data (or public arcs)
create policy "Users can manage own arcs"
    on arcs for all using (auth.uid() = user_id);

create policy "Anyone can view public arcs"
    on arcs for select using (is_public = true);

create policy "Users can manage own arc entries"
    on arc_entries for all using (
        arc_id in (select id from arcs where user_id = auth.uid())
    );

create policy "Users can manage own children"
    on children for all using (auth.uid() = user_id);

create policy "Users can manage own child milestones"
    on child_milestones for all using (
        child_id in (select id from children where user_id = auth.uid())
    );
