-- Migration: Create property WhatsApp links table
-- Purpose: Link guest WhatsApp numbers to specific properties for current stays
-- Created: 2024-09-27
-- Tables: property_whatsapp_links

-- create the property_whatsapp_links table to link guest whatsapp numbers to properties
create table public.property_whatsapp_links (
  id bigint generated always as identity primary key,
  property_id bigint not null references public.properties (id) on delete cascade,
  
  -- guest whatsapp information
  guest_phone_number text not null, -- guest's whatsapp phone number (including country code)
  guest_name text, -- optional guest name for identification
  
  -- stay period information
  start_date date, -- start date of guest stay
  end_date date, -- end date of guest stay
  
  -- status and metadata
  is_active boolean not null default true, -- whether this link is currently active
  notes text, -- optional notes about the guest or stay
  
  -- administrative fields
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

comment on table public.property_whatsapp_links is 'links guest whatsapp numbers to specific properties for managing current stays';

-- create indexes for performance
create index idx_property_whatsapp_links_property_id on public.property_whatsapp_links (property_id);
create index idx_property_whatsapp_links_phone on public.property_whatsapp_links (guest_phone_number);
create index idx_property_whatsapp_links_is_active on public.property_whatsapp_links (is_active);
create index idx_property_whatsapp_links_dates on public.property_whatsapp_links (start_date, end_date);

-- unique constraint to prevent duplicate active links for same phone number and property
create unique index idx_property_whatsapp_links_unique_active 
on public.property_whatsapp_links (property_id, guest_phone_number) 
where is_active = true;

-- enable row level security
alter table public.property_whatsapp_links enable row level security;

-- rls policy: users can view links for their own properties
create policy "users can view own property whatsapp links"
on public.property_whatsapp_links
for select
to authenticated
using (
  property_id in (
    select id from public.properties 
    where user_id = (select auth.uid()) and is_active = true
  )
);

-- rls policy: users can insert links for their own properties
create policy "users can insert own property whatsapp links"
on public.property_whatsapp_links
for insert
to authenticated
with check (
  property_id in (
    select id from public.properties 
    where user_id = (select auth.uid()) and is_active = true
  )
);

-- rls policy: users can update links for their own properties
create policy "users can update own property whatsapp links"
on public.property_whatsapp_links
for update
to authenticated
using (
  property_id in (
    select id from public.properties 
    where user_id = (select auth.uid()) and is_active = true
  )
)
with check (
  property_id in (
    select id from public.properties 
    where user_id = (select auth.uid()) and is_active = true
  )
);

-- rls policy: users can delete links for their own properties
create policy "users can delete own property whatsapp links"
on public.property_whatsapp_links
for delete
to authenticated
using (
  property_id in (
    select id from public.properties 
    where user_id = (select auth.uid()) and is_active = true
  )
);

-- create function to automatically update the updated_at timestamp
create or replace function public.update_property_whatsapp_links_updated_at()
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
create trigger update_property_whatsapp_links_updated_at_trigger
before update on public.property_whatsapp_links
for each row
execute function public.update_property_whatsapp_links_updated_at();

-- create function to get property information for a guest's whatsapp number
create or replace function public.get_property_for_guest_phone(
  guest_phone_param text
)
returns table (
  property_id bigint,
  property_name text,
  property_address text,
  guest_name text,
  start_date date,
  end_date date,
  link_id bigint
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  select 
    p.id as property_id,
    p.name as property_name,
    p.address as property_address,
    pwl.guest_name,
    pwl.start_date,
    pwl.end_date,
    pwl.id as link_id
  from public.property_whatsapp_links pwl
  join public.properties p on pwl.property_id = p.id
  where pwl.guest_phone_number = guest_phone_param 
    and pwl.is_active = true
    and p.is_active = true
    and (pwl.start_date is null or pwl.start_date <= current_date)
    and (pwl.end_date is null or pwl.end_date >= current_date)
  order by pwl.created_at desc
  limit 1;
end;
$$;
