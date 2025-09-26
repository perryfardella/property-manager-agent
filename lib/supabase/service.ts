import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with service role key for server-side operations
 * that need to bypass Row Level Security (RLS) policies.
 *
 * WARNING: This client has full database access. Only use for:
 * - Webhooks that need to write data
 * - Admin operations
 * - Background jobs
 *
 * Never expose the service role key to the client-side!
 */
export function createServiceClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables",
        );
    }

    return createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}
