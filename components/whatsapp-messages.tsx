"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WhatsAppMessage {
  id: number;
  whatsapp_account_id: number;
  user_id: string;
  whatsapp_message_id: string;
  direction: "inbound" | "outbound";
  from_phone_number: string;
  to_phone_number: string;
  message_type: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  message_content: any;
  message_status: string;
  timestamp_sent: string | null;
  created_at: string;
}

interface WhatsAppMessagesProps {
  className?: string;
}

export function WhatsAppMessages({ className }: WhatsAppMessagesProps) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("User not authenticated");
        return;
      }

      const { data, error: messagesError } = await supabase.rpc(
        "get_user_whatsapp_messages",
        { user_id_param: user.id, limit_param: 50, offset_param: 0 }
      );

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        setError("Failed to load messages");
        return;
      }

      setMessages(data || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchMessages();

    const setupRealtimeSubscription = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel("whatsapp_messages_channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "whatsapp_messages",
          },
          (payload) => {
            const newMessage = payload.new as WhatsAppMessage;

            // RLS already ensures only this user's messages arrive
            setMessages((prev) => [newMessage, ...prev]);
            console.log("Realtime message received:", newMessage);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "whatsapp_messages",
          },
          (payload) => {
            const updatedMessage = payload.new as WhatsAppMessage;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
          }
        )
        .subscribe((status) =>
          console.log("Realtime subscription status:", status)
        );

      return channel;
    };

    let cleanup: (() => void) | undefined;

    setupRealtimeSubscription().then((channel) => {
      if (channel) {
        cleanup = () => supabase.removeChannel(channel);
      }
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [supabase, fetchMessages]);

  const formatPhoneNumber = (phoneNumber: string) =>
    phoneNumber.length > 10 ? `+${phoneNumber}` : phoneNumber;

  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "Unknown time";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0)
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    else if (diffDays === 1) return "Yesterday";
    else if (diffDays < 7)
      return date.toLocaleDateString([], { weekday: "short" });
    else return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const renderMessageContent = (message: WhatsAppMessage) => {
    const content = message.message_content;
    switch (message.message_type) {
      case "text":
        return content.text || "";
      case "image":
        return content.caption ? `📷 Image: ${content.caption}` : "📷 Image";
      case "audio":
        return "🎵 Audio message";
      case "video":
        return content.caption ? `🎥 Video: ${content.caption}` : "🎥 Video";
      case "document":
        return content.filename
          ? `📄 Document: ${content.filename}`
          : "📄 Document";
      case "location":
        return `📍 Location${content.name ? `: ${content.name}` : ""}`;
      default:
        return `${message.message_type} message`;
    }
  };

  const getMessageIcon = (direction: "inbound" | "outbound") =>
    direction === "inbound" ? "⬅️" : "➡️";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "text-blue-600";
      case "delivered":
        return "text-green-600";
      case "read":
        return "text-green-700";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (loading)
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>WhatsApp Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <span className="ml-2 text-gray-600">Loading messages...</span>
          </div>
        </CardContent>
      </Card>
    );

  if (error)
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>WhatsApp Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchMessages}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle>WhatsApp Messages</CardTitle>
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500">Updating live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-4">💬</div>
            <p className="text-gray-600">No messages yet</p>
            <p className="text-sm text-gray-500 mt-2">
              Messages will appear here when guests contact you on WhatsApp
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-3 rounded-lg border ${
                  message.direction === "inbound"
                    ? "bg-gray-50 border-gray-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span>{getMessageIcon(message.direction)}</span>
                    <span className="font-medium text-sm">
                      {message.direction === "inbound"
                        ? formatPhoneNumber(message.from_phone_number)
                        : "You"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(message.timestamp_sent)}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${getStatusColor(
                      message.message_status
                    )}`}
                  >
                    {message.message_status}
                  </span>
                </div>
                <div className="text-sm text-gray-800">
                  {renderMessageContent(message)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
