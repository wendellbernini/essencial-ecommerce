"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function NewSecondaryBannerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    image_url: "",
    type: "double",
    is_active: true,
    order_index: "0",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.image_url) {
        throw new Error("A imagem do banner é obrigatória");
      }

      const bannerData = {
        title: formData.title || null,
        link: formData.link || null,
        image_url: formData.image_url,
        type: formData.type,
        is_active: formData.is_active,
        order_index: Number(formData.order_index),
      };

      const { error } = await supabase
        .from("secondary_banners")
        .insert([bannerData]);

      if (error) throw error;

      toast({
        title: "Banner criado com sucesso!",
        description: "O banner foi adicionado à página inicial.",
      });

      router.push("/admin/banners-secundarios");
    } catch (error) {
      console.error("Erro ao criar banner:", error);
      toast({
        title: "Erro ao criar banner",
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
        <h2 className="text-3xl font-bold tracking-tight">Novo Banner</h2>
        <p className="text-muted-foreground">
          Adicione um novo banner secundário.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Banner (opcional)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Nome para identificação do banner"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link do Banner (opcional)</Label>
            <Input
              id="link"
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="URL para onde o banner deve direcionar"
            />
          </div>

          <div className="space-y-2">
            <Label>Imagem do Banner</Label>
            <ImageUpload
              value={formData.image_url ? [formData.image_url] : []}
              disabled={isLoading}
              onChange={(url) => {
                setFormData({ ...formData, image_url: url });
              }}
              onRemove={() => {
                setFormData({ ...formData, image_url: "" });
              }}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Banner</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as "double" | "carousel",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="double">Banner Duplo</SelectItem>
                  <SelectItem value="carousel">Banner Carrossel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="order_index">Ordem de Exibição</Label>
              <Input
                id="order_index"
                type="number"
                min="0"
                value={formData.order_index}
                onChange={(e) =>
                  setFormData({ ...formData, order_index: e.target.value })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label htmlFor="is_active">Banner Ativo</Label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Banner"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/banners-secundarios")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
