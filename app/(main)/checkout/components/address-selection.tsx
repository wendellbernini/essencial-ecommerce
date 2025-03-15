"use client";

import { useState } from "react";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAddresses } from "@/hooks/useAddresses";
import { AddressForm } from "./address-form";
import { Address } from "@/types/address";
import { Loader2 } from "lucide-react";
import { ShippingCalculator } from "@/components/shipping/shipping-calculator";
import { useCart } from "@/contexts/cart-context";

interface AddressSelectionProps {
  onSelect: (address: Address) => void;
}

export function AddressSelection({ onSelect }: AddressSelectionProps) {
  const { addresses, isLoading } = useAddresses();
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((addr) => addr.is_default)?.id || null
  );
  const { selectedShipping } = useCart();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const selectedAddress = addresses.find(
    (addr) => addr.id === selectedAddressId
  );

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleNewAddressSubmit = async (data: any) => {
    // TODO: Implementar adição de novo endereço
    setShowNewAddressForm(false);
  };

  const handleContinue = () => {
    if (selectedAddress && selectedShipping) {
      onSelect(selectedAddress);
    }
  };

  if (showNewAddressForm) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Novo Endereço</h3>
          <Button variant="ghost" onClick={() => setShowNewAddressForm(false)}>
            Voltar aos endereços salvos
          </Button>
        </div>
        <AddressForm
          onSubmit={handleNewAddressSubmit}
          onCancel={() => setShowNewAddressForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {addresses.length > 0 ? (
        <div className="space-y-4">
          <RadioGroup
            value={selectedAddressId || undefined}
            onValueChange={handleAddressSelect}
            className="space-y-4"
          >
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                  selectedAddressId === address.id
                    ? "border-orange-500 ring-2 ring-orange-500"
                    : "border-gray-300"
                }`}
                onClick={() => handleAddressSelect(address.id)}
              >
                <div className="flex flex-1">
                  <div className="flex flex-col">
                    <span className="block text-sm font-medium text-gray-900">
                      {address.name}
                      {address.is_default && (
                        <span className="ml-2 text-xs text-orange-500">
                          (Principal)
                        </span>
                      )}
                    </span>
                    <span className="mt-1 flex items-center text-sm text-gray-500">
                      {address.recipient}
                    </span>
                    <span className="mt-1 text-sm text-gray-500">
                      {address.street}, {address.number}
                      {address.complement && ` - ${address.complement}`}
                    </span>
                    <span className="mt-1 text-sm text-gray-500">
                      {address.neighborhood} - {address.city}/{address.state}
                    </span>
                    <span className="mt-1 text-sm text-gray-500">
                      CEP: {address.zip_code.replace(/(\d{5})(\d{3})/, "$1-$2")}
                    </span>
                    {address.phone && (
                      <span className="mt-1 text-sm text-gray-500">
                        Telefone: {address.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>

          {selectedAddress && (
            <div className="mt-6">
              <ShippingCalculator
                originZipCode="01153000" // CEP de origem padrão
                weight={300} // Peso padrão de 300g
                length={16} // Dimensões padrão
                height={12}
                width={12}
                allowSelection={true}
                prefilledZipCode={selectedAddress.zip_code}
              />
            </div>
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Você ainda não possui endereços cadastrados
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => setShowNewAddressForm(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar novo endereço
      </Button>

      {selectedAddress && selectedShipping && (
        <Button
          type="button"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          onClick={handleContinue}
        >
          Continuar com este endereço
        </Button>
      )}
    </div>
  );
}
