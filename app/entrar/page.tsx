import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { signIn } from "@/app/actions/auth";

export default async function Entrar({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <AuthShell title="Entrar" erro={q.erro} ok={q.ok}>
      <form action={signIn} className="form">
        <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>Senha<input name="password" type="password" autoComplete="current-password" required maxLength={72} /></label>
        <button className="btn btn--gold" type="submit">Entrar</button>
      </form>
      <p className="small"><Link href="/recuperar">Esqueci minha senha</Link> | <Link href="/cadastro">Criar conta</Link></p>
    </AuthShell>
  );
}
