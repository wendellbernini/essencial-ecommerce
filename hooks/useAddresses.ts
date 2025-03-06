import { useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Address, AddressFormData, CepResponse } from "@/types/address";
import { toast } from "sonner";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClientComponentClient();

  const fetchAddresses = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data: addresses, error } = await supabase
        .from("addresses")
        .select("*")
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAddresses(addresses || []);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      toast.error("Erro ao carregar seus endereços");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const createAddress = useCallback(
    async (data: AddressFormData) => {
      try {
        setIsLoading(true);

        // Se este é o primeiro endereço ou foi marcado como padrão
        if (addresses.length === 0 || data.is_default) {
          // Primeiro, remove o status de padrão de todos os outros endereços
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .neq("id", "temp");
        }

        const { error } = await supabase.from("addresses").insert({
          ...data,
          is_default: addresses.length === 0 ? true : data.is_default,
        });

        if (error) throw error;

        toast.success("Endereço adicionado com sucesso");
        await fetchAddresses();
      } catch (error) {
        console.error("Erro ao criar endereço:", error);
        toast.error("Erro ao adicionar endereço");
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, addresses.length, fetchAddresses]
  );

  const updateAddress = useCallback(
    async (id: string, data: Partial<AddressFormData>) => {
      try {
        setIsLoading(true);

        // Se está definindo como padrão, remove o status de padrão dos outros
        if (data.is_default) {
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .neq("id", id);
        }

        const { error } = await supabase
          .from("addresses")
          .update(data)
          .eq("id", id);

        if (error) throw error;

        toast.success("Endereço atualizado com sucesso");
        await fetchAddresses();
      } catch (error) {
        console.error("Erro ao atualizar endereço:", error);
        toast.error("Erro ao atualizar endereço");
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, fetchAddresses]
  );

  const deleteAddress = useCallback(
    async (id: string) => {
      try {
        setIsLoading(true);

        const { error } = await supabase
          .from("addresses")
          .delete()
          .eq("id", id);

        if (error) throw error;

        toast.success("Endereço removido com sucesso");
        await fetchAddresses();
      } catch (error) {
        console.error("Erro ao deletar endereço:", error);
        toast.error("Erro ao remover endereço");
      } finally {
        setIsLoading(false);
      }
    },
    [supabase, fetchAddresses]
  );

  const fetchAddressByCep = useCallback(
    async (cep: string): Promise<Partial<AddressFormData> | null> => {
      try {
        const formattedCep = cep.replace(/\D/g, "");
        const response = await fetch(
          `https://viacep.com.br/ws/${formattedCep}/json/`
        );
        const data: CepResponse = await response.json();

        if (data.erro) {
          toast.error("CEP não encontrado");
          return null;
        }

        return {
          zip_code: data.cep.replace(/\D/g, ""),
          street: data.logradouro,
          complement: data.complemento,
          neighborhood: data.bairro,
          city: data.localidade,
          state: data.uf,
        };
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        toast.error("Erro ao buscar CEP");
        return null;
      }
    },
    []
  );

  return {
    addresses,
    isLoading,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    fetchAddressByCep,
  };
}
