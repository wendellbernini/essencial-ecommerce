import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { RootLayout } from "@/components/layouts/root-layout";

const inter = Inter({ subsets: ["latin"] });

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <RootLayout>{children}</RootLayout>
      <CartDrawer />
    </CartProvider>
  );
}
