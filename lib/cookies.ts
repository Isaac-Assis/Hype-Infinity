// Sem cliente Supabase no navegador, os cookies de sessão podem ser httpOnly (inacessíveis a scripts).
export const cookieDefaults = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/"
};
