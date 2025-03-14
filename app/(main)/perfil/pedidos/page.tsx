"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { formatPrice } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Loader2,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_data: {
    name: string;
    price: number;
    image_url: string;
  };
}

interface StatusHistoryItem {
  status: string;
  timestamp: string;
  description: string;
}

interface Order {
  id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total_amount: number;
  created_at: string;
  tracking_code: string | null;
  estimated_delivery: string | null;
  status_history: StatusHistoryItem[];
  shipping_address: {
    recipient: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
  order_items: OrderItem[];
}

const statusMap = {
  pending: {
    label: "Aguardando pagamento",
    color: "bg-yellow-100 text-yellow-800",
    icon: AlertCircle,
  },
  processing: {
    label: "Em processamento",
    color: "bg-blue-100 text-blue-800",
    icon: Package,
  },
  shipped: {
    label: "Enviado",
    color: "bg-purple-100 text-purple-800",
    icon: Truck,
  },
  delivered: {
    label: "Entregue",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelado",
    color: "bg-red-100 text-red-800",
    icon: AlertCircle,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadOrders() {
      try {
        console.log("🔵 Pedidos: Iniciando carregamento");

        // Primeiro, vamos verificar o usuário atual
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("🔴 Pedidos: Erro ao buscar usuário:", userError);
          toast.error("Erro ao verificar autenticação");
          return;
        }

        if (!user) {
          console.error("🔴 Pedidos: Usuário não autenticado");
          toast.error("Você precisa estar logado para ver seus pedidos");
          return;
        }

        console.log("🟢 Pedidos: Usuário autenticado:", user.id);

        // Buscar pedidos do usuário
        console.log("🟡 Pedidos: Buscando pedidos no Supabase");
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select(
            `
            *,
            order_items (*)
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) {
          console.error("🔴 Pedidos: Erro ao buscar pedidos:", ordersError);
          toast.error("Erro ao carregar pedidos");
          return;
        }

        console.log("🟢 Pedidos: Pedidos encontrados:", orders?.length || 0);
        console.log("Dados dos pedidos:", orders);

        setOrders(orders || []);
      } catch (error) {
        console.error("🔴 Pedidos: Erro inesperado:", error);
        toast.error("Erro ao carregar pedidos");
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, [supabase]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
          <p className="text-gray-500">Carregando seus pedidos...</p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <Package className="h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            Nenhum pedido encontrado
          </h2>
          <p className="text-gray-500 max-w-md">
            Parece que você ainda não realizou nenhum pedido. Que tal começar a
            explorar nossa loja?
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Meus Pedidos</h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-gray-500">
                  Pedido realizado em{" "}
                  {format(new Date(order.created_at), "d 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
                <p className="text-sm font-medium">
                  Pedido #{order.id.slice(0, 8)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Total</p>
                <p className="text-lg font-bold text-orange-500">
                  {formatPrice(order.total_amount / 100)}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-medium mb-2">Status do Pedido</h3>
              <p className="text-sm text-gray-600">
                {order.status === "processing" && "Em processamento"}
                {order.status === "shipped" && "Enviado"}
                {order.status === "delivered" && "Entregue"}
              </p>
              {order.estimated_delivery && (
                <p className="text-sm text-gray-500 mt-1">
                  Previsão de entrega:{" "}
                  {format(new Date(order.estimated_delivery), "d 'de' MMMM", {
                    locale: ptBR,
                  })}
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 mt-4 pt-4">
              <h3 className="font-medium mb-2">Itens do Pedido</h3>
              <div className="space-y-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.product_data.name}
                    </span>
                    <span className="font-medium">
                      {formatPrice(item.total_price / 100)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
