import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Criar cliente Supabase com service_role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

export async function POST(request: Request) {
  console.log("🔵 Webhook: Requisição recebida");

  const body = await request.text();
  const sig = headers().get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig || !endpointSecret) {
      console.error("🔴 Webhook: Faltando signature ou secret");
      throw new Error("Webhook signature or secret missing");
    }

    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    console.log("🟢 Webhook: Evento construído com sucesso:", event.type);
  } catch (err: any) {
    console.error("🔴 Webhook: Erro na validação:", err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("🟢 Webhook: Processando checkout completo");
      console.log("Session metadata:", session.metadata);

      // Verificar se temos o user_id
      if (!session.metadata?.user_id) {
        console.error("🔴 Webhook: user_id não encontrado nos metadados");
        throw new Error("user_id not found in session metadata");
      }

      // Verificar se temos o endereço
      if (!session.metadata?.address) {
        console.error("🔴 Webhook: address não encontrado nos metadados");
        throw new Error("address not found in session metadata");
      }

      let shippingAddress;
      try {
        shippingAddress = JSON.parse(session.metadata.address);
        console.log(
          "🟢 Webhook: Endereço parseado com sucesso:",
          shippingAddress
        );
      } catch (error) {
        console.error("🔴 Webhook: Erro ao fazer parse do endereço:", error);
        throw new Error("Invalid address format in metadata");
      }

      // Buscar detalhes da sessão com line_items
      console.log("🟡 Webhook: Buscando detalhes da sessão");
      const expandedSession = await stripe.checkout.sessions.retrieve(
        session.id,
        {
          expand: ["line_items", "line_items.data.price.product"],
        }
      );

      if (!expandedSession.line_items?.data) {
        console.error("🔴 Webhook: Nenhum item encontrado na sessão");
        throw new Error("No line items found");
      }

      console.log(
        "🟢 Webhook: Items encontrados:",
        expandedSession.line_items.data.length
      );

      // Criar pedido
      const orderData = {
        user_id: session.metadata.user_id,
        total_amount: session.amount_total || 0,
        shipping_address: shippingAddress,
        stripe_session_id: session.id,
        stripe_payment_intent_id: session.payment_intent,
        status: "processing",
        tracking_code: null,
        estimated_delivery: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
        status_history: [
          {
            status: "processing",
            timestamp: new Date().toISOString(),
            description: "Pedido recebido e pagamento confirmado",
          },
        ],
      };

      console.log("🟡 Webhook: Criando pedido com dados:", orderData);

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        console.error("🔴 Webhook: Erro ao criar pedido:", orderError);
        throw orderError;
      }

      console.log("🟢 Webhook: Pedido criado com sucesso:", order.id);

      // Criar itens do pedido
      const orderItems = expandedSession.line_items.data.map((item) => {
        const product = item.price?.product as Stripe.Product;
        if (!product?.metadata?.product_id) {
          console.error(
            "🔴 Webhook: product_id não encontrado para item:",
            item
          );
        }
        return {
          order_id: order.id,
          product_id: Number(product.metadata?.product_id),
          quantity: item.quantity || 1,
          unit_price: item.price?.unit_amount || 0,
          total_price: item.amount_total || 0,
          product_data: {
            name: item.description || "Produto",
            price: item.price?.unit_amount || 0,
            image_url: product.images?.[0] || null,
          },
        };
      });

      console.log("🟡 Webhook: Criando items do pedido:", orderItems.length);

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("🔴 Webhook: Erro ao criar itens do pedido:", itemsError);
        throw itemsError;
      }

      console.log("🟢 Webhook: Pedido processado com sucesso");
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("🔴 Webhook: Erro ao processar:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : "");
    return NextResponse.json(
      {
        error: "Erro ao processar webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
