"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/hooks/use-wishlist";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";

export default function WishlistPage() {
  const {
    wishlistItems,
    isInWishlist,
    toggleWishlist,
    loadWishlistProducts,
    isLoading,
  } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const wishlistProducts = await loadWishlistProducts();
      setProducts(wishlistProducts);
    };

    loadProducts();
  }, [wishlistItems, loadWishlistProducts]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Meus Favoritos</h1>
        <div className="text-center py-8">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Meus Favoritos</h1>
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            Você ainda não tem produtos favoritos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInWishlist={isInWishlist(product.id)}
              handleToggleWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
}
