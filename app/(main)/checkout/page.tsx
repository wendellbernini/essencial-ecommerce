"use client";

import { useCart } from "@/contexts/cart-context";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { CheckoutSteps } from "./components/checkout-steps";
import { AddressSelection } from "./components/address-selection";
import { PaymentForm } from "./components/payment-form";
import { useState } from "react";
import { Address } from "@/types/address";

export default function CheckoutPage() {
  const { items, total, isLoading, selectedShipping } = useCart();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // Calcula o valor total incluindo o frete
  const totalWithShipping = total + (selectedShipping?.price || 0);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-semibold">Seu carrinho está vazio</h1>
        <p className="text-gray-500">
          Adicione produtos ao carrinho para continuar
        </p>
        <Button
          onClick={() => router.push("/")}
          className="bg-orange-500 hover:bg-orange-600 text-white"
        >
          Voltar às compras
        </Button>
      </div>
    );
  }

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setCurrentStep(3); // Avança para o passo de pagamento
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <CheckoutSteps currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Coluna principal */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {currentStep === 1 && (
              <>
                <h2 className="text-xl font-semibold mb-6">Resumo do Pedido</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative aspect-square h-20 w-20 min-w-[80px] overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          className="object-cover"
                          fill
                          sizes="80px"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {item.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              Quantidade: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-medium">
                            {formatPrice(
                              (item.sale_price || item.price) * item.quantity
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button
                    onClick={() => setCurrentStep(2)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Continuar para endereço
                  </Button>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h2 className="text-xl font-semibold mb-6">
                  Endereço de Entrega
                </h2>
                <AddressSelection onSelect={handleAddressSelect} />
              </>
            )}

            {currentStep === 3 && selectedAddress && (
              <>
                <h2 className="text-xl font-semibold mb-6">Pagamento</h2>
                <PaymentForm selectedAddress={selectedAddress} />
              </>
            )}
          </div>
        </div>

        {/* Coluna lateral */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <h2 className="text-xl font-semibold">Resumo</h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Frete</span>
                <span>
                  {selectedShipping
                    ? formatPrice(selectedShipping.price)
                    : "Calculado no checkout"}
                </span>
              </div>

              <Separator />

              <div className="flex justify-between text-base font-medium">
                <span>Total</span>
                <span>{formatPrice(totalWithShipping)}</span>
              </div>
            </div>

            {selectedAddress && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Endereço de Entrega
                </h3>
                <div className="text-sm text-gray-500">
                  <p>{selectedAddress.recipient}</p>
                  <p>
                    {selectedAddress.street}, {selectedAddress.number}
                    {selectedAddress.complement &&
                      ` - ${selectedAddress.complement}`}
                  </p>
                  <p>
                    {selectedAddress.neighborhood} - {selectedAddress.city}/
                    {selectedAddress.state}
                  </p>
                  <p>
                    CEP:{" "}
                    {selectedAddress.zip_code.replace(
                      /(\d{5})(\d{3})/,
                      "$1-$2"
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
