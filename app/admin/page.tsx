import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { requireRole } from "@/lib/auth";

export default async function Admin() {
  const { supabase } = await requireRole(["admin"]);
  const { data: profiles } = await supabase.from("profiles").select("role");
  const { data: logs } = await supabase.from("audit_log").select("id,action,resource_type,created_at").order("created_at", { ascending: false }).limit(10);
  const count = (r: string) => profiles?.filter((p) => p.role === r).length ?? 0;
  return (
    <AuthShell title="Painel administrativo">
      <p>Contas: {count("cliente")} cliente(s), {count("funcionario")} funcionário(s), {count("admin")} administrador(es).</p>
      <h2 className="h2s">Últimas ações registradas</h2>
      {logs?.length ? (
        <ul>{logs.map((l) => <li key={l.id}>{new Date(l.created_at).toLocaleString("pt-BR")}: {l.action} ({l.resource_type})</li>)}</ul>
      ) : <p className="small">Nenhum registro ainda.</p>}
      <p className="small">Gestão de produtos, ofertas, parcerias, notificações e funcionários chega nas próximas etapas.</p>
      <Link className="btn btn--line" href="/conta">Voltar</Link>
    </AuthShell>
  );
}
