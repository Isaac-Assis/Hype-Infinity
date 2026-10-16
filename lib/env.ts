type Name = "SITE_URL" | "SUPABASE_URL" | "SUPABASE_ANON_KEY";
export function env(name: Name): string {
  const v = process.env[name];
  if (!v) throw new Error(`Variável de ambiente ${name} não definida (veja .env.example)`);
  return v;
}
