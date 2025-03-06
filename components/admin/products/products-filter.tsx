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
import { Category } from "@/lib/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState, useCallback } from "react";

interface ProductsFilterProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    status: string;
  }) => void;
}

export function ProductsFilter({ onFilterChange }: ProductsFilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
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
    loadCategories();
  }, []);

  // Função para atualizar filtros
  const updateFilters = useCallback(() => {
    onFilterChange({
      search,
      category: selectedCategory,
      status: selectedStatus,
    });
  }, [search, selectedCategory, selectedStatus, onFilterChange]);

  // Atualiza os filtros quando os valores mudam
  useEffect(() => {
    updateFilters();
  }, [updateFilters]);

  const handleClearFilters = () => {
    setSearch("");
    setSelectedCategory("all");
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
