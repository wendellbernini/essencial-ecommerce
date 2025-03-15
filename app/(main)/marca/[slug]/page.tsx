import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/server-supabase";
import { ProductGrid } from "@/components/product-grid";
import { Filters } from "@/components/category/filters";
import { Database } from "@/types/supabase";
import Image from "next/image";

// Força a página a ser renderizada dinamicamente
export const dynamic = "force-dynamic";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_classifications: Array<{
    classification_id: number;
    classifications: {
      id: number;
      name: string;
      type: string;
    };
  }>;
};

interface BrandPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    categoria?: string;
    maxPrice?: string;
    minPrice?: string;
    sortBy?: string;
    necessidade?: string[];
    tipo_pele?: string[];
    acabamento?: string[];
    cobertura?: string[];
    textura?: string[];
    funcao?: string[];
    fragrancia?: string[];
    tipo_cabelo?: string[];
    nivel_protecao?: string[];
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
  const supabase = createServerSupabaseClient();

  // Buscar marca
  const { data: brand } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!brand) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold text-gray-900">
            Marca não encontrada
          </h1>
          <p className="mt-4 text-gray-600">
            A marca que você está procurando não existe ou foi removida.
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

  // Buscar categorias e classificações
  const [categoriesResult, classificationsResult] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase
      .from("classifications")
      .select("*")
      .order("type", { ascending: true })
      .order("name", { ascending: true }),
  ]);

  const categories = categoriesResult.data || [];
  const classifications = classificationsResult.data || [];

  // Preparar filtros
  const filters: {
    categoryId?: number;
    maxPrice?: number;
    minPrice?: number;
    sortBy?: string;
    necessidade?: string[];
    tipo_pele?: string[];
    acabamento?: string[];
    cobertura?: string[];
    textura?: string[];
    funcao?: string[];
    fragrancia?: string[];
    tipo_cabelo?: string[];
    nivel_protecao?: string[];
    [key: string]: any;
  } = {};

  // Aplicar filtros dos parâmetros da URL
  if (searchParams) {
    if (searchParams.categoria) {
      const selectedCategory = categories?.find(
        (cat) => cat.slug === searchParams.categoria
      );
      if (selectedCategory) {
        filters.categoryId = selectedCategory.id;
      }
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

    // Processar filtros de classificação
    const classificationTypes = [
      "necessidade",
      "tipo_pele",
      "acabamento",
      "cobertura",
      "textura",
      "funcao",
      "fragrancia",
      "tipo_cabelo",
      "nivel_protecao",
    ] as const;

    type ClassificationType = (typeof classificationTypes)[number];

    classificationTypes.forEach((type) => {
      const key = type as ClassificationType;
      if (searchParams[key]) {
        filters[key] = Array.isArray(searchParams[key])
          ? searchParams[key]
          : [searchParams[key]];
      }
    });
  }

  // Buscar produtos da marca com filtros
  let query = supabase
    .from("products")
    .select(
      `
      *,
      categories:category_id(*),
      brand:brand_id(*),
      product_classifications(
        classification_id,
        classifications(
          id,
          name,
          type
        )
      )
    `
    )
    .eq("brand_id", brand.id);

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  if (filters.minPrice) {
    query = query.gte("price", filters.minPrice);
  }

  // Aplicar filtros de classificação
  const { data: products } = await query;

  // Filtrar produtos com base nas classificações selecionadas
  let filteredProducts = products || [];

  const classificationTypes = [
    "necessidade",
    "tipo_pele",
    "acabamento",
    "cobertura",
    "textura",
    "funcao",
    "fragrancia",
    "tipo_cabelo",
    "nivel_protecao",
  ] as const;

  type ClassificationType = (typeof classificationTypes)[number];

  classificationTypes.forEach((type) => {
    const filterValues = searchParams?.[type as keyof typeof searchParams];
    if (filterValues && filterValues.length > 0) {
      filteredProducts = filteredProducts.filter((product: Product) => {
        const productClassifications = product.product_classifications
          .map((pc) => pc.classifications)
          .filter((c) => c.type === type)
          .map((c) => c.name);
        return (
          Array.isArray(filterValues) ? filterValues : [filterValues]
        ).some((value) => productClassifications.includes(value));
      });
    }
  });

  // Aplicar ordenação após a filtragem
  if (filters.sortBy) {
    filteredProducts.sort((a: Product, b: Product) => {
      switch (filters.sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "created-asc":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "created-desc":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });
  } else {
    filteredProducts.sort(
      (a: Product, b: Product) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Cabeçalho da marca */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-2">
              {brand.logo_url && (
                <Image
                  src={brand.logo_url}
                  alt={`Logo ${brand.name}`}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              )}
              <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
            </div>
            {brand.description && (
              <p className="text-gray-600">{brand.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Container principal com grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Coluna de filtros */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Filters
              categories={categories}
              classifications={classifications}
              currentCategory={searchParams?.categoria}
              currentSortBy={searchParams?.sortBy}
              currentMaxPrice={searchParams?.maxPrice}
              currentMinPrice={searchParams?.minPrice}
              currentNecessidade={filters.necessidade || []}
              currentTipoPele={filters.tipo_pele || []}
              brandSlug={params.slug}
            />
          </div>

          {/* Coluna de produtos */}
          <div className="flex-1">
            {!filteredProducts || filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h2>
                <p className="text-gray-600">
                  Tente ajustar os filtros ou buscar em outras marcas.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    {filteredProducts.length}{" "}
                    {filteredProducts.length === 1
                      ? "produto encontrado"
                      : "produtos encontrados"}
                  </p>
                </div>
                <ProductGrid products={filteredProducts} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
