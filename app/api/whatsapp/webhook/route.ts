import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

// WhatsApp webhook payload types
interface WhatsAppWebhookMessage {
    id: string;
    from: string;
    timestamp: string;
    type: string;
    text?: { body: string };
    image?: { id: string; mime_type: string; sha256: string; caption?: string };
    audio?: { id: string; mime_type: string; sha256: string };
    video?: { id: string; mime_type: string; sha256: string; caption?: string };
    document?: {
        id: string;
        filename?: string;
        mime_type: string;
        sha256: string;
        caption?: string;
    };
    location?: {
        latitude: number;
        longitude: number;
        name?: string;
        address?: string;
    };
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    contacts?: Array<any>;
    // Add more message types as needed
}

interface WhatsAppWebhookChange {
    value: {
        messaging_product: string;
        metadata: {
            display_phone_number: string;
            phone_number_id: string;
        };
        contacts?: Array<{
            profile: { name: string };
            wa_id: string;
        }>;
        messages?: WhatsAppWebhookMessage[];
        statuses?: Array<{
            id: string;
            status: string;
            timestamp: string;
            recipient_id: string;
        }>;
    };
    field: string;
}

interface WhatsAppWebhookPayload {
    object: string;
    entry: Array<{
        id: string;
        changes: WhatsAppWebhookChange[];
    }>;
}

// Webhook verification for initial setup
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const verifyToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN;

    if (!verifyToken) {
        console.error(
            "WHATSAPP_WEBHOOK_VERIFY_TOKEN environment variable is not set",
        );
        return NextResponse.json({
            error: "Webhook verification token not configured",
        }, { status: 500 });
    }

    if (mode === "subscribe" && token === verifyToken) {
        console.log("Webhook verified successfully");
        return new NextResponse(challenge, { status: 200 });
    }

    console.error("Webhook verification failed:", { mode, token, challenge });
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// Webhook message processing
export async function POST(request: NextRequest) {
    try {
        const payload: WhatsAppWebhookPayload = await request.json();

        console.log(
            "Received WhatsApp webhook:",
            JSON.stringify(payload, null, 2),
        );

        // Verify this is a WhatsApp webhook
        if (payload.object !== "whatsapp_business_account") {
            console.log("Ignoring non-WhatsApp webhook");
            return NextResponse.json({ status: "ignored" }, { status: 200 });
        }

        const supabase = createServiceClient();

        // Process each entry in the webhook
        for (const entry of payload.entry) {
            for (const change of entry.changes) {
                if (change.field === "messages") {
                    await processMessagesChange(change, supabase, payload);
                }
            }
        }

        return NextResponse.json({ status: "processed" }, { status: 200 });
    } catch (error) {
        console.error("Webhook processing error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}

async function processMessagesChange(
    change: WhatsAppWebhookChange,
    supabase: ReturnType<typeof createServiceClient>,
    fullPayload: WhatsAppWebhookPayload,
) {
    const { value } = change;
    const phoneNumberId = value.metadata.phone_number_id;
    const businessPhoneNumber = value.metadata.display_phone_number;

    // Find the WhatsApp account that matches this phone number ID
    const { data: whatsappAccount, error: accountError } = await supabase
        .from("whatsapp_accounts")
        .select("id, user_id, phone_number")
        .eq("phone_number_id", phoneNumberId)
        .eq("is_active", true)
        .single();

    if (accountError || !whatsappAccount) {
        console.error(
            "WhatsApp account not found for phone_number_id:",
            phoneNumberId,
            accountError,
        );
        return;
    }

    console.log(
        "Found WhatsApp account:",
        whatsappAccount.id,
        "for user:",
        whatsappAccount.user_id,
    );

    // Process incoming messages
    if (value.messages) {
        for (const message of value.messages) {
            await processInboundMessage(
                message,
                whatsappAccount,
                businessPhoneNumber,
                supabase,
                fullPayload,
            );
        }
    }

    // Process message status updates (delivered, read, etc.)
    if (value.statuses) {
        for (const status of value.statuses) {
            await processMessageStatus(status, whatsappAccount, supabase);
        }
    }
}

async function processInboundMessage(
    message: WhatsAppWebhookMessage,
    whatsappAccount: {
        id: number;
        user_id: string;
        phone_number: string | null;
    },
    businessPhoneNumber: string,
    supabase: ReturnType<typeof createServiceClient>,
    fullPayload: WhatsAppWebhookPayload,
) {
    try {
        // Parse message content based on type
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        let messageContent: any = {};

        switch (message.type) {
            case "text":
                messageContent = {
                    text: message.text?.body || "",
                };
                break;
            case "image":
                messageContent = {
                    media_id: message.image?.id,
                    mime_type: message.image?.mime_type,
                    caption: message.image?.caption || "",
                };
                break;
            case "audio":
                messageContent = {
                    media_id: message.audio?.id,
                    mime_type: message.audio?.mime_type,
                };
                break;
            case "video":
                messageContent = {
                    media_id: message.video?.id,
                    mime_type: message.video?.mime_type,
                    caption: message.video?.caption || "",
                };
                break;
            case "document":
                messageContent = {
                    media_id: message.document?.id,
                    filename: message.document?.filename,
                    mime_type: message.document?.mime_type,
                    caption: message.document?.caption || "",
                };
                break;
            case "location":
                messageContent = {
                    latitude: message.location?.latitude,
                    longitude: message.location?.longitude,
                    name: message.location?.name,
                    address: message.location?.address,
                };
                break;
            default:
                messageContent = { type: message.type };
                console.log("Unsupported message type:", message.type);
        }

        // Insert message into database
        const { error: insertError } = await supabase
            .from("whatsapp_messages")
            .insert({
                whatsapp_account_id: whatsappAccount.id,
                user_id: whatsappAccount.user_id,
                whatsapp_message_id: message.id,
                direction: "inbound",
                from_phone_number: message.from,
                to_phone_number: businessPhoneNumber,
                message_type: message.type,
                message_content: messageContent,
                raw_webhook_data: fullPayload,
                message_status: "received",
                timestamp_sent: new Date(parseInt(message.timestamp) * 1000)
                    .toISOString(),
            });

        if (insertError) {
            console.error("Error inserting message:", insertError);
            // Check if it's a duplicate message (unique constraint violation)
            if (insertError.code === "23505") {
                console.log("Duplicate message ignored:", message.id);
                return;
            }
            throw insertError;
        }

        console.log("Message stored successfully:", message.id);
    } catch (error) {
        console.error("Error processing inbound message:", error, message);
    }
}

async function processMessageStatus(
    status: {
        id: string;
        status: string;
        timestamp: string;
        recipient_id: string;
    },
    whatsappAccount: {
        id: number;
        user_id: string;
        phone_number: string | null;
    },
    supabase: ReturnType<typeof createServiceClient>,
) {
    try {
        // Update message status in database
        const { error: updateError } = await supabase
            .from("whatsapp_messages")
            .update({
                message_status: status.status,
                updated_at: new Date().toISOString(),
            })
            .eq("whatsapp_message_id", status.id)
            .eq("whatsapp_account_id", whatsappAccount.id);

        if (updateError) {
            console.error("Error updating message status:", updateError);
            return;
        }

        console.log("Message status updated:", status.id, "->", status.status);
    } catch (error) {
        console.error("Error processing message status:", error, status);
    }
}
