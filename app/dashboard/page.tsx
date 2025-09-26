import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WhatsAppSignup } from "@/components/whatsapp-signup";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // Check if user has an active WhatsApp account
  const { data: whatsappAccount } = await supabase
    .from("whatsapp_accounts")
    .select("id, phone_number, verified_name, waba_name, is_active")
    .eq("user_id", data.claims.sub)
    .eq("is_active", true)
    .single();

  return (
    <div className="flex h-svh w-full flex-col">
      {/* WhatsApp Connection Banner */}
      <div
        className="w-full px-4 py-3 text-white"
        style={{ backgroundColor: whatsappAccount ? "#22c55e" : "#25D366" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* WhatsApp Icon */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="flex-shrink-0"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <div>
              {whatsappAccount ? (
                <>
                  <p className="font-medium">WhatsApp Business Connected</p>
                  <p className="text-sm opacity-90">
                    {whatsappAccount.verified_name || whatsappAccount.waba_name}{" "}
                    • {whatsappAccount.phone_number}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">Connect Your WhatsApp Business</p>
                  <p className="text-sm opacity-90">
                    Link your WhatsApp number to start automating guest
                    responses
                  </p>
                </>
              )}
            </div>
          </div>

          {whatsappAccount ? (
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
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
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <WhatsAppSignup />
          )}
        </div>
      </div>
    </div>
  );
}
