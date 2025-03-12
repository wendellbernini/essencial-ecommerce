"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/types/supabase";

type Subcategory = Database["public"]["Tables"]["subcategories"]["Row"];

interface FiltersProps {
  subcategories: Subcategory[];
  currentSubcategory?: string;
  currentSortBy?: string;
  currentMaxPrice?: string;
}

export function Filters({
  subcategories,
  currentSubcategory,
  currentSortBy,
  currentMaxPrice,
}: FiltersProps) {
  const router = useRouter();

  const handleSubcategoryChange = (value: string) => {
    const url = new URL(window.location.href);
    if (value === "all") {
      url.searchParams.delete("subcategory");
    } else {
      url.searchParams.set("subcategory", value);
    }
    router.push(url.toString());
  };

  const handleSortChange = (value: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("sortBy", value);
    router.push(url.toString());
  };

  const handlePriceChange = (value: string) => {
    const url = new URL(window.location.href);
    if (value === "all") {
      url.searchParams.delete("maxPrice");
    } else {
      url.searchParams.set("maxPrice", value);
    }
    router.push(url.toString());
  };

  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filtro de Subcategorias */}
            <Select
              defaultValue={currentSubcategory || "all"}
              onValueChange={handleSubcategoryChange}
            >
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Subcategoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as subcategorias</SelectItem>
                {subcategories?.map((subcategory) => (
                  <SelectItem key={subcategory.id} value={subcategory.slug}>
                    {subcategory.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Ordenação */}
            <Select
              defaultValue={currentSortBy || "newest"}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mais recentes</SelectItem>
                <SelectItem value="oldest">Mais antigos</SelectItem>
                <SelectItem value="price_asc">Menor preço</SelectItem>
                <SelectItem value="price_desc">Maior preço</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtros de Preço */}
          <div>
            <Tabs
              defaultValue={getDefaultPriceTab(currentMaxPrice)}
              onValueChange={handlePriceChange}
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
                  value="125"
                  className="text-gray-600 hover:text-orange-500 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-500"
                >
                  Até R$125
                </TabsTrigger>
                <TabsTrigger
                  value="250"
                  className="text-gray-600 hover:text-orange-500 data-[state=active]:bg-orange-50 data-[state=active]:text-orange-500"
                >
                  Até R$250
                </TabsTrigger>
                <TabsTrigger
                  value="500"
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
  );
}

// Função auxiliar para determinar a aba de preço padrão
function getDefaultPriceTab(maxPrice?: string) {
  if (!maxPrice) return "all";
  const price = parseFloat(maxPrice);
  if (price <= 125) return "125";
  if (price <= 250) return "250";
  if (price <= 500) return "500";
  return "all";
}
