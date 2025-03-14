import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Inicializa o cliente Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(request: Request) {
  try {
    console.log("🔵 Checkout: Iniciando processo");

    // Inicializa o cliente Supabase
    const supabase = createRouteHandlerClient({ cookies });

    // Verifica autenticação
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.error("🔴 Checkout: Usuário não autenticado");
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    console.log("🟢 Checkout: Usuário autenticado:", user.id);

    // Processa o corpo da requisição
    const body = await request.json();
    const { items, selectedAddress } = body;

    if (!items?.length || !selectedAddress) {
      console.error("🔴 Checkout: Dados inválidos", { items, selectedAddress });
      return NextResponse.json(
        { error: "Dados inválidos para checkout" },
        { status: 400 }
      );
    }

    console.log("🟡 Checkout: Criando line items para Stripe");
    // Criar os line items para o Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: "brl",
        product_data: {
          name: item.name,
          images: [item.image_url],
          metadata: {
            product_id: item.product_id,
          },
        },
        unit_amount: Math.round((item.sale_price || item.price) * 100), // Stripe trabalha com centavos
      },
      quantity: item.quantity,
    }));

    console.log("🟡 Checkout: Criando sessão no Stripe");
    console.log("Metadata sendo enviada:", {
      user_id: user.id,
      address: JSON.stringify(selectedAddress),
    });

    // Criar a sessão de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ["BR"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "brl",
            },
            display_name: "Frete Grátis",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
      ],
      metadata: {
        user_id: user.id,
        address: JSON.stringify(selectedAddress),
      },
    });

    console.log("🟢 Checkout: Sessão criada com sucesso", checkoutSession.id);
    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error: any) {
    console.error("🔴 Checkout: Erro ao processar:", error);
    return NextResponse.json(
      {
        error: "Erro ao processar pagamento",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
