-- Catalog of Havn stays. Matches lib/stays.ts Stay (flattened image + sort_order).
create table if not exists public.stays (
  slug text primary key,
  name text not null,
  region text not null,
  country text not null,
  mood text not null,
  season text not null,
  sleeps text not null,
  setting text not null,
  lede text not null,
  body text[] not null,
  image_src text not null,
  image_alt text not null,
  image_photographer text not null,
  image_profile_url text not null,
  image_unsplash_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stays_sort_order_idx on public.stays (sort_order);

alter table public.stays enable row level security;

drop policy if exists stays_public_read on public.stays;
create policy stays_public_read
  on public.stays
  for select
  to anon, authenticated
  using (true);

-- Public catalog: SELECT only. No public INSERT/UPDATE/DELETE.
revoke all on table public.stays from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.stays to anon, authenticated;

drop trigger if exists stays_updated_at on public.stays;
create trigger stays_updated_at
  before update on public.stays
  for each row
  execute function system.update_updated_at();
