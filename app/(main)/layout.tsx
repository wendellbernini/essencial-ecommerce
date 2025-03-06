import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PromoBanner } from "@/components/promo-banner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PromoBanner />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
