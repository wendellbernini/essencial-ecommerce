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
import { Switch } from "@/components/ui/switch";

export default function NewBannerPage() {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    link: "",
    image_url: "",
    start_date: "",
    end_date: "",
    is_active: true,
    has_countdown: false,
    order_index: "0",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.image_url) {
        throw new Error("A imagem do banner é obrigatória");
      }

      if (formData.has_countdown) {
        if (!formData.start_date || !formData.end_date) {
          throw new Error(
            "Data de início e término são obrigatórias quando o contador está ativo"
          );
        }
      }

      const bannerData = {
        link: formData.link || null,
        image_url: formData.image_url,
        start_date: formData.has_countdown
          ? new Date(formData.start_date).toISOString()
          : null,
        end_date: formData.has_countdown
          ? new Date(formData.end_date).toISOString()
          : null,
        is_active: formData.is_active,
        has_countdown: formData.has_countdown,
        order_index: Number(formData.order_index),
      };

      const { error } = await supabase
        .from("promo_banners")
        .insert([bannerData]);

      if (error) throw error;

      toast({
        title: "Banner criado com sucesso!",
        description: "O banner foi adicionado à página inicial.",
      });

      router.push("/admin/banners");
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
          Adicione um novo banner promocional.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
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

            <div className="flex items-center space-x-4 pt-8">
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="has_countdown"
                  checked={formData.has_countdown}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, has_countdown: checked })
                  }
                />
                <Label htmlFor="has_countdown">Exibir Contador</Label>
              </div>
            </div>
          </div>

          {formData.has_countdown && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Data de Início</Label>
                <Input
                  id="start_date"
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, start_date: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">Data de Término</Label>
                <Input
                  id="end_date"
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) =>
                    setFormData({ ...formData, end_date: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar Banner"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/banners")}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
