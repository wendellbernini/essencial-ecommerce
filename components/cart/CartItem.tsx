"use client";

import Image from "next/image";
import { Minus, Plus, X } from "lucide-react";
import { CartItem as ICartItem, useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: ICartItem;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-3">
      <div className="relative aspect-square h-24 w-24 min-w-[96px] overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={item.image_url}
          alt={item.name}
          className="object-cover"
          fill
          sizes="96px"
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
            <div className="mt-1 text-sm text-gray-500">
              {item.sale_price ? (
                <div className="flex items-center gap-2">
                  <span className="font-medium text-orange-600">
                    {formatPrice(item.sale_price)}
                  </span>
                  <span className="text-xs line-through">
                    {formatPrice(item.price)}
                  </span>
                </div>
              ) : (
                <span>{formatPrice(item.price)}</span>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-400 hover:text-gray-500"
            onClick={() => removeItem(item.id)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Remover item</span>
          </Button>
        </div>

        <div className="mt-auto flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-600 hover:text-gray-700"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              <Minus className="h-4 w-4" />
              <span className="sr-only">Diminuir quantidade</span>
            </Button>

            <span className="w-8 text-center text-sm">{item.quantity}</span>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-600 hover:text-gray-700"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Aumentar quantidade</span>
            </Button>
          </div>

          <span className="ml-auto text-sm font-medium">
            {formatPrice((item.sale_price || item.price) * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
