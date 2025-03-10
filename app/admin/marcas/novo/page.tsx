"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";

export default function NewBrandPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo_url: "",
  });

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

      const { error } = await supabase.from("brands").insert([brandData]);

      if (error) throw error;

      toast({
        title: "Marca criada com sucesso!",
        description: "A marca foi adicionada ao catálogo.",
      });

      router.push("/admin/marcas");
    } catch (error) {
      console.error("Erro ao criar marca:", error);
      toast({
        title: "Erro ao criar marca",
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
        <h2 className="text-3xl font-bold tracking-tight">Nova Marca</h2>
        <p className="text-muted-foreground">
          Adicione uma nova marca ao catálogo.
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
            {isLoading ? "Criando..." : "Criar Marca"}
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
