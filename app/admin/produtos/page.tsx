"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductsFilter } from "@/components/admin/products/products-filter";
import { Product } from "@/lib/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(
          `
          *,
          brand:brands(
            id,
            name,
            slug
          )
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    loadProducts();

    // Inscreve-se para atualizações em tempo real
    const channel = supabase
      .channel("products_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "products",
        },
        () => {
          loadProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadProducts, supabase]);

  const handleFilterChange = useCallback(
    ({
      search,
      category,
      brand,
      status,
    }: {
      search: string;
      category: string;
      brand: string;
      status: string;
    }) => {
      let filtered = [...products];

      // Filtro de busca
      if (search) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filtro de categoria
      if (category !== "all") {
        filtered = filtered.filter(
          (product) => product.category_id === parseInt(category)
        );
      }

      // Filtro de marca
      if (brand !== "all") {
        filtered = filtered.filter(
          (product) => product.brand_id === parseInt(brand)
        );
      }

      // Filtro de status
      if (status !== "all") {
        switch (status) {
          case "in_stock":
            filtered = filtered.filter((product) => product.stock_quantity > 5);
            break;
          case "low_stock":
            filtered = filtered.filter(
              (product) =>
                product.stock_quantity > 0 && product.stock_quantity <= 5
            );
            break;
          case "out_of_stock":
            filtered = filtered.filter(
              (product) => product.stock_quantity === 0
            );
            break;
        }
      }

      setFilteredProducts(filtered);
    },
    [products]
  );

  const handleProductDeleted = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Produtos</h2>
          <p className="text-muted-foreground">
            Gerencie os produtos do seu catálogo.
          </p>
        </div>
        <Link href="/admin/produtos/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Produto
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <ProductsFilter onFilterChange={handleFilterChange} />
        {isLoading ? (
          <div className="text-center py-4">Carregando produtos...</div>
        ) : (
          <ProductsTable
            data={filteredProducts}
            onDelete={handleProductDeleted}
          />
        )}
      </div>
    </div>
  );
}
