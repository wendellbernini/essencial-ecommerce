import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Essencial - Cosméticos e Beleza",
  description:
    "Loja online de produtos cosméticos e de beleza. Encontre produtos exclusivos de vendedores independentes.",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
