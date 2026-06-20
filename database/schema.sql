-- ═══════════════════════════════════════════════════════════════════════════
-- HYDRONOVA DATABASE SCHEMA
-- Run this entire file in Supabase → SQL Editor → New Query → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ─── USERS (extends Supabase auth.users) ─────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  phone text,
  name text,
  preferred_lang text default 'bn' check (preferred_lang in ('en','bn')),
  mode text default 'citizen' check (mode in ('citizen','expert')),
  district text,
  created_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.users for insert
  with check (auth.uid() = id);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── FLOOD RISK SCORES ────────────────────────────────────────────────────────
create table if not exists public.flood_risk_scores (
  id uuid primary key default uuid_generate_v4(),
  district text not null,
  lat double precision not null,
  lng double precision not null,
  score int not null check (score >= 0 and score <= 100),
  level text not null check (level in ('safe','moderate','high','severe')),
  confidence int default 80,
  trend text default 'stable' check (trend in ('rising','falling','stable')),
  explanation_en text,
  explanation_bn text,
  created_at timestamptz default now()
);

alter table public.flood_risk_scores enable row level security;
create policy "Anyone can read risk scores"
  on public.flood_risk_scores for select using (true);

-- ─── COMMUNITY REPORTS ────────────────────────────────────────────────────────
create table if not exists public.community_reports (
  id uuid primary key default uuid_generate_v4(),
  type text not null check (type in ('flooding','bridge','help','other')),
  lat double precision,
  lng double precision,
  district text,
  description_en text,
  description_bn text,
  photos text[] default '{}',
  reporter_id uuid references auth.users(id) on delete set null,
  is_anonymous boolean default false,
  verification_status text default 'pending' check (verification_status in ('pending','verified','rejected')),
  upvotes int default 0,
  satellite_confirmed boolean default false,
  created_at timestamptz default now()
);

alter table public.community_reports enable row level security;
create policy "Anyone can read reports"
  on public.community_reports for select using (true);
create policy "Authenticated users can insert reports"
  on public.community_reports for insert
  with check (auth.uid() is not null or is_anonymous = true);

