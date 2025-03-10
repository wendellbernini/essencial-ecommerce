"use client";

import { ProductGrid } from "@/components/product-grid";
import { ProductGridWithNavigation } from "@/components/product-grid-with-navigation";
import { PromoBanner } from "@/components/promo-banner";
import { PromotionalProducts } from "@/components/promotional-products";
import { SecondaryBanners } from "@/components/secondary-banners";
import { Product, SecondaryBanner, Brand } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BrandCarousel } from "@/components/brand-carousel";

interface HomeContentProps {
  featuredProducts: Product[];
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  newReleases: Product[];
  promoBanners: any[];
  promotionalProducts: Product[];
  doubleBanners: SecondaryBanner[];
  carouselBanners: SecondaryBanner[];
  brands: Brand[];
}

export function HomeContent({
  featuredProducts,
  categories,
  newReleases,
  promoBanners,
  promotionalProducts,
  doubleBanners,
  carouselBanners,
  brands,
}: HomeContentProps) {
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
        </section>

        {/* Produtos em destaque */}
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 uppercase">
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

            <ProductGridWithNavigation
              products={featuredProducts}
              productsPerPage={10}
              variant="compact"
            />
          </div>
        </section>

        {/* Carrossel de Marcas */}
        <BrandCarousel brands={brands} />

        {/* Lançamentos */}
        <section className="py-12 mt-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 uppercase">
                Lançamentos
              </h2>
              <Button
                variant="link"
                className="text-orange-500 hover:text-orange-600"
              >
                Ver todos
              </Button>
            </div>

            <ProductGrid products={newReleases.slice(0, 5)} />
          </div>
        </section>
      </main>
    </div>
  );
}
