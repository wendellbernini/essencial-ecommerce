import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import { PromoBanner } from "@/components/promo-banner";
import {
  getFeaturedProducts,
  getCategories,
  getNewReleases,
  getActivePromoBanners,
  getPromotionalProducts,
  supabase,
} from "@/lib/supabase";
import { PromotionalProducts } from "@/components/promotional-products";
import { SecondaryBanners } from "@/components/secondary-banners";
import { SecondaryBanner } from "@/lib/types";

// Força a página a ser renderizada dinamicamente
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  console.log("Renderizando página inicial...");

  // Buscar produtos em destaque, lançamentos e categorias do Supabase
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();
  const newReleases = await getNewReleases();
  const promoBanners = await getActivePromoBanners();
  const promotionalProducts = await getPromotionalProducts();

  // Buscar banners secundários
  const { data: secondaryBanners } = await supabase
    .from("secondary_banners")
    .select("*")
    .eq("is_active", true)
    .order("type", { ascending: true })
    .order("order_index", { ascending: true });

  // Separar os banners por tipo
  const doubleBanners =
    secondaryBanners?.filter(
      (banner: SecondaryBanner) => banner.type === "double"
    ) || [];
  const carouselBanners =
    secondaryBanners?.filter(
      (banner: SecondaryBanner) => banner.type === "carousel"
    ) || [];

  console.log("Dados obtidos:", {
    featuredProductsCount: featuredProducts.length,
    categoriesCount: categories.length,
    newReleasesCount: newReleases.length,
    promoBannersCount: promoBanners.length,
    promotionalProductsCount: promotionalProducts.length,
    secondaryBannersCount: secondaryBanners?.length || 0,
  });

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Banner Promocional */}
        <PromoBanner slides={promoBanners} />

        {/* Categorias populares */}
        <section className="py-6 bg-white">
          <div className="container mx-auto">
            <div className="flex items-center justify-between">
              {categories.map((category) => (
                <Link
                  href={`/categoria/${category.slug}`}
                  key={category.id}
                  className="flex items-center justify-between px-4 py-2.5 text-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all text-sm font-medium shadow-[0_2px_6px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] flex-1 mx-2 group"
                >
                  <span className="uppercase tracking-[0.2em] w-full text-center">
                    {category.name}
                  </span>
                  <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-gray-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Promoções */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <PromotionalProducts products={promotionalProducts} />
          </div>
        </section>

        {/* Banners Secundários */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <SecondaryBanners
              doubleBanners={doubleBanners}
              carouselBanners={carouselBanners}
            />
          </div>
          <div className="container mx-auto px-4 mt-8">
            <div className="border-b border-gray-100"></div>
          </div>
        </section>

        {/* Produtos em destaque */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Nossas escolhas para você
              </h2>
              <Tabs
                defaultValue="all"
                className="bg-white rounded-lg border border-gray-200"
              >
                <TabsList className="bg-gray-50">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-white data-[state=active]:text-orange-500 text-gray-600"
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger
                    value="under25"
                    className="data-[state=active]:bg-white data-[state=active]:text-orange-500 text-gray-600"
                  >
                    Até R$125
                  </TabsTrigger>
                  <TabsTrigger
                    value="under50"
                    className="data-[state=active]:bg-white data-[state=active]:text-orange-500 text-gray-600"
                  >
                    Até R$250
                  </TabsTrigger>
                  <TabsTrigger
                    value="under100"
                    className="data-[state=active]:bg-white data-[state=active]:text-orange-500 text-gray-600"
                  >
                    Até R$500
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {featuredProducts.slice(0, 10).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Lançamentos */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Lançamentos</h2>
              <Button
                variant="link"
                className="text-orange-500 hover:text-orange-600"
              >
                Ver todos
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
              {newReleases.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
