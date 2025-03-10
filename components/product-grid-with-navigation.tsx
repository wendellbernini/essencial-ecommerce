"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product-grid";
import { Product } from "@/lib/types";

interface ProductGridWithNavigationProps {
  products: Product[];
  productsPerPage?: number;
  variant?: "default" | "compact";
}

export function ProductGridWithNavigation({
  products,
  productsPerPage = 5,
  variant = "default",
}: ProductGridWithNavigationProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const visibleProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  return (
    <div className="relative px-8">
      {products.length > productsPerPage && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-14 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm"
            onClick={prevPage}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-14 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center shadow-sm"
            onClick={nextPage}
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </Button>
        </>
      )}
      <ProductGrid products={visibleProducts} variant={variant} />
    </div>
  );
}
