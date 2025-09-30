import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { encryptAccessToken } from "@/lib/crypto";

interface TokenExchangeRequest {
    code: string;
    wabaId?: string;
    phoneNumberId?: string;
}

interface FacebookTokenResponse {
    access_token: string;
    token_type: string;
}

interface WhatsAppBusinessAccount {
    id: string;
    name: string;
    currency: string;
    timezone_id: string;
}

interface PhoneNumber {
    id: string;
    display_phone_number: string;
    verified_name: string;
    code_verification_status: string;
    quality_rating: string;
}

// App Router version
export async function POST(request: NextRequest) {
    try {
        // Check authentication first
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth
            .getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 },
            );
        }

        const { code, wabaId, phoneNumberId }: TokenExchangeRequest =
            await request.json();

        if (!code) {
            return NextResponse.json(
                { error: "Authorization code is required" },
                { status: 400 },
            );
        }

        // Step 1: Exchange authorization code for access token
        const tokenResponse = await exchangeCodeForToken(code);

        if (!tokenResponse.access_token) {
            return NextResponse.json(
                { error: "Failed to exchange code for access token" },
                { status: 500 },
            );
        }

        // Step 2: Get WhatsApp Business Account details
        const wabaDetails = wabaId
            ? await getWhatsAppBusinessAccount(
                wabaId,
                tokenResponse.access_token,
            )
            : null;

        // Step 3: Get Phone Number details
        const phoneDetails = phoneNumberId
            ? await getPhoneNumberDetails(
                phoneNumberId,
                tokenResponse.access_token,
            )
            : null;

        // Step 4: Store the token and details in your database
        await storeWhatsAppData(
            {
                accessToken: tokenResponse.access_token,
                wabaId,
                phoneNumberId,
                wabaDetails,
                phoneDetails,
            },
            user.id,
            supabase,
        );

        return NextResponse.json({
            success: true,
            data: {
                wabaId,
                phoneNumberId,
                wabaDetails,
                phoneDetails,
                // Don't return the actual access token to the frontend for security
                tokenStored: true,
            },
        });
    } catch (error) {
        console.error("Token exchange error:", error);
        return NextResponse.json(
            { error: "Internal server error during token exchange" },
            { status: 500 },
        );
    }
}

async function exchangeCodeForToken(
    code: string,
): Promise<FacebookTokenResponse> {
    const appId = process.env.FACEBOOK_APP_ID!;
    const appSecret = process.env.FACEBOOK_APP_SECRET!;

    const tokenUrl =
        `https://graph.facebook.com/v23.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${code}`;

    const response = await fetch(tokenUrl, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            `Token exchange failed: ${
                errorData.error?.message || response.statusText
            }`,
        );
    }

    return response.json();
}

async function getWhatsAppBusinessAccount(
    wabaId: string,
    accessToken: string,
): Promise<WhatsAppBusinessAccount> {
    const url =
        `https://graph.facebook.com/v23.0/${wabaId}?fields=id,name,currency,timezone_id&access_token=${accessToken}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            `Failed to get WABA details: ${
                errorData.error?.message || response.statusText
            }`,
        );
    }

    return response.json();
}

async function getPhoneNumberDetails(
    phoneNumberId: string,
    accessToken: string,
): Promise<PhoneNumber> {
    const url =
        `https://graph.facebook.com/v23.0/${phoneNumberId}?fields=id,display_phone_number,verified_name,code_verification_status,quality_rating&access_token=${accessToken}`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
            `Failed to get phone number details: ${
                errorData.error?.message || response.statusText
            }`,
        );
    }

    return response.json();
}

async function storeWhatsAppData(
    data: {
        accessToken: string;
        wabaId?: string;
        phoneNumberId?: string;
        wabaDetails?: WhatsAppBusinessAccount | null;
        phoneDetails?: PhoneNumber | null;
    },
    userId: string,
    supabase: Awaited<ReturnType<typeof createClient>>,
) {
    try {
        // First, deactivate any existing WhatsApp accounts for this user
        // (business requirement: only one active account per user)
        const { error: deactivateError } = await supabase
            .from("whatsapp_accounts")
            .update({ is_active: false })
            .eq("user_id", userId)
            .eq("is_active", true);

        if (deactivateError) {
            console.error(
                "Error deactivating existing accounts:",
                deactivateError,
            );
            throw new Error("Failed to deactivate existing WhatsApp accounts");
        }

        // Encrypt the access token before storing
        const encryptedAccessToken = await encryptAccessToken(data.accessToken);

        // Insert the new WhatsApp account data
        const { data: insertedData, error: insertError } = await supabase
            .from("whatsapp_accounts")
            .insert({
                user_id: userId,
                waba_id: data.wabaId,
                phone_number_id: data.phoneNumberId,
                access_token: encryptedAccessToken,
                waba_name: data.wabaDetails?.name,
                waba_currency: data.wabaDetails?.currency,
                waba_timezone_id: data.wabaDetails?.timezone_id,
                phone_number: data.phoneDetails?.display_phone_number,
                verified_name: data.phoneDetails?.verified_name,
                code_verification_status: data.phoneDetails
                    ?.code_verification_status,
                quality_rating: data.phoneDetails?.quality_rating,
                is_active: true,
            })
            .select()
            .single();

        if (insertError) {
            console.error("Error inserting WhatsApp account:", insertError);
            throw new Error("Failed to store WhatsApp account data");
        }

        // Successfully stored WhatsApp account data

        return { success: true, accountId: insertedData.id };
    } catch (error) {
        console.error("Failed to store WhatsApp data:", error);
        throw error;
    }
}
