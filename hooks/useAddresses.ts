import { useState, useCallback, useEffect } from "react";
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

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        console.log("Usuário não está autenticado");
        setAddresses([]);
        return;
      }

      console.log("Buscando endereços para usuário:", session.user.id);

      const { data: addresses, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", session.user.id)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar endereços:", error);
        throw error;
      }

      console.log("Endereços encontrados:", addresses);
      setAddresses(addresses || []);
    } catch (error) {
      console.error("Erro ao buscar endereços:", error);
      toast.error("Erro ao carregar seus endereços");
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const createAddress = useCallback(
    async (data: AddressFormData) => {
      try {
        setIsLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          console.log("Tentativa de criar endereço sem autenticação");
          toast.error("Você precisa estar logado para adicionar um endereço");
          return;
        }

        console.log(
          "Iniciando criação de endereço para usuário:",
          session.user.id
        );

        // Preparar os dados do endereço
        const addressData = {
          ...data,
          user_id: session.user.id,
          is_default: addresses.length === 0 ? true : data.is_default,
          // Remover formatação do telefone e CEP
          phone: data.phone?.replace(/\D/g, ""),
          zip_code: data.zip_code.replace(/\D/g, ""),
        };

        console.log("Dados do endereço a ser criado:", addressData);

        // Se este é o primeiro endereço ou foi marcado como padrão
        if (addressData.is_default) {
          console.log("Removendo status de padrão de outros endereços");
          const { error: updateError } = await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", session.user.id);

          if (updateError) {
            console.error(
              "Erro ao atualizar endereços existentes:",
              updateError
            );
            throw updateError;
          }
        }

        // Inserir o novo endereço
        const { data: newAddress, error: insertError } = await supabase
          .from("addresses")
          .insert(addressData)
          .select()
          .single();

        if (insertError) {
          console.error("Erro detalhado ao criar endereço:", insertError);
          throw insertError;
        }

        console.log("Endereço criado com sucesso:", newAddress);
        toast.success("Endereço adicionado com sucesso");
        await fetchAddresses();
      } catch (error: any) {
        console.error("Erro ao criar endereço:", error);
        toast.error(error.message || "Erro ao adicionar endereço");
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

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          toast.error("Você precisa estar logado para atualizar um endereço");
          return;
        }

        // Preparar os dados para atualização
        const updateData = {
          ...data,
          phone: data.phone?.replace(/\D/g, ""),
          zip_code: data.zip_code?.replace(/\D/g, ""),
          updated_at: new Date().toISOString(),
        };

        // Se está definindo como padrão, remove o status de padrão dos outros
        if (data.is_default) {
          await supabase
            .from("addresses")
            .update({ is_default: false })
            .eq("user_id", session.user.id)
            .neq("id", id);
        }

        const { error } = await supabase
          .from("addresses")
          .update(updateData)
          .eq("id", id)
          .eq("user_id", session.user.id);

        if (error) throw error;

        toast.success("Endereço atualizado com sucesso");
        await fetchAddresses();
      } catch (error: any) {
        console.error("Erro ao atualizar endereço:", error);
        toast.error(error.message || "Erro ao atualizar endereço");
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

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          toast.error("Você precisa estar logado para remover um endereço");
          return;
        }

        const { error } = await supabase
          .from("addresses")
          .delete()
          .eq("id", id)
          .eq("user_id", session.user.id);

        if (error) throw error;

        toast.success("Endereço removido com sucesso");
        await fetchAddresses();
      } catch (error: any) {
        console.error("Erro ao deletar endereço:", error);
        toast.error(error.message || "Erro ao remover endereço");
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
        if (formattedCep.length !== 8) {
          toast.error("CEP inválido");
          return null;
        }

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
