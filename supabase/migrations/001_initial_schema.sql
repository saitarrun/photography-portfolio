-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Locations
create table public.locations (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  short_description text,
  long_description text,
  cover_image_url text,
  display_order integer default 0,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Photos
create table public.photos (
  id uuid primary key default uuid_generate_v4(),
  location_id uuid references public.locations(id) on delete cascade,
  image_url text not null,
  title text,
  caption text,
  alt_text text,
  shot_date date,
  camera text,
  lens text,
  aperture text,
  iso integer,
  shutter_speed text,
  focal_length text,
  featured boolean default false,
  display_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Photographer profile (single row)
create table public.photographer_profile (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  bio text,
  portrait_url text,
  email text,
  social_links jsonb default '{}',
  achievements jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Tags
create table public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz default now()
);

-- Photo tags (junction)
create table public.photo_tags (
  photo_id uuid references public.photos(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (photo_id, tag_id)
);

-- Indexes
create index idx_photos_location on public.photos(location_id);
create index idx_locations_slug on public.locations(slug);
create index idx_locations_order on public.locations(display_order);
create index idx_photos_order on public.photos(display_order);
create index idx_photos_featured on public.photos(featured);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger locations_updated_at before update on public.locations
  for each row execute function update_updated_at();
create trigger photos_updated_at before update on public.photos
  for each row execute function update_updated_at();
create trigger profile_updated_at before update on public.photographer_profile
  for each row execute function update_updated_at();

-- Row Level Security
alter table public.locations enable row level security;
alter table public.photos enable row level security;
alter table public.photographer_profile enable row level security;
alter table public.tags enable row level security;
alter table public.photo_tags enable row level security;

-- Public read access
create policy "Public read locations" on public.locations for select using (true);
create policy "Public read photos" on public.photos for select using (true);
create policy "Public read profile" on public.photographer_profile for select using (true);
create policy "Public read tags" on public.tags for select using (true);
create policy "Public read photo_tags" on public.photo_tags for select using (true);

-- Authenticated write access (admin)
create policy "Admin insert locations" on public.locations for insert with check (auth.role() = 'authenticated');
create policy "Admin update locations" on public.locations for update using (auth.role() = 'authenticated');
create policy "Admin delete locations" on public.locations for delete using (auth.role() = 'authenticated');

create policy "Admin insert photos" on public.photos for insert with check (auth.role() = 'authenticated');
create policy "Admin update photos" on public.photos for update using (auth.role() = 'authenticated');
create policy "Admin delete photos" on public.photos for delete using (auth.role() = 'authenticated');

create policy "Admin insert profile" on public.photographer_profile for insert with check (auth.role() = 'authenticated');
create policy "Admin update profile" on public.photographer_profile for update using (auth.role() = 'authenticated');
create policy "Admin delete profile" on public.photographer_profile for delete using (auth.role() = 'authenticated');

create policy "Admin insert tags" on public.tags for insert with check (auth.role() = 'authenticated');
create policy "Admin update tags" on public.tags for update using (auth.role() = 'authenticated');
create policy "Admin delete tags" on public.tags for delete using (auth.role() = 'authenticated');

create policy "Admin insert photo_tags" on public.photo_tags for insert with check (auth.role() = 'authenticated');
create policy "Admin update photo_tags" on public.photo_tags for update using (auth.role() = 'authenticated');
create policy "Admin delete photo_tags" on public.photo_tags for delete using (auth.role() = 'authenticated');

-- Create Supabase Storage bucket for photos
insert into storage.buckets (id, name, public) values ('photos', 'photos', true);

-- Storage policies
create policy "Public read photos storage" on storage.objects
  for select using (bucket_id = 'photos');
create policy "Auth upload photos storage" on storage.objects
  for insert with check (bucket_id = 'photos' and auth.role() = 'authenticated');
create policy "Auth delete photos storage" on storage.objects
  for delete using (bucket_id = 'photos' and auth.role() = 'authenticated');
