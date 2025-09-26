# WhatsApp Webhook Setup Guide

This guide walks you through setting up the WhatsApp webhook to receive messages in your application.

## Prerequisites

- ✅ WhatsApp Business API app configured in Meta Developer Console
- ✅ Embedded signup flow working (users can connect their WhatsApp accounts)
- ✅ Database migrations applied (`whatsapp_accounts` and `whatsapp_messages` tables exist)
- ✅ Environment variables configured

## Step 1: Add Webhook Environment Variable

Add the webhook verification token to your `.env.local`:

```bash
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_secure_random_string_here
```

Generate a secure random string:

```bash
openssl rand -base64 32
```

## Step 2: Configure Webhook in Meta Developer Console

1. **Go to your Facebook App** in [Meta Developer Console](https://developers.facebook.com/)

2. **Navigate to WhatsApp > Configuration**

3. **Add Webhook URL**:

   - **Callback URL**: `https://your-domain.com/api/whatsapp/webhook`
   - **Verify Token**: Use the same value as `WHATSAPP_WEBHOOK_VERIFY_TOKEN`

4. **Subscribe to Webhook Fields**:

   - ✅ `messages` - To receive incoming messages
   - ✅ `message_deliveries` - To track message delivery status

5. **Click "Verify and Save"**

## Step 3: Test the Webhook

### 3.1 Webhook Verification Test

The webhook endpoint should respond to Meta's verification:

```bash
curl -X GET "https://your-domain.com/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_VERIFY_TOKEN&hub.challenge=test_challenge"
```

Expected response: `test_challenge`

### 3.2 Send a Test Message

1. **Send a message** to your connected WhatsApp Business number from your personal phone
2. **Check the dashboard** - the message should appear in the "WhatsApp Messages" panel
3. **Check browser console** for any errors

## Step 4: Webhook Endpoint Details

The webhook endpoint `/api/whatsapp/webhook` handles:

### Incoming Messages

- **Text messages**: Displays the message content
- **Media messages**: Shows media type with caption (if any)
- **Location messages**: Shows location details
- **Document messages**: Shows filename and type

### Message Status Updates

- **sent**: Message sent successfully
- **delivered**: Message delivered to recipient
- **read**: Message read by recipient
- **failed**: Message delivery failed

## Database Structure

### Messages are stored with:

- `whatsapp_message_id`: Unique ID from WhatsApp
- `direction`: "inbound" or "outbound"
- `from_phone_number`: Sender's phone number
- `to_phone_number`: Recipient's phone number
- `message_type`: text, image, audio, video, document, location
- `message_content`: Parsed content based on type
- `raw_webhook_data`: Full webhook payload for debugging
- `message_status`: received, sent, delivered, read, failed
- `timestamp_sent`: When the message was sent

## Real-time Updates

The dashboard automatically updates when new messages arrive using Supabase real-time subscriptions.

## Troubleshooting

### Common Issues:

1. **Webhook verification fails**:

   - Check `WHATSAPP_WEBHOOK_VERIFY_TOKEN` matches in both env and Meta console
   - Ensure webhook URL is accessible and uses HTTPS

2. **Messages not appearing**:

   - Check webhook logs in Meta Developer Console
   - Check application logs for errors
   - Verify `phone_number_id` matches between webhook and database

3. **Database errors**:
   - Ensure migrations are applied: `supabase db push`
   - Check RLS policies allow message insertion

### Debug Webhook Payloads:

Check the application logs to see incoming webhook payloads:

```bash
# If using Vercel
vercel logs

# Or check your hosting platform's logs
```

## Security Notes

- ✅ Webhook verification prevents unauthorized requests
- ✅ RLS policies ensure users only see their own messages
- ✅ Raw webhook data stored for debugging but not exposed to frontend
- ✅ Phone numbers and message content are properly filtered by user

## Next Steps

With the webhook working, you can now:

- Build conversation threading
- Implement AI auto-responses
- Add message sending functionality
- Create property-specific messaging rules
