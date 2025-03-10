"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/supabase";

interface WishlistButtonProps {
  productId: number;
  isInWishlist: boolean;
  onToggle: (id: number) => void;
}

function WishlistButton({
  productId,
  isInWishlist,
  onToggle,
}: WishlistButtonProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white z-10"
      onClick={() => onToggle(productId)}
    >
      <Heart
        className={cn(
          "h-5 w-5",
          isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
        )}
      />
    </Button>
  );
}

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  handleToggleWishlist: (id: number) => void;
  priority?: boolean;
}

export function ProductCard({
  product,
  isInWishlist,
  handleToggleWishlist,
  priority = false,
}: ProductCardProps) {
  // Formatar preço para o formato brasileiro
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Verificar se o produto tem desconto
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  // Obter a primeira imagem do produto ou usar um placeholder
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : `/placeholder.svg?height=200&width=200&text=Produto${product.id}`;

  return (
    <div className="group">
      <div className="relative">
        <Link href={`/produto/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={product.images[0]}
              alt={product.name}
              className="object-cover object-center hover:scale-105 transition-transform duration-300"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={priority}
            />
            <div className="absolute top-2 left-2 flex flex-col items-start gap-0.5">
              {hasDiscount && (
                <Badge className="bg-black text-white rounded-none px-1.5 py-0.5 text-[10px] font-medium inline-flex leading-none">
                  {discountPercentage}% OFF
                </Badge>
              )}
              {product.featured && (
                <Badge className="bg-black text-white rounded-none px-1.5 py-0.5 text-[10px] font-medium inline-flex leading-none">
                  MAIS VENDIDO
                </Badge>
              )}
            </div>
            <WishlistButton
              productId={product.id}
              isInWishlist={isInWishlist}
              onToggle={handleToggleWishlist}
            />
          </div>
        </Link>
      </div>
      <Link href={`/produto/${product.slug}`}>
        <div className="mt-4">
          <h3 className="text-sm text-gray-800 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
          {product.brand && (
            <p className="text-xs text-gray-500 mt-1">{product.brand.name}</p>
          )}
          <div className="flex items-center mt-1 mb-1">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className="w-3 h-3 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-[11px] text-gray-500 ml-1">(45)</span>
            </div>
          </div>
          <div className="mt-2 space-y-1">
            {product.sale_price && product.sale_price < product.price ? (
              <>
                <p className="text-sm text-gray-500 line-through mb-0.5">
                  R$ {product.price.toFixed(2).replace(".", ",")}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {product.sale_price.toFixed(2).replace(".", ",")}
                </p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-900">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
              <Badge variant="secondary" className="text-xs">
                Últimas unidades
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
