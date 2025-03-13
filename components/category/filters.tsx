"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "@/types/supabase";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

type Subcategory = Database["public"]["Tables"]["subcategories"]["Row"];
type Classification = {
  id: number;
  name: string;
  type: string;
  category_id: number;
};

interface FiltersProps {
  subcategories: Subcategory[];
  classifications?: Classification[];
  currentSubcategory?: string;
  currentSortBy?: string;
  currentMaxPrice?: string;
  currentNecessidade?: string[];
  currentTipoPele?: string[];
  categorySlug: string;
}

export function Filters({
  subcategories,
  classifications = [],
  currentSubcategory,
  currentSortBy,
  currentMaxPrice,
  currentNecessidade = [],
  currentTipoPele = [],
  categorySlug,
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Agrupar classificações por tipo
  const groupedClassifications = classifications.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Classification[]>);

  // Função auxiliar para normalizar o tipo de classificação
  const normalizeType = (type: string) => {
    return type.toLowerCase().replace(/\s+/g, "_");
  };

  // Função auxiliar para atualizar URL mantendo outros parâmetros
  const updateSearchParams = useCallback(
    (updates: Record<string, string | string[] | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        newParams.delete(key);
        if (value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => newParams.append(key, v));
        } else {
          newParams.set(key, value);
        }
      });

      return newParams.toString();
    },
    [searchParams]
  );

  const handleSubcategoryChange = (value: string) => {
    const updates = { subcategory: value === "all" ? null : value };
    router.push(`/categoria/${categorySlug}?${updateSearchParams(updates)}`);
  };

  const handleSortChange = (value: string) => {
    const updates = { sortBy: value };
    router.push(`/categoria/${categorySlug}?${updateSearchParams(updates)}`);
  };

  const handlePriceChange = (value: string) => {
    const updates = { maxPrice: value === "all" ? null : value };
    router.push(`/categoria/${categorySlug}?${updateSearchParams(updates)}`);
  };

  const handleClassificationChange = (
    type: string,
    value: string,
    checked: boolean
  ) => {
    console.log(
      `Alterando classificação: tipo=${type}, valor=${value}, checked=${checked}`
    );

    // Normalizar o tipo para lowercase e remover espaços
    const normalizedType = normalizeType(type);

    console.log("Tipo normalizado:", normalizedType);

    // Obter valores atuais do searchParams para este tipo específico
    const currentValues = Array.from(searchParams.getAll(normalizedType));
    console.log(`Valores atuais para ${normalizedType}:`, currentValues);

    let newValues: string[];
    if (checked) {
      newValues = [...new Set([...currentValues, value])];
    } else {
      newValues = currentValues.filter((v) => v !== value);
    }

    console.log(`Novos valores para ${normalizedType}:`, newValues);

    const updates = {
      [normalizedType]: newValues.length > 0 ? newValues : null,
    };

    console.log("Atualizando URL com:", updates);
    router.push(`/categoria/${categorySlug}?${updateSearchParams(updates)}`);
  };

  return (
    <div className="border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filtro de Subcategorias */}
            <Select
              value={currentSubcategory || "all"}
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
              value={currentSortBy || "newest"}
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

            {/* Filtros de Preço */}
            <Tabs
              value={getDefaultPriceTab(currentMaxPrice)}
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

          {/* Filtros específicos por categoria */}
          {Object.entries(groupedClassifications).length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
              {Object.entries(groupedClassifications).map(([type, items]) => {
                const normalizedType = normalizeType(type);
                const selectedValues = Array.from(
                  searchParams.getAll(normalizedType)
                );

                console.log(`Processando grupo de classificação:`, {
                  type,
                  normalizedType,
                });

                return (
                  <div key={type} className="space-y-2">
                    <h3 className="font-medium text-sm text-gray-900 mb-3">
                      {type}
                    </h3>
                    <div className="space-y-2">
                      {items.map((item) => {
                        const isChecked = selectedValues.includes(item.name);

                        return (
                          <div
                            key={item.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${normalizedType}-${item.id}`}
                              checked={isChecked}
                              onCheckedChange={(checked) =>
                                handleClassificationChange(
                                  type,
                                  item.name,
                                  checked as boolean
                                )
                              }
                              className="border-2 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                            />
                            <Label
                              htmlFor={`${normalizedType}-${item.id}`}
                              className={cn(
                                "text-sm cursor-pointer",
                                isChecked
                                  ? "text-orange-500 font-medium"
                                  : "text-gray-600 hover:text-gray-900"
                              )}
                            >
                              {item.name}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
