"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

// Types for the Facebook SDK responses
interface SessionInfoData {
  type: string;
  event: "FINISH" | "CANCEL" | "ERROR";
  data: {
    phone_number_id?: string;
    waba_id?: string;
    current_step?: string;
    error_message?: string;
  };
}

interface FBAuthResponse {
  authResponse?: {
    code: string;
    userID: string;
    expiresIn: number;
    signedRequest: string;
  };
  status: string;
}

// Extend Window interface for Facebook SDK
declare global {
  interface Window {
    FB: {
      init: (config: {
        appId: string;
        autoLogAppEvents: boolean;
        xfbml: boolean;
        version: string;
      }) => void;
      login: (
        callback: (response: FBAuthResponse) => void,
        options: {
          config_id: string;
          response_type: string;
          override_default_response_type: boolean;
          extras: { version: string };
        }
      ) => void;
    };
    fbAsyncInit: () => void;
  }
}

interface WhatsAppSignupProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

export function WhatsAppSignup({
  onSuccess,
  onError,
  className,
}: WhatsAppSignupProps) {
  const [sessionInfo, setSessionInfo] = useState<SessionInfoData | null>(null);
  const [whatsappData, setWhatsappData] = useState<{
    waba_id?: string;
    phone_number_id?: string;
  } | null>(null);
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  // Get configuration from environment
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const configId = process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID;

  useEffect(() => {
    if (!appId || !configId) {
      setError(
        "Facebook configuration missing. Please check environment variables."
      );
      return;
    }

    // Set up message event listener for session info from embedded signup
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from Facebook domains
      if (
        event.origin !== "https://www.facebook.com" &&
        event.origin !== "https://web.facebook.com"
      ) {
        return;
      }

      try {
        const data = JSON.parse(event.data) as SessionInfoData;

        if (data.type === "WA_EMBEDDED_SIGNUP") {
          setSessionInfo(data);

          if (data.event === "FINISH") {
            const { phone_number_id, waba_id } = data.data;
            console.log("WhatsApp signup completed:", {
              phone_number_id,
              waba_id,
            });
            // Store the WhatsApp data for later use in token exchange
            setWhatsappData({ waba_id, phone_number_id });
          } else if (data.event === "CANCEL") {
            const { current_step } = data.data;
            console.warn(
              "User cancelled WhatsApp signup at step:",
              current_step
            );
            setIsConnecting(false);
            setError("WhatsApp signup was cancelled");
            onError?.("WhatsApp signup was cancelled");
          } else if (data.event === "ERROR") {
            const { error_message } = data.data;
            console.error("WhatsApp signup error:", error_message);
            setIsConnecting(false);
            setError(error_message || "An error occurred during signup");
            onError?.(error_message || "An error occurred during signup");
          }
        }
      } catch {
        console.log("Non-JSON response received:", event.data);
      }
    };

    window.addEventListener("message", handleMessage);

    // Check if Facebook SDK is already loaded
    if (window.FB) {
      setIsSDKLoaded(true);
    } else {
      // Wait for the SDK to initialize (it's loaded in layout.tsx)
      const checkSDK = () => {
        if (window.FB) {
          setIsSDKLoaded(true);
        } else {
          setTimeout(checkSDK, 100);
        }
      };
      checkSDK();
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [appId, configId, onError]);

  // Callback function for Facebook login
  const fbLoginCallback = (response: FBAuthResponse) => {
    console.log("Facebook login response:", response);

    if (response.authResponse && response.status === "connected") {
      const code = response.authResponse.code;

      // Handle the async token exchange in a separate function
      handleTokenExchange(code);
    } else {
      console.error("Facebook login failed:", response);
      setError("Facebook login failed");
      setIsConnecting(false);
      onError?.("Facebook login failed");
    }
  };

  // Separate async function to handle token exchange
  const handleTokenExchange = async (code: string) => {
    try {
      // Get current user session
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Wait a bit for WhatsApp data to be available if not already set
      let finalWabaId = whatsappData?.waba_id || sessionInfo?.data?.waba_id;
      let finalPhoneNumberId =
        whatsappData?.phone_number_id || sessionInfo?.data?.phone_number_id;

      // If we don't have the WhatsApp data yet, wait a bit and check again
      if (!finalWabaId || !finalPhoneNumberId) {
        console.log("WhatsApp data not immediately available, waiting...");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Check again after waiting
        finalWabaId = whatsappData?.waba_id || sessionInfo?.data?.waba_id;
        finalPhoneNumberId =
          whatsappData?.phone_number_id || sessionInfo?.data?.phone_number_id;
      }

      // Prepare the data to send
      const requestData = {
        code,
        wabaId: finalWabaId,
        phoneNumberId: finalPhoneNumberId,
      };

      console.log("Sending token exchange request with data:", requestData);
      console.log("WhatsApp data state:", whatsappData);
      console.log("Session info state:", sessionInfo);

      // Send the authorization code to backend for token exchange
      const tokenExchangeResponse = await fetch(
        "/api/whatsapp/exchange-token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      const result = await tokenExchangeResponse.json();

      if (!tokenExchangeResponse.ok) {
        throw new Error(result.error || "Failed to exchange token");
      }

      console.log("WhatsApp account connected successfully:", result);
      setSuccess(true);
      setIsConnecting(false);
      setError(null);
      onSuccess?.();

      // Refresh the page to show updated connection status
      router.refresh();
    } catch (error) {
      console.error("Token exchange failed:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to connect WhatsApp account";
      setError(errorMessage);
      setIsConnecting(false);
      onError?.(errorMessage);
    }
  };

  // Launch WhatsApp embedded signup flow
  const launchWhatsAppSignup = () => {
    if (!isSDKLoaded || !window.FB) {
      setError("Facebook SDK not loaded yet");
      return;
    }

    if (!configId) {
      setError("WhatsApp configuration ID missing");
      return;
    }

    setIsConnecting(true);
    setError(null);
    setSuccess(false);

    // Launch Facebook login with WhatsApp configuration
    window.FB.login(fbLoginCallback, {
      config_id: configId,
      response_type: "code",
      override_default_response_type: true,
      extras: { version: "v3" },
    });
  };

  // Show success state
  if (success) {
    return (
      <div className={className}>
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-green-800">
              WhatsApp Business Account Connected!
            </p>
            <p className="text-sm text-green-600">
              Your WhatsApp Business account has been successfully connected.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <Button
        onClick={() => launchWhatsAppSignup()}
        disabled={!isSDKLoaded || isConnecting}
        className="rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
        style={{ color: "#25D366" }}
      >
        {isConnecting ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
            Connecting...
          </div>
        ) : !isSDKLoaded ? (
          "Loading..."
        ) : (
          "Connect WhatsApp"
        )}
      </Button>

      {/* Debug information - only show in development */}
      {process.env.NODE_ENV === "development" && sessionInfo && (
        <div className="mt-4">
          <details className="text-xs">
            <summary className="cursor-pointer text-gray-500">
              Debug: Session Info
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 p-2 text-xs">
              {JSON.stringify(sessionInfo, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}
