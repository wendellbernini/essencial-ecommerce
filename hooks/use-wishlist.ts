import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/lib/types";

export function useWishlist() {
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  // Carregar itens da wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setIsLoading(false);
          return;
        }

        const { data: wishlist, error } = await supabase
          .from("wishlist")
          .select("product_id")
          .eq("user_id", session.user.id);

        if (error) throw error;

        setWishlistItems(wishlist?.map((item) => item.product_id) || []);
      } catch (error) {
        console.error("Erro ao carregar wishlist:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar seus produtos favoritos.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, [supabase, toast]);

  // Verificar se um produto está na wishlist
  const isInWishlist = (productId: number) => {
    return wishlistItems.includes(productId);
  };

  // Adicionar/remover produto da wishlist
  const toggleWishlist = async (productId: number) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: "Atenção",
          description:
            "Você precisa fazer login para adicionar produtos aos favoritos.",
          variant: "destructive",
        });
        return;
      }

      const isCurrentlyInWishlist = isInWishlist(productId);

      if (isCurrentlyInWishlist) {
        // Remover da wishlist
        const { error } = await supabase
          .from("wishlist")
          .delete()
          .eq("user_id", session.user.id)
          .eq("product_id", productId);

        if (error) throw error;

        setWishlistItems((prev) => prev.filter((id) => id !== productId));
        toast({
          title: "Produto removido",
          description: "Produto removido dos favoritos com sucesso.",
        });
      } else {
        // Adicionar à wishlist
        const { error } = await supabase.from("wishlist").insert({
          user_id: session.user.id,
          product_id: productId,
        });

        if (error) throw error;

        setWishlistItems((prev) => [...prev, productId]);
        toast({
          title: "Produto adicionado",
          description: "Produto adicionado aos favoritos com sucesso.",
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar wishlist:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar seus favoritos.",
        variant: "destructive",
      });
    }
  };

  // Carregar produtos da wishlist com detalhes
  const loadWishlistProducts = async (): Promise<Product[]> => {
    try {
      if (wishlistItems.length === 0) return [];

      const { data: products, error } = await supabase
        .from("products")
        .select(
          `
          *,
          brand:brands(*),
          categories(*),
          subcategories(*)
        `
        )
        .in("id", wishlistItems);

      if (error) throw error;

      return products || [];
    } catch (error) {
      console.error("Erro ao carregar produtos da wishlist:", error);
      toast({
        title: "Erro",
        description:
          "Não foi possível carregar os detalhes dos produtos favoritos.",
        variant: "destructive",
      });
      return [];
    }
  };

  return {
    wishlistItems,
    isInWishlist,
    toggleWishlist,
    loadWishlistProducts,
    isLoading,
  };
}
