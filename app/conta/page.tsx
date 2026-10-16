import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { signOut } from "@/app/actions/auth";
import { requireRole } from "@/lib/auth";

const ROLES = { cliente: "Cliente", funcionario: "Funcionário", admin: "Administrador" } as const;

export default async function Conta({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  const { supabase, profile } = await requireRole(["cliente", "funcionario", "admin"]);
  const { data: factors } = await supabase.auth.mfa.listFactors();
  const hasMfa = Boolean(factors?.totp?.length);
  return (
    <AuthShell title="Minha conta" ok={q.ok}>
      <p>Olá, {profile.full_name}. Perfil: <strong>{ROLES[profile.role]}</strong>.</p>
      <p className="small">Verificação em duas etapas: {hasMfa ? "ativa" : "desativada"}{!hasMfa && <> | <Link href="/mfa/configurar">Ativar</Link></>}</p>
      <p>
        {profile.role !== "cliente" && <Link className="btn btn--line" href="/equipe">Área da equipe</Link>}{" "}
        {profile.role === "admin" && <Link className="btn btn--line" href="/admin">Painel administrativo</Link>}
      </p>
      <form action={signOut}><button className="btn btn--ghost" type="submit">Sair</button></form>
    </AuthShell>
  );
}
