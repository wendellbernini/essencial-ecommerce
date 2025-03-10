import { createServerSupabaseClient } from "@/lib/server-supabase";
import { HomeContent } from "@/components/home-content";

// Força a página a ser renderizada dinamicamente
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const supabase = createServerSupabaseClient();

  // Buscar produtos em destaque
  const { data: featuredProducts } = await supabase
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

  // Buscar categorias
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  // Buscar lançamentos
  const { data: newReleases } = await supabase
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

  // Buscar banners promocionais
  const { data: promoBanners } = await supabase
    .from("promo_banners")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  // Buscar produtos promocionais
  const { data: allProducts } = await supabase
    .from("products")
    .select(
      `
      *,
      categories:category_id(name, slug),
      brand:brand_id(name, slug, logo_url)
    `
    )
    .order("created_at", { ascending: false });

  const promotionalProducts =
    allProducts?.filter(
      (product) =>
        product.sale_price !== null && product.sale_price < product.price
    ) || [];

  // Buscar banners secundários
  const { data: secondaryBanners } = await supabase
    .from("secondary_banners")
    .select("*")
    .eq("is_active", true)
    .order("type", { ascending: true })
    .order("order_index", { ascending: true });

  // Separar os banners por tipo
  const doubleBanners =
    secondaryBanners?.filter((banner) => banner.type === "double") || [];
  const carouselBanners =
    secondaryBanners?.filter((banner) => banner.type === "carousel") || [];

  return (
    <HomeContent
      featuredProducts={featuredProducts || []}
      categories={categories || []}
      newReleases={newReleases || []}
      promoBanners={promoBanners || []}
      promotionalProducts={promotionalProducts}
      doubleBanners={doubleBanners}
      carouselBanners={carouselBanners}
    />
  );
}
