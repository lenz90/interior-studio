import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const OTP_TYPES: EmailOtpType[] = ["signup", "email", "recovery", "invite", "magiclink", "email_change"];

// Solo rutas internas: evita redirecciones abiertas (//host, /\host, esquemas).
function safeNext(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return "/app";
  return value;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = safeNext(searchParams.get("next"));
  const fail = (reason: "expired" | "invalid") =>
    NextResponse.redirect(`${origin}/login?error=${reason}`);

  // Supabase informa sus errores por query (error, error_code); no se reenvían tal cual.
  if (searchParams.get("error") || searchParams.get("error_code")) {
    return fail(searchParams.get("error_code") === "otp_expired" ? "expired" : "invalid");
  }

  const supabase = await createClient();
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (code) {
    // Flujo PKCE (plantilla por defecto {{ .ConfirmationURL }}).
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return fail("expired");
    return NextResponse.redirect(`${origin}${next}`);
  }

  if (tokenHash && type && OTP_TYPES.includes(type)) {
    // Flujo token_hash (plantilla con /auth/callback?token_hash=...&type=...).
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (error) return fail("expired");
    return NextResponse.redirect(`${origin}${next}`);
  }

  return fail("invalid");
}
