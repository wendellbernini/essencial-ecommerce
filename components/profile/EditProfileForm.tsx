"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

interface EditProfileFormProps {
  initialData: {
    full_name?: string;
    phone?: string;
  };
}

export function EditProfileForm({ initialData }: EditProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || "",
    phone: initialData.phone || "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Usuário não encontrado");
      }

      const { error } = await supabase.from("users").upsert({
        id: user.id,
        full_name: formData.full_name,
        phone: formData.phone,
        updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      setMessage("Dados atualizados com sucesso!");
      router.refresh();
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      setMessage("Erro ao atualizar os dados. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="full_name"
          className="block text-sm font-medium text-gray-700"
        >
          Seu nome completo
        </label>
        <Input
          id="full_name"
          type="text"
          value={formData.full_name}
          onChange={(e) =>
            setFormData({ ...formData, full_name: e.target.value })
          }
          className="mt-1 w-full rounded-md bg-gray-50 border-gray-200 focus:ring-orange-500 focus:border-orange-500"
          placeholder="Digite seu nome completo"
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700"
        >
          Telefone
        </label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-1 w-full rounded-md bg-gray-50 border-gray-200 focus:ring-orange-500 focus:border-orange-500"
          placeholder="(00) 00000-0000"
        />
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.includes("sucesso")
              ? "text-green-600 bg-green-50"
              : "text-red-600 bg-red-50"
          } p-3 rounded-md`}
        >
          {message}
        </p>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500"
        >
          {isSaving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </div>
    </form>
  );
}
