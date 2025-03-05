import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/contexts/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { PromoBanner } from "@/components/promo-banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Essencial - Cosméticos e Beleza",
  description: "Encontre os melhores produtos de beleza e cosméticos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <CartProvider>
          <PromoBanner />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
