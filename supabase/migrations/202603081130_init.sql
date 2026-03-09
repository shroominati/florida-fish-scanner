create extension if not exists pgcrypto;

create table if not exists public.species (
  id text primary key,
  common_name text not null,
  scientific_name text not null,
  water_types text[] not null default '{}',
  confusion_species_ids text[] not null default '{}',
  mvp_priority integer not null default 100,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.species_aliases (
  id uuid primary key default gen_random_uuid(),
  species_id text not null references public.species(id) on delete cascade,
  alias text not null,
  normalized_alias text not null,
  created_at timestamptz not null default now(),
  unique (species_id, normalized_alias)
);

create table if not exists public.regulation_zones (
  id text primary key,
  name text not null,
  water_type text not null check (water_type in ('saltwater', 'freshwater')),
  region text not null,
  priority integer not null default 0,
  parent_zone_id text references public.regulation_zones(id),
  geometry_type text,
  geometry jsonb,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.data_sources (
  id text primary key,
  label text not null,
  authority text not null,
  source_type text not null check (source_type in ('official', 'official_federal', 'secondary_cache')),
  source_url text not null,
  last_verified_at date,
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.rule_versions (
  id text primary key,
  label text not null,
  published_at date not null,
  freshness_window_days integer not null default 120,
  status text not null default 'draft' check (status in ('draft', 'published', 'retired')),
  notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.regulation_rules (
  id text primary key,
  species_id text not null references public.species(id),
  zone_id text not null references public.regulation_zones(id),
  version_id text not null references public.rule_versions(id),
  source_id text not null references public.data_sources(id),
  jurisdiction text not null default 'FL',
  water_type text not null check (water_type in ('saltwater', 'freshwater')),
  fishing_modes text[] not null default '{}',
  applies_in_federal_waters text not null default 'state_only' check (applies_in_federal_waters in ('state_only', 'adjacent_federal', 'federal_only')),
  effective_start date not null,
  effective_end date,
  min_length_in numeric(6,2),
  max_length_in numeric(6,2),
  min_length_inclusive boolean not null default true,
  max_length_inclusive boolean not null default true,
  slot_only boolean not null default false,
  bag_limit_per_person integer,
  possession_limit integer,
  vessel_limit integer,
  catch_and_release_only boolean not null default false,
  allow_one_over_max_count integer not null default 0,
  special_notes jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.seasonal_windows (
  id uuid primary key default gen_random_uuid(),
  rule_id text not null references public.regulation_rules(id) on delete cascade,
  start_month_day text not null,
  end_month_day text not null,
  status text not null check (status in ('open', 'closed')),
  note text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.catches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  species_id text references public.species(id),
  selected_species_name text not null,
  photo_uri text,
  measured_length_in numeric(6,2),
  measurement_confidence numeric(4,3),
  decision_status text not null check (decision_status in ('LEGAL', 'ILLEGAL', 'UNCERTAIN')),
  decision_trace jsonb not null default '[]'::jsonb,
  zone_id text references public.regulation_zones(id),
  rule_id text references public.regulation_rules(id),
  request_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.measurement_sessions (
  id uuid primary key default gen_random_uuid(),
  catch_id uuid references public.catches(id) on delete cascade,
  method text not null,
  fish_pixel_length numeric(8,2),
  reference_pixel_length numeric(8,2),
  reference_length_in numeric(6,2),
  total_length_in numeric(6,2),
  uncertainty_in numeric(6,2),
  confidence numeric(4,3),
  user_adjusted boolean not null default false,
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  platform text not null,
  app_version text,
  last_rule_version_id text references public.rule_versions(id),
  last_sync_at timestamptz,
  location_permission text,
  camera_permission text,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor text not null,
  action text not null,
  entity_type text not null,
  entity_id text not null,
  version_id text references public.rule_versions(id),
  before_payload jsonb,
  after_payload jsonb,
  source_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_species_aliases_normalized_alias on public.species_aliases(normalized_alias);
create index if not exists idx_regulation_rules_lookup on public.regulation_rules(species_id, zone_id, effective_start, effective_end);
create index if not exists idx_regulation_rules_version on public.regulation_rules(version_id);
create index if not exists idx_seasonal_windows_rule on public.seasonal_windows(rule_id);
create index if not exists idx_catches_created_at on public.catches(created_at desc);
create index if not exists idx_audit_logs_entity on public.audit_logs(entity_type, entity_id, created_at desc);
