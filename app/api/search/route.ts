import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Força a rota a ser dinâmica
export const dynamic = "force-dynamic";

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
        *,
        categories:category_id (
          id,
          name,
          slug
        )
      `
      )
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro na busca:", error);
      throw error;
    }

    return NextResponse.json({ products: products || [] });
  } catch (error) {
    console.error("Erro na rota de busca:", error);
    return NextResponse.json(
      { error: "Erro ao realizar a busca" },
      { status: 500 }
    );
  }
}
