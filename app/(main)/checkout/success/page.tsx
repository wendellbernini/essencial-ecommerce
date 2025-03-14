"use client";

import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();

  // Limpa o carrinho uma única vez quando a página carrega
  useEffect(() => {
    clearCart();
  }, []); // Executa apenas uma vez na montagem

  return (
    <main className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="rounded-full bg-green-100 p-3 mx-auto w-fit">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Pedido Confirmado!</h1>
          <p className="text-gray-500">
            Obrigado pela sua compra! Você receberá um e-mail com os detalhes do
            seu pedido em breve.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link href="/perfil/pedidos" className="w-full">
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Ver Meus Pedidos
            </Button>
          </Link>

          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              Continuar Comprando
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
