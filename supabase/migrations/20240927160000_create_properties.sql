-- Migration: Create properties table for storing STR property information
-- Purpose: Store comprehensive property details for AI-powered guest responses
-- Created: 2024-09-27
-- Tables: properties

-- create the properties table to store all short-term rental property information
create table public.properties (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  
  -- basic property information
  name text not null, -- property name or identifier (required)
  address text not null, -- full property address (required)  
  description text, -- general property description
  
  -- check-in and check-out details
  check_in_time time, -- standard check-in time (e.g., '15:00')
  check_out_time time, -- standard check-out time (e.g., '11:00')
  check_in_instructions text, -- detailed check-in instructions for guests
  check_out_instructions text, -- detailed check-out instructions for guests
  
  -- wifi and internet access
  wifi_ssid text, -- wifi network name
  wifi_password text, -- wifi password for guests
  
  -- parking information
  parking_details text, -- parking availability and type
  parking_instructions text, -- specific parking instructions and location
  
  -- house rules and quiet times
  quiet_hours_start time, -- start of quiet hours (e.g., '22:00')
  quiet_hours_end time, -- end of quiet hours (e.g., '08:00')
  house_rules text, -- detailed house rules for guests
  
  -- location and directions
  directions text, -- detailed directions to the property
  google_maps_link text, -- google maps link to the property
  
  -- local area information
  nearby_restaurants text, -- information about nearby restaurants
  nearby_attractions text, -- information about nearby attractions and activities
  points_of_interest text, -- other local points of interest
  transportation_info text, -- public transport and local transport options
  
  -- emergency and contact information
  emergency_contacts text, -- emergency contact details
  
  -- amenities and features (stored as jsonb for flexibility)
  amenities jsonb default '[]'::jsonb, -- list of property amenities
  
  -- cleaning and maintenance
  cleaning_instructions text, -- instructions for cleaning and waste disposal
  
  -- administrative fields
  is_active boolean not null default true, -- whether property is actively managed
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

comment on table public.properties is 'stores comprehensive information about short-term rental properties for ai-powered guest assistance';

-- create indexes for performance
create index idx_properties_user_id on public.properties (user_id);
create index idx_properties_is_active on public.properties (is_active);
create index idx_properties_created_at on public.properties (created_at desc);

-- create full-text search index for property search functionality
create index idx_properties_search on public.properties using gin (
  to_tsvector('english', 
    coalesce(name, '') || ' ' || 
    coalesce(address, '') || ' ' || 
    coalesce(description, '')
  )
);

-- enable row level security
alter table public.properties enable row level security;

-- rls policy: users can view their own properties
create policy "users can view own properties"
on public.properties
for select
to authenticated
using (auth.uid() = user_id);

-- rls policy: users can insert their own properties
create policy "users can insert own properties"
on public.properties
for insert
to authenticated
with check (auth.uid() = user_id);

-- rls policy: users can update their own properties
create policy "users can update own properties"
on public.properties
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- rls policy: users can delete their own properties
create policy "users can delete own properties"
on public.properties
for delete
to authenticated
using (auth.uid() = user_id);

-- create function to automatically update the updated_at timestamp
create or replace function public.update_properties_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  -- update the "updated_at" column on row modification
  new.updated_at := now();
  return new;
end;
$$;

-- create trigger to automatically update updated_at on row updates
create trigger update_properties_updated_at_trigger
before update on public.properties
for each row
execute function public.update_properties_updated_at();
