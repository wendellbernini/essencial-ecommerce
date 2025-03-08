"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";

export function PromotionalProducts({ products }: { products: Product[] }) {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 6;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const start = currentPage * productsPerPage;
  const visibleProducts = products.slice(start, start + productsPerPage);

  // Log único e claro
  console.log("=== PROMOÇÕES ===");
  console.log(`Total de produtos: ${products.length}`);
  console.log(`Página atual: ${currentPage + 1} de ${totalPages}`);
  console.log(
    `Mostrando produtos ${start + 1} até ${start + visibleProducts.length}`
  );
  console.log("================");

  return (
    <div className="relative">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 shadow-lg rounded-full md:flex items-center justify-center w-10 h-10"
            onClick={() => {
              const newPage = (currentPage - 1 + totalPages) % totalPages;
              console.log(
                `Navegando para página ${newPage + 1} de ${totalPages}`
              );
              setCurrentPage(newPage);
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-100 shadow-lg rounded-full md:flex items-center justify-center w-10 h-10"
            onClick={() => {
              const newPage = (currentPage + 1) % totalPages;
              console.log(
                `Navegando para página ${newPage + 1} de ${totalPages}`
              );
              setCurrentPage(newPage);
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}
    </div>
  );
}
