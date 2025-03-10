"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditBrandPage({ params }: PageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo_url: "",
  });

  useEffect(() => {
    const loadBrand = async () => {
      try {
        const { data, error } = await supabase
          .from("brands")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            name: data.name,
            description: data.description || "",
            logo_url: data.logo_url || "",
          });
        }
      } catch (error) {
        console.error("Erro ao carregar marca:", error);
        toast({
          title: "Erro ao carregar marca",
          description: "Não foi possível carregar os dados da marca.",
          variant: "destructive",
        });
      }
    };

    loadBrand();
  }, [params.id, supabase, toast]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.name) {
        throw new Error("O nome da marca é obrigatório");
      }

      // Criar o slug a partir do nome
      const slug = formData.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");

      const brandData = {
        name: formData.name,
        slug,
        description: formData.description || null,
        logo_url: formData.logo_url || null,
      };

      const { error } = await supabase
        .from("brands")
        .update(brandData)
        .eq("id", params.id);

      if (error) throw error;

      toast({
        title: "Marca atualizada com sucesso!",
        description: "As alterações foram salvas.",
      });

      router.push("/admin/marcas");
    } catch (error) {
      console.error("Erro ao atualizar marca:", error);
      toast({
        title: "Erro ao atualizar marca",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Editar Marca</h2>
        <p className="text-muted-foreground">
          Atualize as informações da marca.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Marca</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Digite o nome da marca"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Digite uma descrição para a marca"
            />
          </div>

          <div className="space-y-2">
            <Label>Logo da Marca</Label>
            <ImageUpload
              value={formData.logo_url ? [formData.logo_url] : []}
              disabled={isLoading}
              onChange={(url) => {
                setFormData({ ...formData, logo_url: url });
              }}
              onRemove={() => {
                setFormData({ ...formData, logo_url: "" });
              }}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Alterações"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/marcas")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
