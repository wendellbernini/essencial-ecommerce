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
  is_new_release: boolean;
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

export async function getNewReleases() {
  try {
    console.log("Iniciando busca de lançamentos...");
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_new_release", true)
      .limit(6)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar lançamentos:", error);
      throw error;
    }

    console.log("Lançamentos encontrados:", data);
    return data as Product[];
  } catch (error) {
    console.error("Erro ao buscar lançamentos:", error);
    return [];
  }
}

export async function getActivePromoBanners() {
  try {
    console.log("Iniciando busca de banners promocionais ativos...");
    const now = new Date().toISOString();

    // Primeiro, vamos verificar se há banners com contador expirado e atualizá-los
    const { data: expiredBanners, error: expiredError } = await supabase
      .from("promo_banners")
      .select("*")
      .eq("is_active", true)
      .lt("end_date", now)
      .eq("has_countdown", true);

    if (expiredBanners && expiredBanners.length > 0) {
      console.log(`Encontrados ${expiredBanners.length} banners expirados para desativar:`, expiredBanners);
      
      // Desativar banners expirados
      for (const banner of expiredBanners) {
        const { error: updateError } = await supabase
          .from("promo_banners")
          .update({ is_active: false })
          .eq("id", banner.id);
          
        if (updateError) {
          console.error(`Erro ao desativar banner ${banner.id}:`, updateError);
        } else {
          console.log(`Banner ${banner.id} desativado com sucesso.`);
        }
      }
    }

    // Agora buscamos apenas os banners ativos e não expirados
    const { data, error } = await supabase
      .from("promo_banners")
      .select("*")
      .eq("is_active", true)
      .or(`end_date.gt.${now},end_date.is.null`) // Banners sem data de término ou com data futura
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Erro ao buscar banners:", error);
      return [];
    }

    console.log("Banners ativos encontrados:", data);
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar banners:", error);
    return [];
  }
}

export async function getPromotionalProducts() {
  try {
    console.log("=== BUSCANDO PRODUTOS PROMOCIONAIS ===");

    // Buscar todos os produtos e filtrar no código
    const { data: allProducts, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar produtos:", error);
      throw error;
    }

    // Filtrar produtos em promoção
    const promotionalProducts = allProducts?.filter((product) => {
      const hasDiscount =
        product.sale_price !== null && product.sale_price < product.price;
      if (hasDiscount) {
        console.log(
          `Produto em promoção encontrado: ${product.name} (${product.price} -> ${product.sale_price})`
        );
      }
      return hasDiscount;
    });

    console.log(
      `Total de produtos em promoção: ${promotionalProducts?.length || 0}`
    );
    console.log("=====================================");

    return promotionalProducts || [];
  } catch (error) {
    console.error("Erro ao buscar produtos em promoção:", error);
    return [];
  }
}
