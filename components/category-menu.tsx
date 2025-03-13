import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";

interface CategoryMenuProps {
  categorySlug: string;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
}

interface Classification {
  id: number;
  name: string;
  type: string;
  slug: string;
}

interface LatestProduct {
  id: number;
  name: string;
  slug: string;
  images: string[];
  price: number;
  sale_price: number | null;
}

export function CategoryMenu({ categorySlug }: CategoryMenuProps) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const [latestProduct, setLatestProduct] = useState<LatestProduct | null>(
    null
  );
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadCategoryData() {
      console.log("Carregando dados da categoria:", categorySlug);
      // Primeiro, busca o ID da categoria pelo slug
      const { data: categoryData, error: categoryError } = await supabase
        .from("categories")
        .select("id, name")
        .eq("slug", categorySlug)
        .single();

      console.log("Dados da categoria:", categoryData, "Erro:", categoryError);

      if (categoryData) {
        // Carrega subcategorias, classificações e último produto
        const [subcatsResult, classResult, latestProductResult] =
          await Promise.all([
            supabase
              .from("subcategories")
              .select("*")
              .eq("category_id", categoryData.id)
              .order("name"),
            supabase
              .from("classifications")
              .select("*")
              .eq("category_id", categoryData.id)
              .order("type, name"),
            supabase
              .from("products")
              .select("id, name, slug, images, price, sale_price")
              .eq("category_id", categoryData.id)
              .order("created_at", { ascending: false })
              .limit(1)
              .single(),
          ]);

        console.log("Último produto encontrado:", latestProductResult.data);

        if (subcatsResult.data) setSubcategories(subcatsResult.data);
        if (classResult.data) setClassifications(classResult.data);
        if (latestProductResult.data)
          setLatestProduct(latestProductResult.data);
      }
    }

    loadCategoryData();
  }, [categorySlug, supabase]);

  // Agrupa classificações por tipo
  const groupedClassifications = classifications.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Classification[]>);

  // Formatar preço para o formato brasileiro
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  return (
    <div className="absolute left-0 bg-white shadow-lg z-50 rounded-b-lg border-t border-gray-100">
      <div
        className="p-6 grid gap-8"
        style={{
          gridTemplateColumns:
            Object.keys(groupedClassifications).length > 0
              ? `repeat(${Math.min(
                  2 + Object.keys(groupedClassifications).length,
                  4
                )}, minmax(200px, 1fr))`
              : "repeat(2, minmax(200px, 1fr))",
        }}
      >
        {/* Subcategorias */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wide">
            Principais
          </h3>
          <ul className="space-y-4">
            {subcategories.map((subcategory) => (
              <li key={subcategory.id}>
                <Link
                  href={`/categoria/${categorySlug}?subcategory=${subcategory.slug}`}
                  className="text-sm text-gray-600 hover:text-orange-500"
                >
                  {subcategory.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Classificações agrupadas */}
        {Object.entries(groupedClassifications).map(([type, items]) => (
          <div key={type}>
            <h3 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wide">
              {type.replace(/_/g, " ")}
            </h3>
            <ul className="space-y-4">
              {items.map((classification) => (
                <li key={classification.id}>
                  <Link
                    href={`/categoria/${categorySlug}?${encodeURIComponent(
                      type.toLowerCase().replace(/\s+/g, "_")
                    )}=${encodeURIComponent(classification.name)}`}
                    className="text-sm text-gray-600 hover:text-orange-500"
                  >
                    {classification.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Último lançamento */}
        {latestProduct && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-6 uppercase tracking-wide">
              Último Lançamento
            </h3>
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={latestProduct.images[0]}
                  alt={latestProduct.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                  {latestProduct.name}
                </h4>
                <Link href={`/produto/${latestProduct.slug}`}>
                  <Button className="w-full mt-6 bg-black hover:bg-gray-900 text-white">
                    Eu quero!
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