-- ─── FAMILY CIRCLES ───────────────────────────────────────────────────────────
create table if not exists public.family_circles (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

alter table public.family_circles enable row level security;
create policy "Owners manage their circles"
  on public.family_circles for all
  using (auth.uid() = owner_id);

-- ─── FAMILY MEMBERS ───────────────────────────────────────────────────────────
create table if not exists public.family_members (
  id uuid primary key default uuid_generate_v4(),
  circle_id uuid references public.family_circles(id) on delete cascade,
  name text not null,
  phone text,
  lat double precision,
  lng double precision,
  district text,
  status text default 'safe' check (status in ('safe','warning','danger')),
  last_seen_at timestamptz default now()
);

alter table public.family_members enable row level security;
create policy "Circle owners manage members"
  on public.family_members for all
  using (
    circle_id in (select id from public.family_circles where owner_id = auth.uid())
  );

-- ─── FLOOD SHELTERS ───────────────────────────────────────────────────────────
create table if not exists public.flood_shelters (
  id uuid primary key default uuid_generate_v4(),
  name_en text not null,
  name_bn text not null,
  type text default 'shelter',
  lat double precision not null,
  lng double precision not null,
  district text,
  capacity int default 100,
  is_open boolean default true,
  updated_at timestamptz default now()
);

alter table public.flood_shelters enable row level security;
create policy "Anyone can read shelters"
  on public.flood_shelters for select using (true);

-- ─── FLOOD ALERTS ─────────────────────────────────────────────────────────────
create table if not exists public.flood_alerts (
  id uuid primary key default uuid_generate_v4(),
  severity text not null check (severity in ('watch','warning','severe')),
  title_en text not null,
  title_bn text not null,
  message_en text,
  message_bn text,
  affected_areas text[] default '{}',
  issued_at timestamptz default now(),
  expires_at timestamptz,
  is_active boolean default true
);

alter table public.flood_alerts enable row level security;
create policy "Anyone can read alerts"
  on public.flood_alerts for select using (true);

-- ═══════════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════

insert into public.flood_shelters (name_en, name_bn, type, lat, lng, district, capacity, is_open) values
  ('Sylhet Government Primary School Shelter', 'সিলেট সরকারি প্রাইমারি স্কুল আশ্রয়কেন্দ্র', 'school', 24.8949, 91.8687, 'Sylhet', 450, true),
  ('Sunamganj Community Center', 'সুনামগঞ্জ কমিউনিটি সেন্টার', 'community', 25.0658, 91.3950, 'Sunamganj', 300, true),
  ('Mymensingh Cyclone Shelter', 'মাইমনসিংহ ঘূর্ণিঝড় আশ্রয়কেন্দ্র', 'cyclone_shelter', 24.7471, 90.4203, 'Mymensingh', 600, true),
  ('Dhaka North City Relief Camp', 'ঢাকা উত্তর সিটি ত্রাণ শিবির', 'relief_camp', 23.8103, 90.4125, 'Dhaka', 800, true),
  ('Bahadurabad High School Shelter', 'বাহাদুরাবাদ উচ্চ বিদ্যালয় আশ্রয়কেন্দ্র', 'school', 25.1830, 89.6960, 'Jamalpur', 350, true);

insert into public.flood_alerts (severity, title_en, title_bn, message_en, message_bn, affected_areas, expires_at, is_active) values
  (
    'watch',
    'Moderate Flood Watch — Sylhet Division',
    'মধ্যম বন্যা সতর্কতা — সিলেট বিভাগ',
    'Heavy rainfall in upstream catchment areas has raised river levels. Residents near Surma and Kushiyara rivers should monitor conditions closely.',
    'উজানের ক্যাচমেন্ট এলাকায় ভারী বৃষ্টিপাতের কারণে নদীর পানি বৃদ্ধি পেয়েছে। সুরমা ও কুশিয়ারা নদীর তীরবর্তী বাসিন্দাদের পরিস্থিতি নিবিড়ভাবে পর্যবেক্ষণ করা উচিত।',
    array['Sylhet','Sunamganj','Habiganj'],
    now() + interval '72 hours',
    true
  );

insert into public.flood_risk_scores (district, lat, lng, score, level, confidence, trend, explanation_en, explanation_bn) values
  ('Sylhet', 24.8949, 91.8687, 82, 'severe', 91, 'rising', 'River levels rising rapidly due to upstream rainfall in Meghalaya hills.', 'মেঘালয় পাহাড়ে উজানে বৃষ্টিপাতের কারণে নদীর পানি দ্রুত বৃদ্ধি পাচ্ছে।'),
  ('Sunamganj', 25.0658, 91.3950, 78, 'high', 88, 'rising', 'Haor areas experiencing rapid water accumulation.', 'হাওর এলাকায় দ্রুত পানি জমা হচ্ছে।'),
  ('Mymensingh', 24.7471, 90.4203, 45, 'moderate', 76, 'stable', 'Brahmaputra levels stable but elevated for the season.', 'ব্রহ্মপুত্রের পানি স্থিতিশীল কিন্তু মৌসুমের জন্য উচ্চ।'),
  ('Dhaka', 23.8103, 90.4125, 28, 'safe', 85, 'falling', 'Buriganga and surrounding rivers within normal seasonal range.', 'বুড়িগঙ্গা ও আশেপাশের নদী স্বাভাবিক মৌসুমি পরিসরে আছে।'),
  ('Jamalpur', 25.2090, 89.9450, 58, 'moderate', 80, 'rising', 'Jamuna char areas seeing gradual water rise.', 'যমুনা চর এলাকায় ধীরে ধীরে পানি বৃদ্ধি পাচ্ছে।');

-- ═══════════════════════════════════════════════════════════════════════════
-- DONE — Hydronova database is ready
-- ═══════════════════════════════════════════════════════════════════════════
