import { useState, useEffect } from "react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

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

export function CategoryMenu({ categorySlug }: CategoryMenuProps) {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [classifications, setClassifications] = useState<Classification[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadCategoryData() {
      // Primeiro, busca o ID da categoria pelo slug
      const { data: categoryData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (categoryData) {
        // Carrega subcategorias e classificações
        const [subcatsResult, classResult] = await Promise.all([
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
        ]);

        if (subcatsResult.data) setSubcategories(subcatsResult.data);
        if (classResult.data) setClassifications(classResult.data);
      }
    }

    loadCategoryData();
  }, [categorySlug]);

  // Agrupa classificações por tipo
  const groupedClassifications = classifications.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Classification[]>);

  return (
    <div className="absolute left-0 right-0 bg-white shadow-lg z-50 min-w-[600px] rounded-b-lg border-t border-gray-100">
      <div className="p-6 grid grid-cols-3 gap-8">
        {/* Subcategorias */}
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">
            Principais
          </h3>
          <ul className="space-y-2.5">
            {subcategories.map((subcategory) => (
              <li key={subcategory.id}>
                <Link
                  href={`/categoria/${categorySlug}/${subcategory.slug}`}
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
            <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">
              {type.replace(/_/g, " ")}
            </h3>
            <ul className="space-y-2.5">
              {items.map((classification) => (
                <li key={classification.id}>
                  <Link
                    href={`/categoria/${categorySlug}?filter=${classification.slug}`}
                    className="text-sm text-gray-600 hover:text-orange-500"
                  >
                    {classification.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
