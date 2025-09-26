import { createClient } from "@/lib/supabase/server";
import { decryptAccessToken } from "@/lib/crypto";

interface WhatsAppAccount {
    id: number;
    user_id: string;
    waba_id: string | null;
    phone_number_id: string | null;
    access_token: string;
    waba_name: string | null;
    waba_currency: string | null;
    waba_timezone_id: string | null;
    phone_number: string | null;
    verified_name: string | null;
    code_verification_status: string | null;
    quality_rating: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * Retrieves the active WhatsApp account for a user and decrypts the access token
 * @param userId - The user's UUID
 * @returns WhatsApp account with decrypted access token, or null if not found
 */
export async function getActiveWhatsAppAccount(
    userId: string,
): Promise<WhatsAppAccount & { decryptedAccessToken: string } | null> {
    const supabase = await createClient();

    const { data: account, error } = await supabase
        .from("whatsapp_accounts")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .single();

    if (error || !account) {
        console.error("Error fetching WhatsApp account:", error);
        return null;
    }

    try {
        // Decrypt the access token
        const decryptedAccessToken = await decryptAccessToken(
            account.access_token,
        );

        return {
            ...account,
            decryptedAccessToken,
        };
    } catch (error) {
        console.error("Error decrypting access token:", error);
        throw new Error("Failed to decrypt WhatsApp access token");
    }
}

/**
 * Retrieves a WhatsApp account by ID and decrypts the access token
 * @param accountId - The WhatsApp account ID
 * @param userId - The user's UUID (for security validation)
 * @returns WhatsApp account with decrypted access token, or null if not found
 */
export async function getWhatsAppAccount(
    accountId: number,
    userId: string,
): Promise<WhatsAppAccount & { decryptedAccessToken: string } | null> {
    const supabase = await createClient();

    const { data: account, error } = await supabase
        .from("whatsapp_accounts")
        .select("*")
        .eq("id", accountId)
        .eq("user_id", userId)
        .single();

    if (error || !account) {
        console.error("Error fetching WhatsApp account:", error);
        return null;
    }

    try {
        // Decrypt the access token
        const decryptedAccessToken = await decryptAccessToken(
            account.access_token,
        );

        return {
            ...account,
            decryptedAccessToken,
        };
    } catch (error) {
        console.error("Error decrypting access token:", error);
        throw new Error("Failed to decrypt WhatsApp access token");
    }
}

/**
 * Updates an existing WhatsApp account's access token (encrypts before storing)
 * @param accountId - The WhatsApp account ID
 * @param userId - The user's UUID (for security validation)
 * @param newAccessToken - The new access token to store
 * @returns Success status
 */
export async function updateWhatsAppAccessToken(
    accountId: number,
    userId: string,
    newAccessToken: string,
): Promise<boolean> {
    const supabase = await createClient();

    try {
        // Encrypt the new access token
        const { encryptAccessToken } = await import("@/lib/crypto");
        const encryptedAccessToken = await encryptAccessToken(newAccessToken);

        const { error } = await supabase
            .from("whatsapp_accounts")
            .update({
                access_token: encryptedAccessToken,
                updated_at: new Date().toISOString(),
            })
            .eq("id", accountId)
            .eq("user_id", userId);

        if (error) {
            console.error("Error updating WhatsApp access token:", error);
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error encrypting and updating access token:", error);
        return false;
    }
}
