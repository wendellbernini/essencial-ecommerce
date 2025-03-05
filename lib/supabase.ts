import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Tipos para as tabelas do Supabase
export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  category_id: number;
  stock_quantity: number;
  images: string[];
  featured: boolean;
  created_at: string;
  updated_at: string;
};

// Cria o cliente Supabase usando as variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Verifica se as variáveis de ambiente estão definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variáveis de ambiente do Supabase não configuradas");
}

// Cliente para uso no lado do cliente (browser)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Funções que NÃO precisam de cookies (podem usar o cliente browser)
export async function getCategories() {
  try {
    console.log("Iniciando busca de todas as categorias...");
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("Nenhuma categoria encontrada no banco de dados");
      return [];
    }

    console.log(
      `${data.length} categorias encontradas:`,
      JSON.stringify(data, null, 2)
    );
    return data as Category[];
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    console.log("Iniciando busca de produtos em destaque...");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar produtos em destaque:", error);
      throw error;
    }

    console.log("Produtos em destaque encontrados:", data);
    return data as Product[];
  } catch (error) {
    console.error("Erro ao buscar produtos em destaque:", error);
    return [];
  }
}

// Funções que precisam de cookies (usam o cliente server)
export function createServerSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variáveis de ambiente do Supabase não configuradas");
  }

  const cookieStore = cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          // Erro ao definir cookie em ambiente read-only
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.delete({ name, ...options });
        } catch (error) {
          // Erro ao remover cookie em ambiente read-only
        }
      },
    },
  });
}

// Busca um produto pelo slug
export async function getProductBySlug(slug: string) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Erro ao buscar produto com slug ${slug}:`, error);
      throw error;
    }

    console.log("Produto encontrado:", data);
    return data as Product;
  } catch (error) {
    console.error(`Erro ao buscar produto com slug ${slug}:`, error);
    return null;
  }
}

// Busca produtos por categoria
export async function getProductsByCategory(categoryId: number) {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        `Erro ao buscar produtos da categoria ${categoryId}:`,
        error
      );
      throw error;
    }

    console.log(`Produtos da categoria ${categoryId} encontrados:`, data);
    return data as Product[];
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${categoryId}:`, error);
    return [];
  }
}

// Busca uma categoria pelo slug
export async function getCategoryBySlug(slug: string) {
  try {
    console.log("Iniciando busca de categoria com slug:", slug);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Erro ao buscar categoria com slug ${slug}:`, error);
      return null;
    }

    console.log("Categoria encontrada:", data);
    return data as Category;
  } catch (error) {
    console.error(`Erro ao buscar categoria com slug ${slug}:`, error);
    return null;
  }
}
