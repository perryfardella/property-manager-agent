"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WhatsAppMessage {
  id: number;
  whatsapp_account_id: number;
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

type RealtimeStatus = "connecting" | "connected" | "error" | "disconnected";

export function WhatsAppMessages({ className }: WhatsAppMessagesProps) {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] =
    useState<RealtimeStatus>("connecting");
  const [realtimeError, setRealtimeError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("User not authenticated");
        return;
      }

      // Call the database function to get user's messages
      const { data, error: messagesError } = await supabase.rpc(
        "get_user_whatsapp_messages",
        {
          user_id_param: user.id,
          limit_param: 50,
          offset_param: 0,
        }
      );

      if (messagesError) {
        console.error("Error fetching messages:", messagesError);
        setError("Failed to load messages");
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const handleManualRefresh = () => {
    setRealtimeError(null);
    setRealtimeStatus("connecting");
    fetchMessages();
  };

  useEffect(() => {
    fetchMessages();

    // Set up real-time subscription for new messages
    const setupRealtimeSubscription = async () => {
      setRealtimeStatus("connecting");
      // Get current user for filtering
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
            console.log("Real-time message received:", payload);
            const newMessage = payload.new as WhatsAppMessage;

            // RLS policies will ensure only user's messages come through
            setMessages((prev) => [newMessage, ...prev]);
            console.log("Message added to UI");
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
            console.log("Message status updated:", payload);
            const updatedMessage = payload.new as WhatsAppMessage;

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === updatedMessage.id ? updatedMessage : msg
              )
            );
            console.log("Message status updated in UI");
          }
        )
        .subscribe((status) => {
          console.log("Real-time subscription status:", status);
          if (status === "SUBSCRIBED") {
            console.log("Successfully subscribed to realtime messages");
            setRealtimeStatus("connected");
            setRealtimeError(null);
          } else if (status === "CHANNEL_ERROR") {
            console.error("Channel error in realtime subscription");
            setRealtimeStatus("error");
            setRealtimeError(
              "Realtime connection failed - messages may not update automatically"
            );
          } else if (status === "TIMED_OUT") {
            console.error("Realtime subscription timed out");
            setRealtimeStatus("error");
            setRealtimeError(
              "Realtime connection timed out - messages may not update automatically"
            );
          } else if (status === "CLOSED") {
            console.log("Realtime subscription closed");
            setRealtimeStatus("disconnected");
            setRealtimeError("Realtime connection closed");
          }
        });

      return channel;
    };

    let cleanupFunction: (() => void) | undefined;

    setupRealtimeSubscription().then((channel) => {
      if (channel) {
        cleanupFunction = () => {
          supabase.removeChannel(channel);
        };
      }
    });

    return () => {
      if (cleanupFunction) {
        cleanupFunction();
      }
    };
  }, [supabase, fetchMessages]);

  const formatPhoneNumber = (phoneNumber: string): string => {
    // Format phone number for display (remove country code prefix if needed)
    if (phoneNumber.length > 10) {
      return `+${phoneNumber}`;
    }
    return phoneNumber;
  };

  const formatTimestamp = (timestamp: string | null): string => {
    if (!timestamp) return "Unknown time";

    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const renderMessageContent = (message: WhatsAppMessage): string => {
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

  const getMessageIcon = (direction: "inbound" | "outbound"): string => {
    return direction === "inbound" ? "⬅️" : "➡️";
  };

  const getStatusColor = (status: string): string => {
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

  if (loading) {
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
  }

  if (error) {
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
  }

  const getStatusIndicator = () => {
    switch (realtimeStatus) {
      case "connected":
        return (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Live updates</span>
          </div>
        );
      case "connecting":
        return (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-spin" />
            <span>Connecting...</span>
          </div>
        );
      case "error":
      case "disconnected":
        return (
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-600">Connection error</span>
            <button
              onClick={handleManualRefresh}
              className="text-blue-600 hover:text-blue-800 underline text-xs"
            >
              Refresh
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>WhatsApp Messages</span>
          {getStatusIndicator()}
        </CardTitle>
        {realtimeError && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
            {realtimeError}
          </div>
        )}
        {error && (
          <div className="flex justify-end mt-2">
            <button
              onClick={fetchMessages}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              🔄 Retry
            </button>
          </div>
        )}
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
