create table public.rate_limit_buckets (
  namespace text not null,
  subject_key text not null,
  count integer default 0 not null check (count >= 0),
  reset_at timestamptz not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  primary key (namespace, subject_key)
);

alter table public.rate_limit_buckets enable row level security;

create index idx_rate_limit_buckets_reset_at
  on public.rate_limit_buckets (reset_at);

create or replace function public.consume_rate_limit(
  p_namespace text,
  p_subject_key text,
  p_limit integer,
  p_window_seconds integer
)
returns table (
  allowed boolean,
  "limit" integer,
  remaining integer,
  reset_at timestamptz,
  retry_after integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  bucket public.rate_limit_buckets%rowtype;
  now_ts timestamptz := now();
  next_reset timestamptz := now_ts + make_interval(secs => greatest(p_window_seconds, 1));
begin
  loop
    select *
    into bucket
    from public.rate_limit_buckets
    where rate_limit_buckets.namespace = p_namespace
      and rate_limit_buckets.subject_key = p_subject_key
    for update;

    if found then
      if bucket.reset_at <= now_ts then
        update public.rate_limit_buckets
        set
          count = 1,
          reset_at = next_reset,
          updated_at = now_ts
        where rate_limit_buckets.namespace = p_namespace
          and rate_limit_buckets.subject_key = p_subject_key
        returning * into bucket;

        return query
          select
            true,
            p_limit,
            greatest(0, p_limit - 1),
            bucket.reset_at,
            greatest(1, ceil(extract(epoch from bucket.reset_at - now_ts))::integer);
        return;
      end if;

      if bucket.count >= p_limit then
        return query
          select
            false,
            p_limit,
            0,
            bucket.reset_at,
            greatest(1, ceil(extract(epoch from bucket.reset_at - now_ts))::integer);
        return;
      end if;

      update public.rate_limit_buckets
      set
        count = bucket.count + 1,
        updated_at = now_ts
      where rate_limit_buckets.namespace = p_namespace
        and rate_limit_buckets.subject_key = p_subject_key
      returning * into bucket;

      return query
        select
          true,
          p_limit,
          greatest(0, p_limit - bucket.count),
          bucket.reset_at,
          greatest(1, ceil(extract(epoch from bucket.reset_at - now_ts))::integer);
      return;
    end if;

    begin
      insert into public.rate_limit_buckets (
        namespace,
        subject_key,
        count,
        reset_at
      )
      values (
        p_namespace,
        p_subject_key,
        1,
        next_reset
      )
      returning * into bucket;

      return query
        select
          true,
          p_limit,
          greatest(0, p_limit - 1),
          bucket.reset_at,
          greatest(1, ceil(extract(epoch from bucket.reset_at - now_ts))::integer);
      return;
    exception
      when unique_violation then
        null;
    end;
  end loop;
end;
$$;
