"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Brand } from "@/lib/types";
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

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  useEffect(() => {
    loadBrands();

    // Inscreve-se para atualizações em tempo real
    const channel = supabase
      .channel("brands_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "brands",
        },
        () => {
          loadBrands();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  async function loadBrands() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      setBrands(data || []);
    } catch (error) {
      console.error("Erro ao carregar marcas:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = (brand: Brand) => {
    setBrandToDelete(brand);
  };

  const confirmDelete = async () => {
    if (!brandToDelete) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("brands")
        .delete()
        .eq("id", brandToDelete.id);

      if (error) throw error;

      toast({
        title: "Marca excluída com sucesso",
        description: `A marca "${brandToDelete.name}" foi removida.`,
      });

      loadBrands();
    } catch (error) {
      console.error("Erro ao excluir marca:", error);
      toast({
        title: "Erro ao excluir marca",
        description:
          "Ocorreu um erro ao tentar excluir a marca. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setBrandToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Marcas</h2>
          <p className="text-muted-foreground">
            Gerencie as marcas disponíveis no catálogo.
          </p>
        </div>
        <Link href="/admin/marcas/novo">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Marca
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Carregando marcas...</div>
        ) : brands.length === 0 ? (
          <div className="text-center py-4">Nenhuma marca encontrada.</div>
        ) : (
          <div className="grid gap-4">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white rounded-lg shadow p-4 flex items-center gap-6"
              >
                {brand.logo_url && (
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {brand.name}
                  </h3>
                  {brand.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {brand.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/marcas/${brand.id}/editar`}>
                    <Button variant="outline">Editar</Button>
                  </Link>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(brand)}
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
        open={!!brandToDelete}
        onOpenChange={() => setBrandToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a marca &quot;
              {brandToDelete?.name}&quot;? Esta ação não pode ser desfeita.
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
              {isDeleting ? "Excluindo..." : "Excluir marca"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
