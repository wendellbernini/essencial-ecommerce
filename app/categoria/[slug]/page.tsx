import Image from "next/image";
import Link from "next/link";
import { Heart, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "@/components/product-card";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/supabase";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Buscar categoria e produtos
  const category = await getCategoryBySlug(params.slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold text-gray-900">
            Categoria não encontrada
          </h1>
          <p className="mt-4 text-gray-600">
            A categoria que você está procurando não existe ou foi removida.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-orange-500 hover:text-orange-600"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  // Buscar produtos da categoria
  const products = await getProductsByCategory(category.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Cabeçalho da categoria */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {category.name}
            </h1>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Filtros e Ordenação */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-orange-500 hover:bg-orange-50 border border-gray-200"
              >
                Filtrar
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-orange-500 hover:bg-orange-50 border border-gray-200"
              >
                Ordenar por
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div>
              <Tabs
                defaultValue="all"
                className="bg-white rounded-lg border border-gray-200"
              >
                <TabsList className="bg-white">
                  <TabsTrigger
                    value="all"
                    className="text-gray-600 hover:text-orange-500 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-500"
                  >
                    Todos
                  </TabsTrigger>
                  <TabsTrigger
                    value="under125"
                    className="text-gray-600 hover:text-orange-500 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-500"
                  >
                    Até R$125
                  </TabsTrigger>
                  <TabsTrigger
                    value="under250"
                    className="text-gray-600 hover:text-orange-500 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-500"
                  >
                    Até R$250
                  </TabsTrigger>
                  <TabsTrigger
                    value="under500"
                    className="text-gray-600 hover:text-orange-500 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-500"
                  >
                    Até R$500
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              Nenhum produto encontrado nesta categoria
            </h2>
            <p className="text-gray-600">
              Tente buscar em outras categorias ou volte mais tarde.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Produtos relacionados */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Você também pode gostar
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="group">
                <div className="relative mb-3 rounded-lg overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=150&width=150&text=Sugestão${
                      i + 1
                    }`}
                    alt={`Produto Sugerido ${i + 1}`}
                    width={150}
                    height={150}
                    className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                  Produto Sugerido
                </h3>
                <p className="font-medium text-sm">
                  R${(50 + i * 17.5).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
