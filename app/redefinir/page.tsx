import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { updatePassword } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/server";

export default async function Redefinir({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/recuperar?erro=link");
  return (
    <AuthShell title="Definir nova senha" erro={q.erro}>
      <form action={updatePassword} className="form">
        <label>Nova senha<input name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={72} /></label>
        <label>Confirmar senha<input name="confirm" type="password" autoComplete="new-password" required minLength={10} maxLength={72} /></label>
        <button className="btn btn--gold" type="submit">Salvar senha</button>
      </form>
    </AuthShell>
  );
}
