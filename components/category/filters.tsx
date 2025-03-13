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
import { useCallback, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

type Subcategory = Database["public"]["Tables"]["subcategories"]["Row"];
type Classification = {
  id: number;
  name: string;
  type: string;
  category_id: number;
};
type Brand = Database["public"]["Tables"]["brands"]["Row"];

interface FiltersProps {
  subcategories: Subcategory[];
  classifications?: Classification[];
  brands?: Brand[];
  currentSubcategory?: string;
  currentBrand?: string;
  currentSortBy?: string;
  currentMaxPrice?: string;
  currentMinPrice?: string;
  currentNecessidade?: string[];
  currentTipoPele?: string[];
  categorySlug: string;
}

export function Filters({
  subcategories,
  classifications = [],
  brands = [],
  currentSubcategory,
  currentBrand,
  currentSortBy,
  currentMaxPrice,
  currentMinPrice,
  currentNecessidade = [],
  currentTipoPele = [],
  categorySlug,
}: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // Estado local para o range de preço
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState<
    [number, number]
  >([0, 1000]);

  // Inicializar o range com os valores da URL
  useEffect(() => {
    const minPrice = currentMinPrice ? parseFloat(currentMinPrice) : 0;
    const maxPrice = currentMaxPrice ? parseFloat(currentMaxPrice) : 1000;
    setPriceRange([minPrice, maxPrice]);
    setDebouncedPriceRange([minPrice, maxPrice]);
  }, [currentMinPrice, currentMaxPrice]);

  // Debounce para o range de preço
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        priceRange[0] !== debouncedPriceRange[0] ||
        priceRange[1] !== debouncedPriceRange[1]
      ) {
        setDebouncedPriceRange(priceRange);
        const updates = {
          minPrice: priceRange[0].toString(),
          maxPrice: priceRange[1].toString(),
        };
        router.push(
          `/categoria/${categorySlug}?${updateSearchParams(updates)}`
        );
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    priceRange,
    debouncedPriceRange,
    router,
    categorySlug,
    updateSearchParams,
  ]);

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

  // Função auxiliar para formatar o nome do tipo de classificação
  const formatClassificationType = (type: string) => {
    // Mapeamento de tipos para nomes amigáveis
    const typeMap: Record<string, string> = {
      necessidade: "Necessidade",
      tipo_pele: "Tipo de Pele",
      acabamento: "Acabamento",
      cobertura: "Cobertura",
      textura: "Textura",
      funcao: "Função",
      fragrancia: "Fragrância",
      tipo_cabelo: "Tipo de Cabelo",
      nivel_protecao: "Nível de Proteção",
    };

    return typeMap[type.toLowerCase()] || type;
  };

  const handleSubcategoryChange = (value: string) => {
    const updates = { subcategory: value === "all" ? null : value };
    router.push(`/categoria/${categorySlug}?${updateSearchParams(updates)}`);
  };

  const handleBrandChange = (value: string) => {
    const updates = { brand: value === "all" ? null : value };
    router.push(`/categoria/${categorySlug}?${updateSearchParams(updates)}`);
  };

  const handleSortChange = (value: string) => {
    const updates = { sortBy: value };
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
    <div className="space-y-6">
      {/* Ordenação */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-gray-900">Ordenar por</h3>
        <Select
          value={currentSortBy || "created-desc"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created-desc">Mais recentes</SelectItem>
            <SelectItem value="created-asc">Mais antigos</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Subcategorias */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-gray-900">Subcategorias</h3>
        <Select
          value={currentSubcategory || "all"}
          onValueChange={handleSubcategoryChange}
        >
          <SelectTrigger className="w-full">
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
      </div>

      {/* Filtro de Marcas */}
      <div className="space-y-3">
        <h3 className="font-medium text-sm text-gray-900">Marcas</h3>
        <Select value={currentBrand || "all"} onValueChange={handleBrandChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as marcas</SelectItem>
            {brands?.map((brand) => (
              <SelectItem key={brand.id} value={brand.slug}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro de Preço com Range */}
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-gray-900">Faixa de Preço</h3>
        <div className="pt-6">
          <Slider
            min={0}
            max={1000}
            step={10}
            value={priceRange}
            onValueChange={(value: [number, number]) => setPriceRange(value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>R$ {priceRange[0].toFixed(2)}</span>
          <span>R$ {priceRange[1].toFixed(2)}</span>
        </div>
      </div>

      {/* Filtros específicos por categoria */}
      {Object.entries(groupedClassifications).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedClassifications).map(([type, items]) => {
            const normalizedType = normalizeType(type);
            const selectedValues = Array.from(
              searchParams.getAll(normalizedType)
            );

            return (
              <div key={type} className="space-y-3">
                <h3 className="font-medium text-sm text-gray-900">
                  {formatClassificationType(type)}
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
