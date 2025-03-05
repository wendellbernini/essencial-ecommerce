import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Essencial - Cosméticos e Beleza",
  description:
    "Loja online de produtos cosméticos e de beleza. Encontre produtos exclusivos de vendedores independentes.",
  generator: "Next.js",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <div className="bg-[#FDEBD2] text-[#222222] py-2 px-4 text-center text-sm">
              <p>
                Aproveite até 30% de desconto! Confira nossas ofertas especiais
                hoje.
              </p>
            </div>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
