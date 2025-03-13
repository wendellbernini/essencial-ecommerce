"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface UserData {
  email: string;
  full_name: string;
  phone: string;
}

export function PersonalDataSection() {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    full_name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;

      setUserData({
        email: session.user.email || "",
        full_name: data?.full_name || "",
        phone: data?.phone || "",
      });
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
      toast.error("Erro ao carregar seus dados");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("users")
        .update({
          full_name: userData.full_name,
          phone: userData.phone,
        })
        .eq("id", session.user.id);

      if (error) throw error;

      toast.success("Dados atualizados com sucesso");
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast.error("Erro ao salvar alterações");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Carregando dados...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-6">Dados da Conta</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-gray-900">{userData.email}</p>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-6">Dados Pessoais</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome completo
            </label>
            <Input
              id="full_name"
              value={userData.full_name}
              onChange={(e) =>
                setUserData({ ...userData, full_name: e.target.value })
              }
              className="mt-1"
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
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
              className="mt-1"
              placeholder="(00) 00000-0000"
            />
          </div>

          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isSaving}
          >
            {isSaving ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </div>
    </div>
  );
}
