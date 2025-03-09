"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SecondaryBanner } from "@/lib/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function SecondaryBannersPage() {
  const [banners, setBanners] = useState<SecondaryBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [bannerToDelete, setBannerToDelete] = useState<SecondaryBanner | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    loadBanners();

    // Inscreve-se para atualizações em tempo real
    const channel = supabase
      .channel("secondary_banners_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "secondary_banners",
        },
        () => {
          loadBanners();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function loadBanners() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("secondary_banners")
        .select("*")
        .order("type", { ascending: true })
        .order("order_index", { ascending: true });

      if (error) throw error;

      setBanners(data || []);
    } catch (error) {
      console.error("Erro ao carregar banners:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = (banner: SecondaryBanner) => {
    setBannerToDelete(banner);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("secondary_banners")
        .delete()
        .eq("id", bannerToDelete.id);

      if (error) throw error;

      toast({
        title: "Banner excluído com sucesso",
        description: `O banner "${bannerToDelete.title}" foi removido.`,
      });

      loadBanners();
    } catch (error) {
      console.error("Erro ao excluir banner:", error);
      toast({
        title: "Erro ao excluir banner",
        description:
          "Ocorreu um erro ao tentar excluir o banner. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setBannerToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Banners Secundários
          </h2>
          <p className="text-muted-foreground">
            Gerencie os banners secundários da página inicial.
          </p>
        </div>
        <Link href="/admin/banners-secundarios/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Banner
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Carregando banners...</div>
        ) : banners.length === 0 ? (
          <div className="text-center py-4">Nenhum banner encontrado.</div>
        ) : (
          <div className="grid gap-4">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white rounded-lg shadow p-4 flex items-center gap-6"
              >
                <div className="relative w-48 h-32 rounded-lg overflow-hidden">
                  <Image
                    src={banner.image_url}
                    alt={banner.title || "Banner"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={
                        banner.type === "double" ? "default" : "secondary"
                      }
                    >
                      {banner.type === "double" ? "Banner Duplo" : "Carrossel"}
                    </Badge>
                    {banner.is_active ? (
                      <Badge className="bg-green-500">Ativo</Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {banner.title || "Sem título"}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/banners-secundarios/${banner.id}/editar`}>
                    <Button variant="outline">Editar</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(banner)}
                    disabled={isDeleting}
                  >
                    Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={!!bannerToDelete}
        onOpenChange={() => setBannerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o banner &quot;
              {bannerToDelete?.title}&quot;? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600 text-white"
            >
              {isDeleting ? "Excluindo..." : "Excluir banner"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
