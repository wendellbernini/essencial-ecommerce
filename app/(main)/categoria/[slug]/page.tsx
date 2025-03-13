import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/server-data";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { Database } from "@/types/supabase";
import { Filters } from "@/components/category/filters";
import { ProductGrid } from "@/components/product-grid";

// Força a página a ser renderizada dinamicamente
export const dynamic = "force-dynamic";

type Subcategory = Database["public"]["Tables"]["subcategories"]["Row"];

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    subcategory?: string;
    maxPrice?: string;
    minPrice?: string;
    sortBy?: string;
    necessidade?: string[];
    tipo_pele?: string[];
    brand?: string;
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
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

  // Buscar subcategorias e classificações da categoria
  const supabase = createServerSupabaseClient();
  const [subcategoriesResult, classificationsResult, brandsResult] =
    await Promise.all([
      supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", category.id)
        .order("name"),
      supabase
        .from("classifications")
        .select("*")
        .eq("category_id", category.id)
        .order("type", { ascending: true })
        .order("name", { ascending: true }),
      supabase.from("brands").select("*").order("name"),
    ]);

  const subcategories = subcategoriesResult.data || [];
  const classifications = classificationsResult.data || [];
  const brands = brandsResult.data || [];

  // Preparar filtros
  const filters: {
    subcategoryId?: number;
    maxPrice?: number;
    minPrice?: number;
    sortBy?: string;
    brandSlug?: string;
    [key: string]: any;
  } = {};

  console.log("Parâmetros de URL recebidos:", searchParams);

  // Aplicar filtros dos parâmetros da URL
  if (searchParams) {
    // Filtros básicos
    if (searchParams.subcategory) {
      const selectedSubcategory = subcategories?.find(
        (sub: Subcategory) => sub.slug === searchParams.subcategory
      );
      if (selectedSubcategory) {
        filters.subcategoryId = selectedSubcategory.id;
      }
    }

    if (searchParams.brand) {
      filters.brandSlug = searchParams.brand;
    }

    if (searchParams.maxPrice) {
      filters.maxPrice = parseFloat(searchParams.maxPrice);
    }

    if (searchParams.minPrice) {
      filters.minPrice = parseFloat(searchParams.minPrice);
    }

    if (searchParams.sortBy) {
      filters.sortBy = searchParams.sortBy;
    }

    // Processar todos os outros parâmetros como filtros de classificação
    Object.entries(searchParams).forEach(([key, value]) => {
      if (
        !["subcategory", "maxPrice", "minPrice", "sortBy", "brand"].includes(
          key
        )
      ) {
        // Converter para array se não for
        const values = Array.isArray(value) ? value : [value];
        filters[key] = values;
      }
    });
  }

  console.log("Filtros processados:", filters);

  // Buscar produtos da categoria com filtros
  const products = await getProductsByCategory(category.id, filters);

  console.log(`Produtos retornados: ${products.length}`);

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

      {/* Container principal com grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Coluna de filtros */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Filters
              subcategories={subcategories}
              classifications={classifications}
              brands={brands}
              currentSubcategory={searchParams?.subcategory}
              currentBrand={searchParams?.brand}
              currentSortBy={searchParams?.sortBy}
              currentMaxPrice={searchParams?.maxPrice}
              currentMinPrice={searchParams?.minPrice}
              currentNecessidade={filters.necessidade || []}
              currentTipoPele={filters.tipoPele || []}
              categorySlug={params.slug}
            />
          </div>

          {/* Coluna de produtos */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h2>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou buscar em outras categorias.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    {products.length}{" "}
                    {products.length === 1
                      ? "produto encontrado"
                      : "produtos encontrados"}
                  </p>
                </div>
                <ProductGrid products={products} />
              </>
            )}
          </div>
        </div>
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
