import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookieDefaults } from "@/lib/cookies";

const PROTECTED = ["/conta", "/equipe", "/admin", "/mfa"];

function buildCsp(nonce: string) {
  // Em desenvolvimento (npm run dev) o Next usa eval e injeta estilos; em produção a política é estrita.
  const dev = process.env.NODE_ENV === "development";
  const parts = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${dev ? " 'unsafe-eval'" : ""}`,
    dev ? "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com" : `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    dev ? "font-src 'self' https://fonts.gstatic.com" : "font-src https://fonts.gstatic.com",
    "img-src 'self' data:",
    dev ? "connect-src 'self' ws: wss:" : "connect-src 'self'", // o navegador não fala com o Supabase: toda autenticação passa pelo servidor
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ];
  if ((process.env.SITE_URL ?? "").startsWith("https://")) parts.push("upgrade-insecure-requests");
  return parts.join("; ");
}

export async function middleware(req: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const csp = buildCsp(nonce);
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("x-nonce", nonce);
  reqHeaders.set("Content-Security-Policy", csp);
  const fresh = () => {
    const r = NextResponse.next({ request: { headers: reqHeaders } });
    r.headers.set("Content-Security-Policy", csp);
    return r;
  };
  let res = fresh();

  const path = req.nextUrl.pathname;
  if (!PROTECTED.some((p) => path === p || path.startsWith(p + "/"))) return res;

  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll(list) {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = fresh();
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, { ...options, ...cookieDefaults }));
      }
    }
  });
  const go = (to: string) => {
    const r = NextResponse.redirect(new URL(to, req.url));
    res.cookies.getAll().forEach((c) => r.cookies.set(c));
    r.headers.set("Content-Security-Policy", csp);
    return r;
  };

  let user = null;
  try { user = (await supabase.auth.getUser()).data.user; } catch { /* serviço indisponível: trata como sem sessão */ }
  if (!user) return go("/entrar");

  const { data: prof } = await supabase.from("profiles").select("role,status").eq("id", user.id).single();
  if (!prof || prof.status !== "ativo") { await supabase.auth.signOut(); return go("/entrar?erro=suspenso"); }

  if (!path.startsWith("/mfa")) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const staff = prof.role !== "cliente";
    if (staff && aal?.currentLevel !== "aal2") return go(aal?.nextLevel === "aal2" ? "/mfa/verificar" : "/mfa/configurar");
    if (!staff && aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2") return go("/mfa/verificar");
    if (path.startsWith("/admin") && prof.role !== "admin") return go("/conta");
    if (path.startsWith("/equipe") && prof.role === "cliente") return go("/conta");
  }
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|assets/|favicon.ico).*)"]
};
