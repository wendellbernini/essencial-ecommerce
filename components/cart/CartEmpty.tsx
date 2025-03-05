"use client";

import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

export function CartEmpty() {
  const { toggleCart } = useCart();

  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
      <div className="relative mb-4 h-24 w-24 text-gray-200">
        <ShoppingBag className="h-full w-full" strokeWidth={1} />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Seu carrinho está vazio
        </h3>
        <p className="text-sm text-gray-500">
          Explore nossos produtos e encontre itens incríveis para adicionar ao
          seu carrinho.
        </p>
      </div>
      <Button
        onClick={toggleCart}
        className="mt-8 bg-orange-500 hover:bg-orange-600 text-white"
      >
        Continuar comprando
      </Button>
    </div>
  );
}
