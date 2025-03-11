import { createServerSupabaseClient } from "@/lib/server-supabase";
import { Product } from "@/lib/types";

export async function getProductBySlug(slug: string) {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(id, name, slug),
        subcategories:subcategory_id(id, name, slug),
        product_classifications(classification_id),
        brand:brand_id(name, slug, logo_url)
      `
      )
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Erro ao buscar produto com slug ${slug}:`, error);
      throw error;
    }

    // Se tiver classificações, buscar os detalhes delas
    if (data?.product_classifications?.length > 0) {
      const classificationIds = data.product_classifications.map(
        (pc: { classification_id: number }) => pc.classification_id
      );

      const { data: classificationsData, error: classError } = await supabase
        .from("classifications")
        .select("*")
        .in("id", classificationIds);

      if (!classError && classificationsData) {
        data.classifications = classificationsData;
      }
    }

    return data as Product;
  } catch (error) {
    console.error(`Erro ao buscar produto com slug ${slug}:`, error);
    return null;
  }
}

export async function getProductsByCategory(categoryId: number) {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name, slug),
        brand:brand_id(name, slug, logo_url)
      `
      )
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        `Erro ao buscar produtos da categoria ${categoryId}:`,
        error
      );
      throw error;
    }

    return data as Product[];
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${categoryId}:`, error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  const supabase = createServerSupabaseClient();

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
    return data;
  } catch (error) {
    console.error(`Erro ao buscar categoria com slug ${slug}:`, error);
    return null;
  }
}
