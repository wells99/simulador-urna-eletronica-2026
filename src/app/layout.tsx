import type { Metadata } from "next";
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
      </body>
    </html>
  );
}
