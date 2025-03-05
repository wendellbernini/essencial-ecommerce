"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="flex-grow">{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-[#FDEBD2] text-[#222222] py-2 px-4 text-center text-sm">
        <p>
          Aproveite até 30% de desconto! Confira nossas ofertas especiais hoje.
        </p>
      </div>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
