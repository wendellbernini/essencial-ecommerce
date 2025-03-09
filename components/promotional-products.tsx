"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PromotionalProducts({ products }: { products: Product[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [discountFilter, setDiscountFilter] = useState("all");
  const productsPerPage = 5;

  // Função para calcular o percentual de desconto
  const calculateDiscount = (price: number, salePrice: number | null) => {
    if (!salePrice) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  };

  // Filtra os produtos com base no desconto selecionado
  const filteredProducts = products.filter((product) => {
    if (!product.sale_price) return false;
    const discount = calculateDiscount(product.price, product.sale_price);

    switch (discountFilter) {
      case "30off":
        return discount >= 30 && discount < 50;
      case "50off":
        return discount >= 50 && discount < 70;
      case "70off":
        return discount >= 70;
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Reset currentPage quando o filtro muda
  useEffect(() => {
    setCurrentPage(0);
  }, [discountFilter]);

  // Garante que currentPage está dentro dos limites válidos
  useEffect(() => {
    if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Só Hoje! Só Agora!</h2>
        <Tabs
          value={discountFilter}
          className="bg-white rounded-lg border border-gray-200"
          onValueChange={setDiscountFilter}
        >
          <TabsList className="bg-gray-50">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-500 text-gray-600"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="30off"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-500 text-gray-600"
            >
              30% OFF
            </TabsTrigger>
            <TabsTrigger
              value="50off"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-500 text-gray-600"
            >
              50% OFF
            </TabsTrigger>
            <TabsTrigger
              value="70off"
              className="data-[state=active]:bg-white data-[state=active]:text-orange-500 text-gray-600"
            >
              70% OFF
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative px-8">
        <div className="overflow-hidden">
          {filteredProducts.length > 0 ? (
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div
                  key={pageIndex}
                  className="w-full flex-shrink-0 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4"
                >
                  {filteredProducts
                    .slice(
                      pageIndex * productsPerPage,
                      (pageIndex + 1) * productsPerPage
                    )
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Nenhum produto encontrado com este filtro
            </div>
          )}
        </div>

        {totalPages > 1 && filteredProducts.length > 0 && (
          <>
            <button
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-14 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm"
              onClick={() =>
                setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
              }
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-14 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm"
              onClick={() => setCurrentPage((prev) => (prev + 1) % totalPages)}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
