import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email().max(254));
const phone = z.string().transform((v) => v.replace(/\D/g, "")).pipe(z.string().regex(/^(55)?[1-9][0-9]{9,10}$/));
// 72 é o limite de bytes do bcrypt usado pelo Supabase Auth
export const passwordSchema = z.string().min(10).max(72).regex(/[A-Za-z]/).regex(/[0-9]/);

export const signUpSchema = z
  .object({
    fullName: z.string().trim().min(3).max(120),
    phone,
    email,
    password: passwordSchema,
    confirm: z.string(),
    age: z.literal("on"),   // maioridade: caixa obrigatória, nunca marcada por padrão
    truth: z.literal("on"),
    terms: z.literal("on")
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"] });

export const signInSchema = z.object({ email, password: z.string().min(1).max(72) });
export const emailOnlySchema = z.object({ email });
export const resetSchema = z.object({ password: passwordSchema, confirm: z.string() }).refine((d) => d.password === d.confirm, { path: ["confirm"] });
export const mfaSchema = z.object({ factorId: z.uuid(), code: z.string().trim().regex(/^[0-9]{6}$/) });

export function signUpErrorKey(issues: { path: PropertyKey[] }[]): "declaracoes" | "senha" | "dados" {
  const keys = issues.map((i) => String(i.path[0]));
  if (keys.some((k) => ["age", "truth", "terms"].includes(k))) return "declaracoes";
  if (keys.some((k) => ["password", "confirm"].includes(k))) return "senha";
  return "dados";
}
