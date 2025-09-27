-- Migration: Fix RLS policy for whatsapp_messages realtime subscriptions
-- Purpose: Revert to the original policy structure that works with realtime
-- Created: 2024-09-27
-- Tables: whatsapp_messages

-- drop the problematic exists-based policy
drop policy if exists "users can view own whatsapp messages" on public.whatsapp_messages;

-- recreate the original policy that works with realtime subscriptions
create policy "users can view own whatsapp messages"
on public.whatsapp_messages
for select
to authenticated
using (
  whatsapp_account_id in (
    select id from public.whatsapp_accounts 
    where user_id = (select auth.uid()) and is_active = true
  )
);
