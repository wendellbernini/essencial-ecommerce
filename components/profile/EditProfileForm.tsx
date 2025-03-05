"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EditProfileFormProps {
  initialData?: {
    full_name?: string;
    phone?: string;
  };
  onSuccess?: () => void;
}

export function EditProfileForm({
  initialData,
  onSuccess,
}: EditProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: initialData?.full_name || "",
    phone: initialData?.phone || "",
  });

  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Usuário não encontrado");
        return;
      }

      const { error } = await supabase
        .from("users")
        .upsert({
          id: user.id,
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast.error("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Nome completo</Label>
        <Input
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          placeholder="Seu nome completo"
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
          disabled={isLoading}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Salvando..." : "Salvar alterações"}
      </Button>
    </form>
  );
}
