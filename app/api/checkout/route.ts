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
    const { items, selectedAddress, selectedShipping } = body;

    if (!items?.length || !selectedAddress || !selectedShipping) {
      console.error("🔴 Checkout: Dados inválidos", {
        items,
        selectedAddress,
        selectedShipping,
      });
      return NextResponse.json(
        { error: "Dados inválidos para checkout" },
        { status: 400 }
      );
    }

    console.log("🟡 Checkout: Criando line items para Stripe");
    // Criar os line items para o Stripe
    const lineItems = [
      ...items.map((item: any) => ({
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
      })),
      // Adiciona o frete como um item separado
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: `Frete - ${selectedShipping.company} - ${selectedShipping.service}`,
            metadata: {
              type: "shipping",
              service: selectedShipping.service,
              company: selectedShipping.company,
              code: selectedShipping.code,
            },
          },
          unit_amount: Math.round(selectedShipping.price * 100),
        },
        quantity: 1,
      },
    ];

    console.log("🟡 Checkout: Criando sessão no Stripe");
    console.log("Metadata sendo enviada:", {
      user_id: user.id,
      address: JSON.stringify(selectedAddress),
      shipping: JSON.stringify(selectedShipping),
    });

    // Buscar dados do usuário
    const { data: userData } = await supabase
      .from("users")
      .select("email, full_name, phone")
      .eq("id", user.id)
      .single();

    // Criar a sessão de checkout
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?canceled=true`,
      customer_email: userData?.email || user.email,
      metadata: {
        user_id: user.id,
        address: JSON.stringify(selectedAddress),
        shipping: JSON.stringify(selectedShipping),
        shipping_address: `${selectedAddress.street}, ${
          selectedAddress.number
        }${
          selectedAddress.complement ? ` - ${selectedAddress.complement}` : ""
        } - ${selectedAddress.neighborhood} - ${selectedAddress.city}/${
          selectedAddress.state
        } - CEP: ${selectedAddress.zip_code}`,
        recipient: selectedAddress.recipient,
        phone: selectedAddress.phone || "",
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
