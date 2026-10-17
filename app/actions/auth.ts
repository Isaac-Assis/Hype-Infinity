"use server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";
import { emailOnlySchema, mfaSchema, resetSchema, signInSchema, signUpErrorKey, signUpSchema } from "@/lib/validation";


const TERMS_VERSION = "v1";
const form = (fd: FormData) => Object.fromEntries(fd);

export async function signUp(fd: FormData) {
  const p = signUpSchema.safeParse(form(fd)); // validação no servidor
  if (!p.success) {
    console.log("ERRO DE VALIDAÇÃO DO FORMULÁRIO:", JSON.stringify(p.error.issues, null, 2));
    redirect(`/cadastro?erro=${signUpErrorKey(p.error.issues)}`);
  }

  const d = p.data;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: d.email,
    password: d.password,
    options: {
      emailRedirectTo: `${env("SITE_URL")}/auth/confirm`,
      data: { 
        fullname: d.fullName, 
        phone: d.phone, 
        age_declared: true, 
        info_true: true, 
        terms_accepted: true 
      }
    }
  });

  if (error) {
    console.log("ERRO DO SUPABASE AUTH:", JSON.stringify(error, null, 2));
    console.log("ERRO DO SUPABASE AUTH:", error);
    console.log("=====================================");
    redirect('/cadastro?erro=falha');
  }

  redirect("/entrar?ok=confirme");
}
export async function signIn(fd: FormData) {
  const p = signInSchema.safeParse(form(fd));
  if (!p.success) redirect("/entrar?erro=credenciais");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(p.data);
  if (error) redirect("/entrar?erro=credenciais"); // mensagem única: não revela se a conta existe
  redirect("/conta");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function requestReset(fd: FormData) {
  const p = emailOnlySchema.safeParse(form(fd));
  if (p.success) {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(p.data.email, { redirectTo: `${env("SITE_URL")}/auth/confirm?next=/redefinir` });
  }
  redirect("/recuperar?ok=enviado"); // sempre a mesma resposta
}

export async function updatePassword(fd: FormData) {
  const p = resetSchema.safeParse(form(fd));
  if (!p.success) redirect("/redefinir?erro=senha");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/recuperar");
  const { error } = await supabase.auth.updateUser({ password: p.data.password });
  if (error) redirect("/redefinir?erro=falha");
  redirect("/conta?ok=senha");
}

async function verifyCode(fd: FormData, back: string) {
  const p = mfaSchema.safeParse(form(fd));
  if (!p.success) redirect(`${back}?erro=codigo`);
  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: p.data.factorId, code: p.data.code });
  if (error) redirect(`${back}?erro=codigo`); // o Supabase limita tentativas repetidas
  redirect("/conta");
}
export async function verifyEnrollment(fd: FormData) { return verifyCode(fd, "/mfa/configurar"); }
export async function verifyChallenge(fd: FormData) { return verifyCode(fd, "/mfa/verificar"); }
