import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import { requireRole } from "@/lib/auth";

export default async function Equipe() {
  const { supabase } = await requireRole(["funcionario", "admin"]);
  const { data: perms } = await supabase.from("staff_permissions").select("permission").order("permission");
  return (
    <AuthShell title="Área da equipe">
      <p>Permissões concedidas à sua conta:</p>
      {perms?.length ? <ul>{perms.map((p) => <li key={p.permission}>{p.permission}</li>)}</ul> : <p className="small">Nenhuma permissão concedida ainda. Peça a um administrador.</p>}
      <p className="small">Os módulos de produtos, ofertas, parcerias e candidaturas chegam nas próximas etapas.</p>
      <Link className="btn btn--line" href="/conta">Voltar</Link>
    </AuthShell>
  );
}
