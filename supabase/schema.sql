-- Roar and River Safaris - database schema
-- Run this in Supabase: Dashboard > SQL Editor > New query > paste > Run

create table if not exists public.tours (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  price_usd   numeric(10,2),            -- NULL means "Book with us"
  description text,
  image_url   text,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  tour_id     uuid not null references public.tours(id),
  full_name   text not null check (char_length(full_name) between 2 and 100),
  email       text not null check (char_length(email) between 5 and 254),
  phone       text not null check (char_length(phone) between 7 and 20),
  travel_date date not null,
  group_size  int  not null check (group_size between 1 and 50),
  message     text check (char_length(message) <= 1000),
  status      text not null default 'pending'
              check (status in ('pending', 'confirmed', 'cancelled')),
  created_at  timestamptz not null default now()
);

-- Row Level Security: the public can read active tours and create pending
-- bookings. Nobody can read, change or delete bookings from the website;
-- you manage them in the Supabase dashboard (Table Editor).
alter table public.tours    enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Public can read active tours" on public.tours;
create policy "Public can read active tours"
  on public.tours for select
  to anon, authenticated
  using (is_active);

drop policy if exists "Public can create pending bookings" on public.bookings;
create policy "Public can create pending bookings"
  on public.bookings for insert
  to anon, authenticated
  with check (status = 'pending');

grant select on public.tours    to anon, authenticated;
grant insert on public.bookings to anon, authenticated;

-- Your six tours
insert into public.tours (slug, name, price_usd, sort_order) values
  ('victoria-falls-guided-tour',      'Victoria Falls Guided Tour',          35,   1),
  ('zambezi-sunset-cruise',           'Zambezi Sunset Cruise',               55,   2),
  ('chobe-day-trip-botswana',         'Chobe Day Trip (Botswana)',           229,  3),
  ('devils-pool-angels-pool',         'Devil''s Pool / Angel''s Pool',       120,  4),
  ('zambezi-national-park-game-drive','Zambezi National Park Game Drive',    80,   5),
  ('bungee-jumping',                 'Victoria Falls Bungee Jump',          194,  6),
  ('gorge-swing',                    'Victoria Falls Bridge Swing',         137,  7),
  ('bridge-zipline',                 'Victoria Falls Bridge Zipline',        58,  8)
on conflict (slug) do nothing;

-- Bungee and gorge swing used to be one combined tour. Hide the old row so
-- existing bookmarks stop working but the bookings that reference it survive:
update public.tours set is_active = false where slug = 'bungee-jumping-gorge-swing';

-- Chobe is priced per person. The figure above is the full price, so update it
-- directly if you ever change it: update public.tours set price_usd = 229
-- where slug = 'chobe-day-trip-botswana';

-- ---------------------------------------------------------------------------
-- AI Travel Assistant
-- ---------------------------------------------------------------------------

-- Extra context the assistant reads alongside name, description and price.
-- Prices stay in price_usd; the assistant always uses the live website prices.
alter table public.tours add column if not exists duration text;
alter table public.tours add column if not exists category text;

update public.tours as t
set duration = v.duration,
    category = v.category
from (values
  ('victoria-falls-guided-tour',       '2-3 hours',   'Falls tour'),
  ('zambezi-sunset-cruise',            '2 hours',     'River cruise'),
  ('chobe-day-trip-botswana',          'Full day',    'Wildlife safari'),
  ('devils-pool-angels-pool',          'Half day',    'Adventure'),
  ('zambezi-national-park-game-drive', '3-4 hours',   'Game drive'),
  ('bungee-jumping',                   '15 minutes',  'Adrenaline'),
  ('gorge-swing',                      '30 minutes',  'Adrenaline'),
  ('bridge-zipline',                   '15 minutes',  'Adrenaline')
) as v(slug, duration, category)
where t.slug = v.slug
  and (t.duration is null or t.category is null);

-- Booking enquiries captured by the chat assistant. The public may insert,
-- but nobody can read, edit or delete leads from the website. Read them in
-- the Supabase dashboard (Table Editor > leads).
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  name            text not null check (char_length(name) between 2 and 100),
  email           text not null check (char_length(email) between 5 and 254),
  dates           text not null check (char_length(dates) between 1 and 120),
  group_size      int  not null check (group_size between 1 and 50),
  interested_tour text check (char_length(interested_tour) <= 120),
  phone           text check (char_length(phone) between 7 and 20),
  message         text check (char_length(message) <= 1000),
  created_at      timestamptz not null default now()
);

alter table public.leads add column if not exists phone text;
alter table public.leads add column if not exists message text;

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

alter table public.leads enable row level security;

drop policy if exists "Public can create leads" on public.leads;
create policy "Public can create leads"
  on public.leads for insert
  to anon, authenticated
  with check (true);

grant insert on public.leads to anon, authenticated;
