-- Applied to Supabase project interior-studio (fpnntpjbbwbrjpqbpvxk) on 2026-10-27.
-- Kept here as the source of truth for the schema.

create table public.studio_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','member')),
  created_at timestamptz not null default now()
);
alter table public.studio_members enable row level security;

create or replace function public.is_studio_member()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.studio_members m where m.user_id = (select auth.uid())); $$;
revoke all on function public.is_studio_member() from public, anon;
grant execute on function public.is_studio_member() to authenticated;

create policy "members read members" on public.studio_members
  for select to authenticated using ((select public.is_studio_member()));

-- The first user who signs up becomes the owner.
create or replace function public.handle_first_member()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (select 1 from public.studio_members) then
    insert into public.studio_members (user_id, role) values (new.id, 'owner');
  end if;
  return new;
end;
$$;
revoke all on function public.handle_first_member() from public, anon, authenticated;
create trigger on_auth_user_created_first_member
  after insert on auth.users for each row execute function public.handle_first_member();

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  space text,
  stage text not null default 'new' check (stage in ('new','proposal','active','done')),
  source text,
  next_step text,
  value numeric(12,2),
  contact text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  service text not null default 'design' check (service in ('consulting','design','turnkey')),
  stage smallint not null default 0 check (stage between 0 and 8),
  budget numeric(12,2) not null default 0,
  spent numeric(12,2) not null default 0,
  notes text,
  created_at timestamptz not null default now()
);
create index on public.projects (client_id);

create table public.project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage smallint not null check (stage between 0 and 8),
  title text not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);
create index on public.project_tasks (project_id);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('income','expense')),
  amount numeric(12,2) not null check (amount >= 0),
  description text not null,
  category text,
  project_id uuid references public.projects(id) on delete set null,
  status text not null default 'paid' check (status in ('paid','pending')),
  due_date date,
  date date not null default current_date,
  created_at timestamptz not null default now()
);
create index on public.transactions (project_id);

create table public.business_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  area text not null default 'Marca',
  owner_name text,
  status text not null default 'todo' check (status in ('todo','doing','waiting','done')),
  high_priority boolean not null default false,
  note text,
  created_at timestamptz not null default now()
);

create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  kind text not null default 'decision' check (kind in ('decision','question')),
  text text not null,
  created_at timestamptz not null default now()
);

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  contact text not null check (char_length(contact) between 3 and 160),
  space_type text check (char_length(space_type) <= 60),
  message text check (char_length(message) <= 2000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

do $$
declare t text;
begin
  foreach t in array array['clients','projects','project_tasks','transactions','business_tasks','decisions'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "members select" on public.%I for select to authenticated using ((select public.is_studio_member()))', t);
    execute format('create policy "members insert" on public.%I for insert to authenticated with check ((select public.is_studio_member()))', t);
    execute format('create policy "members update" on public.%I for update to authenticated using ((select public.is_studio_member())) with check ((select public.is_studio_member()))', t);
    execute format('create policy "members delete" on public.%I for delete to authenticated using ((select public.is_studio_member()))', t);
  end loop;
end $$;

alter table public.contact_requests enable row level security;
create policy "anyone can send a request" on public.contact_requests
  for insert to anon, authenticated with check (handled = false);
create policy "members read requests" on public.contact_requests
  for select to authenticated using ((select public.is_studio_member()));
create policy "members update requests" on public.contact_requests
  for update to authenticated using ((select public.is_studio_member())) with check ((select public.is_studio_member()));
create policy "members delete requests" on public.contact_requests
  for delete to authenticated using ((select public.is_studio_member()));
