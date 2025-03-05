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
import { getFeaturedProducts, getCategories } from "@/lib/supabase";

// Força a página a ser renderizada dinamicamente
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  console.log("Renderizando página inicial...");

  // Buscar produtos em destaque e categorias do Supabase
  const featuredProducts = await getFeaturedProducts();
  const categories = await getCategories();

  console.log("Dados obtidos:", {
    featuredProductsCount: featuredProducts.length,
    categoriesCount: categories.length,
  });

  return (
    <div className="min-h-screen bg-white">
      <main>
        {/* Seção principal */}
        <section className="relative bg-[#FDEBD2] py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Encontre coisas que você vai amar. Apoie vendedores
                independentes. Só na Essencial.
              </h1>
              <p className="text-lg text-gray-800 mb-6">
                Descobertas diárias de pequenos negócios criativos.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Decoração
                </Button>
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Joias
                </Button>
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Roupas
                </Button>
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Presentes
                </Button>
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Casamento
                </Button>
              </div>
            </div>
          </div>
        </section>

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

        {/* Produtos em destaque */}
        <section className="py-12 bg-gray-50">
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
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
