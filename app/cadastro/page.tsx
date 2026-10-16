import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { signUp } from "@/app/actions/auth";

export default async function Cadastro({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <AuthShell title="Criar conta" erro={q.erro}>
      <form action={signUp} className="form" noValidate>
        <label>Nome completo<input name="fullName" autoComplete="name" required minLength={3} maxLength={120} /></label>
        <label>Telefone (com DDD)<input name="phone" type="tel" autoComplete="tel" required inputMode="tel" maxLength={20} /></label>
        <label>E-mail<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
        <label>Senha (10 a 72 caracteres, com letras e números)<input name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={72} /></label>
        <label>Confirmar senha<input name="confirm" type="password" autoComplete="new-password" required minLength={10} maxLength={72} /></label>
        <label className="check"><input name="age" type="checkbox" required /><span>Declaro que tenho 18 anos ou mais.</span></label>
        <label className="check"><input name="truth" type="checkbox" required /><span>Declaro que as informações fornecidas são verdadeiras.</span></label>
        <label className="check"><input name="terms" type="checkbox" required /><span>Li e aceito os <a href="/#termos" target="_blank" rel="noopener noreferrer">Termos de Uso</a> e estou ciente da <a href="/#privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</a>.</span></label>
        <button className="btn btn--gold" type="submit">Criar conta</button>
      </form>
      <p className="small">Já tem conta? <Link href="/entrar">Entrar</Link></p>
    </AuthShell>
  );
}
