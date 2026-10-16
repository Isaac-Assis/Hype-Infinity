import { describe, expect, it } from "vitest";
import { signUpSchema, signUpErrorKey, passwordSchema, mfaSchema } from "../lib/validation";

const ok = { fullName: "Maria Silva", phone: "(61) 91234-5678", email: "Maria@Exemplo.com ", password: "senhaforte123", confirm: "senhaforte123", age: "on", truth: "on", terms: "on" };

describe("cadastro", () => {
  it("aceita dados válidos e normaliza e-mail e telefone", () => {
    const r = signUpSchema.parse(ok);
    expect(r.email).toBe("maria@exemplo.com");
    expect(r.phone).toBe("61912345678");
  });
  it("exige a declaração de maioridade (não pode estar ausente)", () => {
    const { age, ...semIdade } = ok;
    const r = signUpSchema.safeParse(semIdade);
    expect(r.success).toBe(false);
    if (!r.success) expect(signUpErrorKey(r.error.issues)).toBe("declaracoes");
  });
  it("rejeita valor diferente de 'on' nas declarações", () => {
    expect(signUpSchema.safeParse({ ...ok, age: "true" }).success).toBe(false);
  });
  it("rejeita senhas diferentes, curtas, sem número ou longas demais", () => {
    expect(signUpSchema.safeParse({ ...ok, confirm: "outra" }).success).toBe(false);
    expect(passwordSchema.safeParse("curta1").success).toBe(false);
    expect(passwordSchema.safeParse("somenteletras").success).toBe(false);
    expect(passwordSchema.safeParse("a1".repeat(40)).success).toBe(false);
  });
  it("rejeita telefone e e-mail inválidos", () => {
    expect(signUpSchema.safeParse({ ...ok, phone: "123" }).success).toBe(false);
    expect(signUpSchema.safeParse({ ...ok, email: "sem-arroba" }).success).toBe(false);
  });
  it("ignora campos extras como 'role' (papel nunca vem do formulário)", () => {
    const r = signUpSchema.parse({ ...ok, role: "admin" }) as Record<string, unknown>;
    expect("role" in r).toBe(false);
  });
});

describe("mfa", () => {
  it("aceita só código de 6 dígitos e id de fator UUID", () => {
    const id = "123e4567-e89b-42d3-a456-426614174000";
    expect(mfaSchema.safeParse({ factorId: id, code: "123456" }).success).toBe(true);
    expect(mfaSchema.safeParse({ factorId: id, code: "12345a" }).success).toBe(false);
    expect(mfaSchema.safeParse({ factorId: "x", code: "123456" }).success).toBe(false);
  });
});
