"use client";

import { useAddresses } from "@/hooks/useAddresses";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddressCard } from "./address-card";
import { AddressForm } from "./address-form";
import { useDialog } from "@/hooks/useDialog";

export function AddressesSection() {
  const { addresses, isLoading } = useAddresses();
  const { Dialog, openDialog, closeDialog } = useDialog();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Meus Endereços</h2>
        <Button
          onClick={openDialog}
          className="bg-gray-800 hover:bg-gray-700 text-white focus:ring-2 focus:ring-gray-800 focus:ring-offset-2"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Endereço
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Carregando endereços...</div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Você ainda não possui endereços cadastrados
        </div>
      )}

      <Dialog title="Adicionar Endereço">
        <AddressForm onSuccess={closeDialog} />
      </Dialog>
    </div>
  );
}
