-- Guest inquiries for a stay. Owner-only RLS; no anon writes or public reads.
create table if not exists public.stay_requests (
  id uuid primary key default gen_random_uuid(),
  stay_slug text not null references public.stays (slug),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  guest_name text not null,
  guest_email text not null,
  dates_note text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists stay_requests_user_id_idx
  on public.stay_requests (user_id);

create index if not exists stay_requests_stay_slug_idx
  on public.stay_requests (stay_slug);

alter table public.stay_requests enable row level security;

drop policy if exists stay_requests_insert_own on public.stay_requests;
create policy stay_requests_insert_own
  on public.stay_requests
  for insert
  to authenticated
  with check (user_id = (select auth.uid()));

drop policy if exists stay_requests_select_own on public.stay_requests;
create policy stay_requests_select_own
  on public.stay_requests
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Authenticated guests may insert and read their own rows only.
-- Anon has no INSERT or SELECT. No public read of others' requests.
revoke all on table public.stay_requests from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select, insert on table public.stay_requests to authenticated;
