import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";
import { cookieDefaults } from "@/lib/cookies";

export async function createClient() {
  const store = await cookies();
  return createServerClient(env("SUPABASE_URL"), env("SUPABASE_ANON_KEY"), {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, { ...options, ...cookieDefaults }));
        } catch {
          /* chamado de um Server Component: o middleware já renova a sessão */
        }
      }
    }
  });
}
