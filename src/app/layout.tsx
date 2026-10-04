import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Simulador de Urna Eletrônica 2026 - Ceará & Brasil",
  description:
    "Simulador interativo de voto da Urna Eletrônica para demonstrar a crianças o processo eleitoral de 2026 com dados públicos do TSE.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col justify-between">
        {children}
        <Script
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "db4e51ebd8a24688ac2300a38bb725e2"}'
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
