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
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
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
  invoice_url?: string | null;
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

function OrderCard({ order }: { order: Order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const status = statusMap[order.status];
  const StatusIcon = status.icon;

  const handleDownloadInvoice = async () => {
    try {
      // Primeiro, verifica se já existe uma URL da nota fiscal
      const response = await fetch(`/api/orders/${order.id}/invoice`, {
        method: order.invoice_url ? "GET" : "POST",
      });

      const data = await response.json();

      if (response.ok) {
        if (data.url) {
          // Se tiver URL, abre em uma nova aba
          window.open(data.url, "_blank");
        } else {
          // Se estiver em processamento, mostra mensagem
          toast.info(
            "Nota fiscal em processamento. Tente novamente em alguns instantes."
          );
        }
      } else {
        throw new Error(data.error || "Erro ao processar nota fiscal");
      }
    } catch (error) {
      console.error("Erro ao processar nota fiscal:", error);
      toast.error("Erro ao processar nota fiscal");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Cabeçalho do Card (sempre visível) */}
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
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
            <p className="text-lg font-bold text-orange-500">
              {formatPrice(order.total_amount / 100)}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className={`${status.color} flex items-center gap-1`}
            >
              <StatusIcon className="h-4 w-4" />
              <span>{status.label}</span>
            </Badge>
            {order.tracking_code && (
              <Badge variant="outline" className="text-gray-600">
                Rastreio: {order.tracking_code}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Conteúdo expandido */}
      {isExpanded && (
        <>
          <Separator />
          <div className="p-4 space-y-4">
            {/* Itens do Pedido */}
            <div>
              <h3 className="font-medium mb-3">Itens do Pedido</h3>
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative aspect-square h-20 w-20 min-w-[80px] overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={item.product_data.image_url}
                        alt={item.product_data.name}
                        className="object-cover"
                        fill
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.product_data.name}
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Quantidade: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice(item.total_price / 100)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Endereço de Entrega */}
            <div>
              <h3 className="font-medium mb-2">Endereço de Entrega</h3>
              <div className="text-sm text-gray-600">
                <p>{order.shipping_address.recipient}</p>
                <p>
                  {order.shipping_address.street},{" "}
                  {order.shipping_address.number}
                  {order.shipping_address.complement &&
                    ` - ${order.shipping_address.complement}`}
                </p>
                <p>
                  {order.shipping_address.neighborhood} -{" "}
                  {order.shipping_address.city}/{order.shipping_address.state}
                </p>
                <p>
                  CEP:{" "}
                  {order.shipping_address.zip_code.replace(
                    /(\d{5})(\d{3})/,
                    "$1-$2"
                  )}
                </p>
              </div>
            </div>

            {/* Status e Previsão de Entrega */}
            {order.estimated_delivery && (
              <div>
                <h3 className="font-medium mb-2">Previsão de Entrega</h3>
                <p className="text-sm text-gray-600">
                  {format(
                    new Date(order.estimated_delivery),
                    "d 'de' MMMM 'de' yyyy",
                    { locale: ptBR }
                  )}
                </p>
              </div>
            )}

            {/* Nota Fiscal */}
            <div>
              <h3 className="font-medium mb-2">Nota Fiscal</h3>
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600"
                onClick={handleDownloadInvoice}
              >
                <FileText className="h-4 w-4 mr-2" />
                {order.invoice_url
                  ? "Baixar Nota Fiscal"
                  : "Nota Fiscal em Processamento"}
              </Button>
            </div>

            {/* Histórico de Status */}
            {order.status_history && order.status_history.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Histórico do Pedido</h3>
                <div className="space-y-2">
                  {order.status_history.map((history, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-32 flex-shrink-0 text-gray-500">
                        {format(
                          new Date(history.timestamp),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </div>
                      <div className="flex-1 text-gray-700">
                        {history.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function loadOrders() {
      try {
        console.log("🔵 Pedidos: Iniciando carregamento");

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
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500 mb-4" />
        <p className="text-gray-500">Carregando seus pedidos...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
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
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Meus Pedidos</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
