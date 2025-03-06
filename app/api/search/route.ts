import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ products: [] });
    }

    const supabase = createRouteHandlerClient({ cookies });

    const { data: products, error } = await supabase
      .from("products")
      .select(
        `
        id,
        name,
        slug,
        price,
        sale_price,
        images,
        categories (
          id,
          name,
          slug
        )
      `
      )
      .or(
        `
        name.ilike.%${query}%,
        description.ilike.%${query}%
      `
      )
      .limit(10);

    if (error) {
      console.error("Erro na busca:", error);
      return NextResponse.json(
        { error: "Erro ao realizar a busca" },
        { status: 500 }
      );
    }

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Erro inesperado:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
