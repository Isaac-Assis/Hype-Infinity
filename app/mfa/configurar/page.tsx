import { redirect } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import { verifyEnrollment } from "@/app/actions/auth";
import { requireUser } from "@/lib/auth";

export default async function ConfigurarMfa({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const { supabase } = await requireUser();
  const { data: factors } = await supabase.auth.mfa.listFactors();
  if (factors?.totp?.length) redirect("/mfa/verificar"); // já configurado: apenas verifica
  for (const f of factors?.all ?? []) await supabase.auth.mfa.unenroll({ factorId: f.id }); // limpa tentativas não concluídas
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Aplicativo autenticador" });
  if (error || !data) redirect("/entrar?erro=falha");
  return (
    <AuthShell title="Ativar verificação em duas etapas" erro={q.erro}>
      <p>Leia o QR code com um aplicativo autenticador (como Google Authenticator) e digite o código de 6 dígitos.</p>
      <img className="qr" src={data.totp.qr_code} alt="QR code para o aplicativo autenticador" width={200} height={200} />
      <p className="small">Se não puder ler o QR code, digite esta chave no aplicativo: <code>{data.totp.secret}</code></p>
      <form action={verifyEnrollment} className="form">
        <input type="hidden" name="factorId" value={data.id} />
        <label>Código de 6 dígitos<input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required maxLength={6} /></label>
        <button className="btn btn--gold" type="submit">Confirmar</button>
      </form>
    </AuthShell>
  );
}
