import type { Metadata } from "next";
import "./globals.css";

export const dynamic = "force-dynamic"; // necessário para o nonce da CSP ser aplicado a cada resposta

export const metadata: Metadata = {
  title: "Hype Infinity | Soluções Digitais e Tecnologia",
  description: "Desenvolvimento de sistemas, mods para jogos e plugins personalizados. Solicite um orçamento da Hype Infinity pelo WhatsApp.",
  icons: { icon: "/assets/favicon.png" },
  openGraph: { type: "website", title: "Hype Infinity | Soluções Digitais e Tecnologia", description: "Ideias que ganham vida. Soluções sem limites.", locale: "pt_BR" }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
