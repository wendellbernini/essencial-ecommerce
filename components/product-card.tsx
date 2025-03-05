import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/supabase";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Formatar preço para o formato brasileiro
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Verificar se o produto tem desconto
  const hasDiscount =
    product.sale_price !== null && product.sale_price < product.price;

  // Obter a primeira imagem do produto ou usar um placeholder
  const productImage =
    product.images && product.images.length > 0
      ? product.images[0]
      : `/placeholder.svg?height=200&width=200&text=Produto${product.id}`;

  return (
    <div className="group">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative mb-3 rounded-lg overflow-hidden">
          <Image
            src={productImage}
            alt={product.name}
            width={200}
            height={200}
            className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white hover:bg-gray-50 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-gray-700 hover:text-orange-500"
          >
            <Heart className="h-4 w-4" />
          </Button>
          {product.featured && (
            <Badge className="absolute bottom-2 left-2 bg-orange-500">
              Mais vendido
            </Badge>
          )}
          {product.stock_quantity <= 0 && (
            <Badge className="absolute bottom-2 right-2 bg-gray-700">
              Esgotado
            </Badge>
          )}
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
            {product.name}
          </h3>
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
              <span className="text-xs text-gray-500 ml-1">(45)</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            {hasDiscount ? (
              <div>
                <p className="font-medium">
                  {formatPrice(product.sale_price!)}
                </p>
                <p className="text-xs text-gray-500 line-through">
                  {formatPrice(product.price)}
                </p>
              </div>
            ) : (
              <p className="font-medium">{formatPrice(product.price)}</p>
            )}
            {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
              <Badge
                variant="outline"
                className="text-green-600 border-green-600"
              >
                Frete grátis
              </Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
