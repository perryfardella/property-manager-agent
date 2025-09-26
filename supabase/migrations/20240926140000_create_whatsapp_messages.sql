-- Migration: Create WhatsApp messages table for storing incoming/outgoing messages
-- Purpose: Store all WhatsApp messages received via webhook and sent via API
-- Created: 2024-09-26
-- Tables: whatsapp_messages

-- create the whatsapp_messages table to store all whatsapp messages
create table public.whatsapp_messages (
  id bigint generated always as identity primary key,
  whatsapp_account_id bigint not null references public.whatsapp_accounts (id) on delete cascade,
  whatsapp_message_id text not null, -- unique message id from whatsapp
  direction text not null check (direction in ('inbound', 'outbound')), -- message direction
  from_phone_number text not null, -- sender's phone number (including country code)
  to_phone_number text not null, -- recipient's phone number (including country code)
  message_type text not null, -- text, image, audio, video, document, location, etc.
  message_content jsonb not null, -- parsed message content based on type
  raw_webhook_data jsonb, -- raw webhook payload for debugging (inbound only)
  message_status text default 'received', -- received, sent, delivered, read, failed
  timestamp_sent timestamp with time zone, -- when message was sent (from whatsapp)
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

comment on table public.whatsapp_messages is 'stores all whatsapp messages received via webhook and sent via api for each user account';

-- create indexes for performance
create index idx_whatsapp_messages_account_id on public.whatsapp_messages (whatsapp_account_id);
create index idx_whatsapp_messages_direction on public.whatsapp_messages (direction);
create index idx_whatsapp_messages_from_phone on public.whatsapp_messages (from_phone_number);
create index idx_whatsapp_messages_to_phone on public.whatsapp_messages (to_phone_number);
create index idx_whatsapp_messages_timestamp on public.whatsapp_messages (timestamp_sent desc);
create index idx_whatsapp_messages_created_at on public.whatsapp_messages (created_at desc);
create index idx_whatsapp_messages_message_type on public.whatsapp_messages (message_type);

-- unique constraint to prevent duplicate message processing
create unique index idx_whatsapp_messages_unique_message on public.whatsapp_messages (whatsapp_message_id, whatsapp_account_id);

-- enable row level security
alter table public.whatsapp_messages enable row level security;

-- rls policy: users can only see messages for their own whatsapp accounts
create policy "users can view own whatsapp messages"
on public.whatsapp_messages
for select
to authenticated
using (
  whatsapp_account_id in (
    select id from public.whatsapp_accounts 
    where user_id = auth.uid() and is_active = true
  )
);

-- rls policy: system can insert messages (webhook endpoint)
create policy "system can insert whatsapp messages"
on public.whatsapp_messages
for insert
to authenticated
with check (
  whatsapp_account_id in (
    select id from public.whatsapp_accounts 
    where is_active = true
  )
);

-- rls policy: users can update message status for their own messages
create policy "users can update own whatsapp message status"
on public.whatsapp_messages
for update
to authenticated
using (
  whatsapp_account_id in (
    select id from public.whatsapp_accounts 
    where user_id = auth.uid() and is_active = true
  )
)
with check (
  whatsapp_account_id in (
    select id from public.whatsapp_accounts 
    where user_id = auth.uid() and is_active = true
  )
);

-- rls policy: users can delete their own messages (if needed)
create policy "users can delete own whatsapp messages"
on public.whatsapp_messages
for delete
to authenticated
using (
  whatsapp_account_id in (
    select id from public.whatsapp_accounts 
    where user_id = auth.uid() and is_active = true
  )
);

-- create function to automatically update the updated_at timestamp
create or replace function public.update_whatsapp_messages_updated_at()
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
create trigger update_whatsapp_messages_updated_at_trigger
before update on public.whatsapp_messages
for each row
execute function public.update_whatsapp_messages_updated_at();

-- create function to get messages for a user's active whatsapp account
create or replace function public.get_user_whatsapp_messages(
  user_id_param uuid,
  limit_param integer default 50,
  offset_param integer default 0
)
returns table (
  id bigint,
  whatsapp_message_id text,
  direction text,
  from_phone_number text,
  to_phone_number text,
  message_type text,
  message_content jsonb,
  message_status text,
  timestamp_sent timestamp with time zone,
  created_at timestamp with time zone
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  return query
  select 
    m.id,
    m.whatsapp_message_id,
    m.direction,
    m.from_phone_number,
    m.to_phone_number,
    m.message_type,
    m.message_content,
    m.message_status,
    m.timestamp_sent,
    m.created_at
  from public.whatsapp_messages m
  join public.whatsapp_accounts wa on m.whatsapp_account_id = wa.id
  where wa.user_id = user_id_param 
    and wa.is_active = true
  order by m.timestamp_sent desc nulls last, m.created_at desc
  limit limit_param
  offset offset_param;
end;
$$;
