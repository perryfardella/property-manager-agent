-- Migration: Enable real-time subscriptions for WhatsApp messages
-- Purpose: Allow dashboard to receive real-time updates when new messages arrive
-- Created: 2024-09-26
-- Tables: whatsapp_messages

-- Note: This migration runs BEFORE user_id column is added
-- The publication will be refreshed in a later migration after user_id is added

-- enable real-time for whatsapp_messages table
alter publication supabase_realtime add table public.whatsapp_messages;
