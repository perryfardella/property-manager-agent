-- Migration: Add user_id column to whatsapp_messages table for realtime RLS
-- Purpose: Fix Supabase realtime delivery by adding direct user_id reference
-- Created: 2025-09-29
-- Tables: whatsapp_messages

-- 1️⃣ Add user_id column to whatsapp_messages table
alter table public.whatsapp_messages 
add column if not exists user_id uuid references auth.users(id) on delete cascade;

-- 2️⃣ Create index on user_id for performance
create index if not exists idx_whatsapp_messages_user_id on public.whatsapp_messages (user_id);

-- 3️⃣ Backfill existing rows with user_id from related whatsapp_accounts
do $$
begin
  if exists (
    select 1 from public.whatsapp_messages 
    where user_id is null 
    limit 1
  ) then
    update public.whatsapp_messages 
    set user_id = wa.user_id
    from public.whatsapp_accounts wa
    where whatsapp_messages.whatsapp_account_id = wa.id
      and whatsapp_messages.user_id is null;
    
    raise notice 'Backfilled user_id for existing whatsapp_messages rows';
  else
    raise notice 'No existing rows to backfill';
  end if;
end $$;

-- 4️⃣ Make user_id not null after backfilling
alter table public.whatsapp_messages 
alter column user_id set not null;

-- 5️⃣ Drop old RLS policies
drop policy if exists "users can view own whatsapp messages" on public.whatsapp_messages;
drop policy if exists "system can insert whatsapp messages" on public.whatsapp_messages;
drop policy if exists "users can update own whatsapp message status" on public.whatsapp_messages;
drop policy if exists "users can delete own whatsapp messages" on public.whatsapp_messages;

-- 6️⃣ Create new simplified RLS policies

-- Users can select their own messages
create policy "users can view own whatsapp messages"
on public.whatsapp_messages
for select
to authenticated
using (user_id = auth.uid());

-- Users can insert their own messages (optional if your app lets them send messages)
create policy "users can insert own whatsapp messages"
on public.whatsapp_messages
for insert
to authenticated
with check (user_id = auth.uid());

-- Service role can insert messages via webhook (bypasses RLS)
create policy "service role can insert whatsapp messages"
on public.whatsapp_messages
for insert
to authenticated
with check (true);

-- Users can update their own message status
create policy "users can update own whatsapp message status"
on public.whatsapp_messages
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Users can delete their own messages
create policy "users can delete own whatsapp messages"
on public.whatsapp_messages
for delete
to authenticated
using (user_id = auth.uid());

-- 7️⃣ Update the get_user_whatsapp_messages function to use user_id directly
-- Drop the existing function first since we're changing the return type
drop function if exists public.get_user_whatsapp_messages(uuid, integer, integer);

-- Recreate the function with the new signature
create function public.get_user_whatsapp_messages(
  user_id_param uuid,
  limit_param integer default 50,
  offset_param integer default 0
)
returns table (
  id bigint,
  whatsapp_account_id bigint,
  user_id uuid,
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
    m.whatsapp_account_id,
    m.user_id,
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
  where m.user_id = user_id_param
  order by m.timestamp_sent desc nulls last, m.created_at desc
  limit limit_param
  offset offset_param;
end;
$$;

-- 8️⃣ Add comment explaining the change
comment on column public.whatsapp_messages.user_id is 'Direct reference to auth.users.id for RLS policies and realtime subscriptions';