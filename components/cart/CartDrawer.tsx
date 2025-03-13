"use client";

import { useCart } from "@/contexts/cart-context";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "./CartItem";
import { CartEmpty } from "./CartEmpty";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function CartDrawer() {
  const { items, total, isOpen, toggleCart, total_items, isLoading } =
    useCart();
  const router = useRouter();

  const handleCheckout = () => {
    toggleCart();
    router.push("/checkout");
  };

  return (
    <Sheet open={isOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
        <SheetHeader className="space-y-2.5 pb-6">
          <SheetTitle className="text-2xl">Carrinho</SheetTitle>
          {total_items > 0 && (
            <p className="text-sm text-gray-500">
              {total_items} {total_items === 1 ? "item" : "itens"}
            </p>
          )}
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <CartEmpty />
        ) : (
          <>
            <ScrollArea className="flex-1 -mr-4 pr-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-6">
              <Separator />
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Frete</span>
                  <span className="font-medium">Calculado no checkout</span>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center justify-between text-base font-medium">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                size="lg"
                onClick={handleCheckout}
              >
                Finalizar compra
              </Button>

              <Button variant="outline" className="w-full" onClick={toggleCart}>
                Continuar comprando
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
