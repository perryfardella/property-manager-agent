-- Migration: Refresh realtime publication after adding user_id column
-- Purpose: Fix "mismatch between server and client bindings" by refreshing the publication
-- Created: 2024-12-20
-- Tables: whatsapp_messages
-- This migration must run AFTER 20241220120000_add_user_id_to_whatsapp_messages.sql

-- Remove and re-add the table to the realtime publication
-- This ensures the publication includes ALL current columns including user_id
do $$
begin
  -- Try to drop the table from publication (ignore error if not present)
  begin
    alter publication supabase_realtime drop table public.whatsapp_messages;
  exception
    when others then
      raise notice 'Table was not in publication, continuing...';
  end;
  
  -- Add the table to publication with current schema
  alter publication supabase_realtime add table public.whatsapp_messages;
  
  raise notice 'Realtime publication refreshed for whatsapp_messages with all current columns';
end $$;

