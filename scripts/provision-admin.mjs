// Provisionamento seguro do primeiro administrador (rode SOMENTE na sua máquina).
// Uso:  node --env-file=.env.local scripts/provision-admin.mjs invite <email> --yes
//       node --env-file=.env.local scripts/provision-admin.mjs promote <email> --yes
//       node --env-file=.env.local scripts/provision-admin.mjs reset-mfa <email> --yes
// Usa a SERVICE ROLE KEY, que nunca deve ir para o repositório, para a Vercel ou para o navegador.
import { createClient } from "@supabase/supabase-js";

const [mode, email, flag] = process.argv.slice(2);
const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SITE_URL } = process.env;
if (!["invite", "promote", "reset-mfa"].includes(mode) || !email?.includes("@")) {
  console.error("Uso: provision-admin.mjs <invite|promote|reset-mfa> <email> --yes");
  process.exit(1);
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !SITE_URL) {
  console.error("Defina SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY e SITE_URL em .env.local");
  process.exit(1);
}
if (flag !== "--yes") {
  console.error(`Isto vai executar "${mode}" para ${email}. Repita o comando com --yes para confirmar.`);
  process.exit(1);
}
const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });

async function findUser(mail) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const u = data.users.find((x) => x.email?.toLowerCase() === mail.toLowerCase());
    if (u) return u;
    if (data.users.length < 200) break;
  }
  return null;
}
const audit = (action, userId, details = {}) =>
  db.from("audit_log").insert({ actor_id: null, action, resource_type: "profile", resource_id: userId, details: { via: "provision-admin", ...details } });

let user = await findUser(email);
if (mode === "invite") {
  if (user) { console.error("Já existe uma conta com este e-mail. Use o modo promote."); process.exit(1); }
  const { data, error } = await db.auth.admin.inviteUserByEmail(email, { redirectTo: `${SITE_URL}/auth/confirm?next=/redefinir` });
  if (error) throw error;
  user = data.user;
}
if (!user) { console.error("Conta não encontrada."); process.exit(1); }

if (mode === "invite" || mode === "promote") {
  const { error } = await db.from("profiles").update({ role: "admin" }).eq("id", user.id);
  if (error) throw error;
  await audit("admin_provisioned", user.id);
  console.log(`OK: ${email} agora é administrador. No primeiro acesso ela precisará configurar o MFA.`);
} else {
  const { data, error } = await db.auth.admin.mfa.listFactors({ userId: user.id });
  if (error) throw error;
  for (const f of data.factors) await db.auth.admin.mfa.deleteFactor({ id: f.id, userId: user.id });
  await audit("mfa_reset", user.id, { factors_removed: data.factors.length });
  console.log(`OK: ${data.factors.length} fator(es) removido(s). A pessoa configurará um novo no próximo login.`);
}
