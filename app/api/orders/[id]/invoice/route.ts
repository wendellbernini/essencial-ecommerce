import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verificar autenticação
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Buscar o pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Verificar se já existe uma nota fiscal
    if (order.invoice_url) {
      return NextResponse.json({ url: order.invoice_url });
    }

    // Aqui você implementaria a integração com um serviço de emissão de notas fiscais
    // Por exemplo: NFE.io, WebmaniaBR, ENOTAS, etc.
    // Por enquanto, vamos apenas simular a geração

    const invoiceData = {
      invoice_status: "processing",
      invoice_number: `NF-${order.id.slice(0, 8)}`,
      updated_at: new Date().toISOString(),
    };

    // Atualizar o pedido com os dados da nota fiscal
    const { error: updateError } = await supabase
      .from("orders")
      .update(invoiceData)
      .eq("id", params.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Erro ao atualizar pedido" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Nota fiscal em processamento",
      status: "processing",
    });
  } catch (error) {
    console.error("Erro ao gerar nota fiscal:", error);
    return NextResponse.json(
      { error: "Erro ao gerar nota fiscal" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Verificar autenticação
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    // Buscar o pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    // Verificar status da nota fiscal
    if (!order.invoice_url) {
      return NextResponse.json(
        {
          status: order.invoice_status || "pending",
          message: "Nota fiscal ainda não disponível",
        },
        { status: 202 }
      );
    }

    return NextResponse.json({ url: order.invoice_url });
  } catch (error) {
    console.error("Erro ao buscar nota fiscal:", error);
    return NextResponse.json(
      { error: "Erro ao buscar nota fiscal" },
      { status: 500 }
    );
  }
}
