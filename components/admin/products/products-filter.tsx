"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category, Brand } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useCallback } from "react";

interface ProductsFilterProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    brand: string;
    status: string;
  }) => void;
}

export function ProductsFilter({ onFilterChange }: ProductsFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadCategories() {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");

      if (!error && data) {
        setCategories(data);
      }
    }

    async function loadBrands() {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name");

      if (!error && data) {
        setBrands(data);
      }
    }

    loadCategories();
    loadBrands();
  }, []);

  // Função para atualizar filtros
  const updateFilters = useCallback(() => {
    onFilterChange({
      search,
      category: selectedCategory,
      brand: selectedBrand,
      status: selectedStatus,
    });
  }, [search, selectedCategory, selectedBrand, selectedStatus, onFilterChange]);

  // Atualiza os filtros quando os valores mudam
  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedStatus("all");
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
      <Input
        placeholder="Buscar produtos..."
        className="max-w-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedBrand} onValueChange={setSelectedBrand}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Marca" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as marcas</SelectItem>
          {brands.map((brand) => (
            <SelectItem key={brand.id} value={String(brand.id)}>
              {brand.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedStatus} onValueChange={setSelectedStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="in_stock">Em estoque</SelectItem>
          <SelectItem value="low_stock">Estoque baixo</SelectItem>
          <SelectItem value="out_of_stock">Esgotado</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" onClick={handleClearFilters}>
        Limpar Filtros
      </Button>
    </div>
  );
}
