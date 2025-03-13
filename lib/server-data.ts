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

export async function getProductsByCategory(
  categoryId: number,
  filters: {
    subcategoryId?: number;
    maxPrice?: number;
    minPrice?: number;
    sortBy?: string;
    brandSlug?: string;
    classifications?: { [key: string]: string[] };
  }
) {
  const supabase = createServerSupabaseClient();

  try {
    console.log("Iniciando busca de produtos com filtros:", filters);

    let query = supabase
      .from("products")
      .select(
        `
        *,
        subcategory:subcategory_id(*),
        brand:brand_id(*),
        product_classifications(
          classification:classification_id(*)
        )
      `
      )
      .eq("category_id", categoryId);

    // Aplicar filtro de subcategoria se especificado
    if (filters.subcategoryId) {
      query = query.eq("subcategory_id", filters.subcategoryId);
    }

    // Aplicar filtro de marca se especificado
    if (filters.brandSlug) {
      console.log("Aplicando filtro de marca:", filters.brandSlug);
      // Primeiro, buscar o ID da marca pelo slug
      const { data: brandData } = await supabase
        .from("brands")
        .select("id")
        .eq("slug", filters.brandSlug)
        .single();

      if (brandData) {
        query = query.eq("brand_id", brandData.id);
      } else {
        console.log("Marca não encontrada com o slug:", filters.brandSlug);
      }
    }

    // Aplicar filtros de preço
    if (filters.maxPrice) {
      query = query.lte("price", filters.maxPrice);
    }
    if (filters.minPrice) {
      query = query.gte("price", filters.minPrice);
    }

    // Aplicar ordenação
    if (filters.sortBy) {
      console.log("Aplicando ordenação:", filters.sortBy);
      switch (filters.sortBy) {
        case "price-asc":
          query = query.order("price", { ascending: true });
          break;
        case "price-desc":
          query = query.order("price", { ascending: false });
          break;
        case "created-asc":
          query = query.order("created_at", { ascending: true });
          break;
        case "created-desc":
          query = query.order("created_at", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }
    } else {
      // Por padrão, mostrar os mais recentes primeiro
      query = query.order("created_at", { ascending: false });
    }

    const { data: products, error } = await query;

    if (error) {
      console.error(
        `Erro ao buscar produtos da categoria ${categoryId}:`,
        error
      );
      throw error;
    }

    console.log(`Encontrados ${products?.length || 0} produtos inicialmente`);

    // Identificar filtros de classificação (excluindo filtros básicos)
    const classificationFilters = filters
      ? Object.entries(filters).filter(
          ([key]) =>
            ![
              "subcategoryId",
              "maxPrice",
              "minPrice",
              "sortBy",
              "brandSlug",
            ].includes(key)
        )
      : [];

    // Se houver filtros de classificação
    if (classificationFilters.length > 0) {
      console.log("Aplicando filtros de classificação:", classificationFilters);

      // Filtrar produtos que atendem aos critérios
      const filteredProducts = products.filter((product) => {
        // Pegar todas as classificações deste produto
        const productClassifications =
          product.product_classifications?.map(
            (pc: any) => pc.classification
          ) || [];

        // Se não há filtros de classificação ativos, retorna true
        if (classificationFilters.length === 0) {
          return true;
        }

        // Se há filtros mas o produto não tem classificações, retorna false
        if (productClassifications.length === 0) {
          return false;
        }

        console.log(
          `Produto ${product.id} - Classificações:`,
          productClassifications.map((c: any) => ({
            name: c.name,
            type: c.type,
          }))
        );

        // Verificar cada tipo de classificação
        const matches = classificationFilters.map(
          ([filterType, selectedValues]) => {
            // Se não houver valores selecionados, considera como match
            if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
              return true;
            }

            // Encontrar classificações do produto que correspondem ao tipo do filtro
            const classificationsOfType = productClassifications.filter(
              (classification: any) => {
                const normalizedClassificationType = classification.type
                  .toLowerCase()
                  .replace(/\s+/g, "_");
                return (
                  normalizedClassificationType === filterType.toLowerCase()
                );
              }
            );

            console.log(`Filtro ${filterType}:`, {
              valoresSelecionados: selectedValues,
              classificacoesDisponiveis: classificationsOfType.map(
                (c: any) => ({
                  name: c.name,
                  type: c.type,
                  normalizedType: c.type.toLowerCase().replace(/\s+/g, "_"),
                })
              ),
              tipoFiltro: filterType.toLowerCase(),
            });

            // Produto deve ter todas as classificações selecionadas deste tipo
            const match = selectedValues.every((value) =>
              classificationsOfType.some(
                (classification: any) =>
                  classification.name.toLowerCase() === value.toLowerCase()
              )
            );

            console.log(`Resultado do filtro ${filterType}:`, match);
            return match;
          }
        );

        // Log detalhado do resultado da filtragem
        console.log(`Produto ${product.id} - Resultado final:`, {
          filtrosAplicados: classificationFilters.map(([type, values]) => ({
            type,
            values,
          })),
          matches,
          incluir: matches.every(Boolean),
        });

        // Produto deve atender a TODOS os critérios de TODOS os tipos de classificação
        return matches.every(Boolean);
      });

      console.log(
        "Produtos filtrados:",
        filteredProducts.map((p) => p.id)
      );
      return filteredProducts;
    }

    return products;
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
