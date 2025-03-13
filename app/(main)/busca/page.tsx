import { Suspense } from "react";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { ProductCard } from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/lib/supabase";

// Força a página a ser dinâmica
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SearchPageProps {
  searchParams: {
    q?: string;
    categoria?: string;
    precoMin?: string;
    precoMax?: string;
    emEstoque?: string;
  };
}

async function getFilteredProducts(
  searchParams: SearchPageProps["searchParams"]
): Promise<Product[]> {
  const supabase = createServerComponentClient({ cookies });
  const { q, categoria, precoMin, precoMax, emEstoque } = searchParams;

  let query = supabase.from("products").select(
    `
      id,
      name,
      slug,
      description,
      price,
      sale_price,
      category_id,
      stock_quantity,
      images,
      featured,
      created_at,
      updated_at,
      categories (
        id,
        name,
        slug
      )
    `
  );

  // Filtro por termo de busca
  if (q) {
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`);
  }

  // Filtro por categoria
  if (categoria) {
    query = query.eq("categories.slug", categoria);
  }

  // Filtro por preço
  if (precoMin) {
    query = query.gte("price", parseFloat(precoMin));
  }
  if (precoMax) {
    query = query.lte("price", parseFloat(precoMax));
  }

  // Filtro por estoque
  if (emEstoque === "true") {
    query = query.gt("stock_quantity", 0);
  }

  const { data: products, error } = await query.limit(50);

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }

  return products;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const products = await getFilteredProducts(searchParams);
  const supabase = createServerComponentClient({ cookies });
  const { data: categories } = await supabase.from("categories").select("*");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar com filtros */}
        <div className="w-full md:w-64 space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Categorias</h3>
            <div className="space-y-2">
              {categories?.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Checkbox id={category.slug} />
                  <label
                    htmlFor={category.slug}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Faixa de Preço</h3>
            <div className="space-y-4">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>R$ 0</span>
                <span>R$ 1.000</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-3">Disponibilidade</h3>
            <div className="flex items-center">
              <Checkbox id="em-estoque" />
              <label
                htmlFor="em-estoque"
                className="ml-2 text-sm font-medium leading-none"
              >
                Em estoque
              </label>
            </div>
          </div>
        </div>

        {/* Lista de produtos */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {searchParams.q
                ? `Resultados para "${searchParams.q}"`
                : "Todos os produtos"}
            </h2>
            <Select defaultValue="relevancia">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevancia">Mais relevantes</SelectItem>
                <SelectItem value="menor-preco">Menor preço</SelectItem>
                <SelectItem value="maior-preco">Maior preço</SelectItem>
                <SelectItem value="mais-vendidos">Mais vendidos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Suspense
              fallback={
                <div className="col-span-full text-center py-12">
                  Carregando produtos...
                </div>
              }
            >
              {products.length > 0 ? (
                <>
                  <div className="col-span-full mb-6">
                    <p className="text-sm text-gray-600">
                      {products.length}{" "}
                      {products.length === 1
                        ? "produto encontrado"
                        : "produtos encontrados"}
                    </p>
                  </div>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </>
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Nenhum produto encontrado</p>
                </div>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
