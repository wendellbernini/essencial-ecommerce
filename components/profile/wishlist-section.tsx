"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductGrid } from "@/components/product-grid";
import { Product } from "@/lib/types";
import { Loader2 } from "lucide-react";

export function WishlistSection() {
  const { wishlistItems, loadWishlistProducts } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await loadWishlistProducts();
        setProducts(products);
      } catch (error) {
        console.error("Erro ao carregar produtos da wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, [wishlistItems, loadWishlistProducts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          Sua lista de desejos está vazia
        </h2>
        <p className="text-sm text-gray-500">
          Explore nossos produtos e adicione seus favoritos aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-lg font-medium text-gray-900 mb-6">
        Lista de Desejos ({products.length}{" "}
        {products.length === 1 ? "item" : "itens"})
      </h2>
      <ProductGrid products={products} />
    </div>
  );
}
