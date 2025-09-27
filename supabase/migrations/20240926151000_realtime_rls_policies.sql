-- Migration: Add RLS policies for real-time subscriptions
-- Purpose: Ensure real-time subscriptions work properly with row level security
-- Created: 2024-09-26
-- Tables: whatsapp_messages

-- note: the existing select policy should already cover real-time subscriptions
-- but let's ensure the policy is optimized for real-time operations

-- drop and recreate the select policy with better performance for real-time
drop policy if exists "users can view own whatsapp messages" on public.whatsapp_messages;

-- create optimized select policy for real-time subscriptions
create policy "users can view own whatsapp messages"
on public.whatsapp_messages
for select
to authenticated
using (
  exists (
    select 1 from public.whatsapp_accounts wa
    where wa.id = whatsapp_messages.whatsapp_account_id
      and wa.user_id = auth.uid()
      and wa.is_active = true
  )
);
