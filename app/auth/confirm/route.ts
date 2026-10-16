import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

const TYPES = ["signup", "email", "recovery", "invite", "magiclink", "email_change"];

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const tokenHash = q.get("token_hash");
  const type = q.get("type");
  const dest = q.get("next") === "/redefinir" ? "/redefinir" : "/conta"; // lista fixa: sem redirecionamento aberto
  if (tokenHash && type && TYPES.includes(type)) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type: type as EmailOtpType, token_hash: tokenHash });
    if (!error) return NextResponse.redirect(new URL(dest, req.url));
  }
  return NextResponse.redirect(new URL("/entrar?erro=link", req.url));
}
