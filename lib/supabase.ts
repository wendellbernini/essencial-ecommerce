import { createClient } from "@supabase/supabase-js";
import { Category, Product, Brand } from "@/lib/types";

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
  images: string[];
  category_id: number;
  brand_id: number;
  stock_quantity: number;
  featured: boolean;
  is_new_release: boolean;
  created_at: string;
  updated_at: string;
  rating?: number;
  reviews_count?: number;
  categories?: {
    name: string;
    slug: string;
  };
  brand?: {
    name: string;
    slug: string;
    logo_url: string | null;
  };
};

export type Brand = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
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
      .select(
        `
        *,
        categories:category_id(name, slug),
        brand:brand_id(name, slug, logo_url)
      `
      )
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

export async function getNewReleases() {
  try {
    console.log("Iniciando busca de lançamentos...");
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name, slug),
        brand:brand_id(name, slug, logo_url)
      `
      )
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

    const { data, error } = await supabase
      .from("promo_banners")
      .select("*")
      .eq("is_active", true)
      .order("order_index", { ascending: true });

    if (error) {
      console.error("Erro ao buscar banners:", error);
      return [];
    }

    console.log("Banners encontrados após filtros:", data);
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar banners:", error);
    return [];
  }
}

export async function getPromotionalProducts() {
  try {
    console.log("=== BUSCANDO PRODUTOS PROMOCIONAIS ===");

    const { data: allProducts, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name, slug),
        brand:brand_id(name, slug, logo_url)
      `
      )
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

export async function getBrands() {
  try {
    console.log("Iniciando busca de todas as marcas...");
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .order("name");

    if (error) {
      console.error("Erro ao buscar marcas:", error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log("Nenhuma marca encontrada no banco de dados");
      return [];
    }

    console.log(`${data.length} marcas encontradas:`, data);
    return data as Brand[];
  } catch (error) {
    console.error("Erro ao buscar marcas:", error);
    return [];
  }
}

export async function getBrandBySlug(slug: string) {
  try {
    console.log("Iniciando busca de marca com slug:", slug);
    const { data, error } = await supabase
      .from("brands")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Erro ao buscar marca com slug ${slug}:`, error);
      return null;
    }

    console.log("Marca encontrada:", data);
    return data as Brand;
  } catch (error) {
    console.error(`Erro ao buscar marca com slug ${slug}:`, error);
    return null;
  }
}
