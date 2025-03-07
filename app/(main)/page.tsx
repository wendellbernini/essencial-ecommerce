import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
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
} from "@/lib/supabase";
import { PromotionalProducts } from "@/components/promotional-products";

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

  console.log("Dados obtidos:", {
    featuredProductsCount: featuredProducts.length,
    categoriesCount: categories.length,
    newReleasesCount: newReleases.length,
    promoBannersCount: promoBanners.length,
    promotionalProductsCount: promotionalProducts.length,
  });

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-2">
        {/* Banner Promocional */}
        <PromoBanner slides={promoBanners} />

        {/* Categorias populares */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Categorias populares
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  href={`/categoria/${category.slug}`}
                  key={category.id}
                  className="text-center group"
                >
                  <div className="rounded-full overflow-hidden mb-3 mx-auto w-24 h-24 md:w-32 md:h-32">
                    <Image
                      src={
                        category.image_url ||
                        "/placeholder.svg?height=150&width=150"
                      }
                      alt={category.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Promoções */}
        <section className="py-12 bg-gray-50">
          <div className="container relative mx-auto">
            <div className="px-8">
              <PromotionalProducts products={promotionalProducts} />
            </div>
          </div>
        </section>

        {/* Banners Promocionais Estilo Sephora */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Banner Promocional 1 */}
              <div className="relative overflow-hidden rounded-lg group">
                <Link href="/categoria/skincare">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src="https://res.cloudinary.com/dsvcredfs/image/upload/v1741426079/lpv2ftmpzoiqiqmwcjr4.jpg"
                      alt="Cuidados com a pele"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Cuide da sua pele</h3>
                        <p className="text-sm md:text-base mb-4">Produtos premium para uma rotina completa</p>
                        <span className="inline-block bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
                          Comprar agora
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
              
              {/* Banner Promocional 2 */}
              <div className="relative overflow-hidden rounded-lg group">
                <Link href="/categoria/perfumes">
                  <div className="aspect-[16/9] relative">
                    <Image
                      src="https://res.cloudinary.com/dsvcredfs/image/upload/v1741364650/tum3lfvueih3ucxtr9ji.avif"
                      alt="Fragrâncias exclusivas"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                      <div className="absolute bottom-6 left-6 right-6 text-white">
                        <h3 className="text-xl md:text-2xl font-bold mb-2">Fragrâncias exclusivas</h3>
                        <p className="text-sm md:text-base mb-4">Descubra seu perfume ideal</p>
                        <span className="inline-block bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
                          Explorar coleção
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Produtos em destaque */}
        <section className="py-12 bg-white">
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
