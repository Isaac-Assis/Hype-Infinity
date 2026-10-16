import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { requestReset } from "@/app/actions/auth";

export default async function Recuperar({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <AuthShell title="Recuperar senha" erro={q.erro} ok={q.ok}>
      <form action={requestReset} className="form">
        <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <button className="btn btn--gold" type="submit">Enviar instruções</button>
      </form>
      <p className="small"><Link href="/entrar">Voltar para entrar</Link></p>
    </AuthShell>
  );
}
