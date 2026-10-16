import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { verifyChallenge } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth";

export default async function VerificarMfa({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const { supabase } = await requireUser();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const factor = factors?.totp?.[0];
  if (!factor) redirect("/mfa/configurar");
  return (
    <AuthShell title="Verificação em duas etapas" erro={q.erro}>
      <form action={verifyChallenge} className="form">
        <input type="hidden" name="factorId" value={factor.id} />
        <label>Código do aplicativo autenticador<input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6} /></label>
        <button className="btn btn--gold" type="submit">Verificar</button>
      </form>
    </AuthShell>
  );
}
