"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  products: Product[];
  variant?: "default" | "compact";
}

export function ProductGrid({
  products,
  variant = "default",
}: ProductGridProps) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  const handleToggleWishlist = (productId: number) => {
    setWishlist((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  return (
    <div
      className={cn(
        "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        variant === "default" ? "gap-4 md:gap-6" : "gap-3 md:gap-4"
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isInWishlist={wishlist.includes(product.id)}
          handleToggleWishlist={handleToggleWishlist}
        />
      ))}
    </div>
  );
}
