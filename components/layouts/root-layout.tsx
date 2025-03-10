"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isAdminPage = pathname?.startsWith("/admin");

  if (isLoginPage || isAdminPage) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="bg-gray-900 text-white py-2 px-4 text-center text-sm">
          <p>
            Aproveite até 30% de desconto! Confira nossas ofertas especiais
            hoje.
          </p>
        </div>
        <Header />
      </div>
      <div className="h-[120px]" />{" "}
      {/* Espaçador para compensar o header fixo */}
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
