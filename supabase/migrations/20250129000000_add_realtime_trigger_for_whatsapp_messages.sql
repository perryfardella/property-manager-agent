-- Migration: Realtime trigger for whatsapp_messages
-- Purpose: Ensure Realtime delivery for service role inserts
-- Created: 2025-01-29

-- 1. Create trigger function that includes user context
create or replace function public.notify_new_whatsapp_message()
returns trigger as $$
begin
  -- Notify via Realtime channel with user context
  -- The payload includes the user_id so the frontend can filter appropriately
  perform pg_notify(
    'whatsapp_messages_channel',
    json_build_object(
      'event', 'INSERT',
      'user_id', NEW.user_id,
      'data', row_to_json(NEW)
    )::text
  );
  return NEW;
end;
$$ language plpgsql;

-- 2. Attach trigger to whatsapp_messages table
drop trigger if exists trigger_notify_whatsapp_message on public.whatsapp_messages;

create trigger trigger_notify_whatsapp_message
after insert on public.whatsapp_messages
for each row
execute function public.notify_new_whatsapp_message();

-- 3. Add comment for clarity
comment on function public.notify_new_whatsapp_message() is 'Trigger to notify Realtime subscribers when a new whatsapp_messages row is inserted, includes user context for proper filtering';

-- 4. Optional: Create a more targeted notification function for updates
create or replace function public.notify_updated_whatsapp_message()
returns trigger as $$
begin
  -- Only notify if the message status changed (common update scenario)
  if OLD.message_status != NEW.message_status then
    perform pg_notify(
      'whatsapp_messages_channel',
      json_build_object(
        'event', 'UPDATE',
        'user_id', NEW.user_id,
        'data', row_to_json(NEW)
      )::text
    );
  end if;
  return NEW;
end;
$$ language plpgsql;

-- 5. Attach update trigger
drop trigger if exists trigger_notify_updated_whatsapp_message on public.whatsapp_messages;

create trigger trigger_notify_updated_whatsapp_message
after update on public.whatsapp_messages
for each row
execute function public.notify_updated_whatsapp_message();

comment on function public.notify_updated_whatsapp_message() is 'Trigger to notify Realtime subscribers when whatsapp_messages status is updated';
