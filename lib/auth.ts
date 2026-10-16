import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Role = "cliente" | "funcionario" | "admin";
export type Profile = { full_name: string; role: Role; status: string };

export async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser(); // valida o token no servidor de autenticação
  if (!user) redirect("/entrar");
  return { supabase, user };
}

// Verificação feita em cada página protegida, além do middleware (defesa em profundidade).
export async function requireRole(allowed: Role[]) {
  const { supabase, user } = await requireUser();
  const { data } = await supabase.from("profiles").select("full_name,role,status").eq("id", user.id).single();
  const profile = data as Profile | null;
  if (!profile || profile.status !== "ativo") redirect("/entrar?erro=suspenso");
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (profile.role !== "cliente" && aal?.currentLevel !== "aal2") {
    redirect(aal?.nextLevel === "aal2" ? "/mfa/verificar" : "/mfa/configurar");
  }
  if (!allowed.includes(profile.role)) redirect("/conta");
  return { supabase, user, profile };
}
