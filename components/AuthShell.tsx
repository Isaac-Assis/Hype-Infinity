import Link from "next/link";
import { ERRORS, OKS } from "@/lib/messages";

export default function AuthShell({ title, erro, ok, children }: { title: string; erro?: string; ok?: string; children: React.ReactNode }) {
  return (
    <main className="auth">
      <div className="auth__card">
        <Link className="brand" href="/">
          <img src="/assets/logo.png" alt="" width={47} height={28} />
          <span className="brand__name">Hype Infinity</span>
        </Link>
        <h1>{title}</h1>
        {erro && Object.hasOwn(ERRORS, erro) && <p className="msg msg--err" role="alert">{ERRORS[erro]}</p>}
        {ok && Object.hasOwn(OKS, ok) && <p className="msg msg--ok" role="status">{OKS[ok]}</p>}
        {children}
      </div>
    </main>
  );
}
