-- Migration: Create WhatsApp accounts table for storing WhatsApp Business API integration data
-- Purpose: Store access tokens, business account details, and phone numbers linked to users
-- Created: 2024-09-26
-- Tables: whatsapp_accounts

-- create the whatsapp_accounts table to store whatsapp business api integration data
create table public.whatsapp_accounts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  waba_id text, -- whatsapp business account id from meta
  phone_number_id text, -- phone number id from meta
  access_token text not null, -- encrypted access token for api calls
  waba_name text, -- business account name
  waba_currency text, -- business account currency
  waba_timezone_id text, -- business account timezone
  phone_number text, -- display phone number
  verified_name text, -- verified business name for the phone number
  code_verification_status text, -- verification status of the phone number
  quality_rating text, -- quality rating of the phone number
  is_active boolean not null default true, -- whether this account is actively being used
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

comment on table public.whatsapp_accounts is 'stores whatsapp business api integration details for each user including access tokens and account metadata';

-- create indexes for performance
create index idx_whatsapp_accounts_user_id on public.whatsapp_accounts (user_id);
create index idx_whatsapp_accounts_waba_id on public.whatsapp_accounts (waba_id);
create index idx_whatsapp_accounts_phone_number_id on public.whatsapp_accounts (phone_number_id);
create index idx_whatsapp_accounts_is_active on public.whatsapp_accounts (is_active);

-- ensure only one active whatsapp account per user (business requirement)
create unique index idx_whatsapp_accounts_user_active on public.whatsapp_accounts (user_id) 
where is_active = true;

-- enable row level security
alter table public.whatsapp_accounts enable row level security;

-- rls policy: users can only see their own whatsapp accounts
create policy "users can view own whatsapp accounts"
on public.whatsapp_accounts
for select
to authenticated
using (auth.uid() = user_id);

-- rls policy: users can insert their own whatsapp accounts
create policy "users can insert own whatsapp accounts"
on public.whatsapp_accounts
for insert
to authenticated
with check (auth.uid() = user_id);

-- rls policy: users can update their own whatsapp accounts
create policy "users can update own whatsapp accounts"
on public.whatsapp_accounts
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- rls policy: users can delete their own whatsapp accounts
create policy "users can delete own whatsapp accounts"
on public.whatsapp_accounts
for delete
to authenticated
using (auth.uid() = user_id);

-- create function to automatically update the updated_at timestamp
create or replace function public.update_whatsapp_accounts_updated_at()
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
create trigger update_whatsapp_accounts_updated_at_trigger
before update on public.whatsapp_accounts
for each row
execute function public.update_whatsapp_accounts_updated_at();
