"use client";

import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { Address } from "@/types/address";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentFormProps {
  selectedAddress: Address;
}

export function PaymentForm({ selectedAddress }: PaymentFormProps) {
  const { items, selectedShipping } = useCart();

  const handlePayment = async () => {
    try {
      // Verifica se um método de envio foi selecionado
      if (!selectedShipping) {
        toast.error(
          "Por favor, selecione uma opção de frete antes de continuar"
        );
        return;
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          selectedAddress,
          selectedShipping,
        }),
      });

      const { sessionId, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // Redirecionar para o checkout do Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Erro ao carregar Stripe");
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        throw stripeError;
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      toast.error("Erro ao processar pagamento. Por favor, tente novamente.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          Métodos de Pagamento Aceitos
        </h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg
              className="h-8 w-auto"
              viewBox="0 0 36 24"
              role="img"
              aria-labelledby="visa-card"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title id="visa-card">Cartão Visa</title>
              <rect width="36" height="24" rx="4" fill="#1434CB" />
              <path
                d="M15.4 15.1H13.3L14.8 9H16.9L15.4 15.1ZM11.5 9L9.5 13.1L9.2 11.9L9.2 11.9L8.5 9.6C8.5 9.6 8.4 9.2 7.9 9H5L5 9.1C5.7 9.3 6.3 9.6 6.9 9.9L8.7 15.1H10.8L14.2 9H11.5ZM19.9 13.1H21.8L22.5 11.2H20.6L21 10.1H22.9L23.5 8.3H19.3L17.8 14.4C17.7 14.8 17.9 15.2 18.3 15.2H20.8L21.5 13.4H19.6L19.9 13.1ZM27.5 9.1L27.1 10.3C27.1 10.3 26.4 9.9 25.7 9.9C25 9.9 24.2 10.3 24.2 10.9C24.2 12 26.7 11.8 26.7 13.5C26.7 14.8 25.3 15.3 24.1 15.3C23.1 15.3 22.1 14.9 22.1 14.9L22.5 13.7C22.5 13.7 23.5 14.2 24.2 14.2C24.6 14.2 25.1 13.9 25.1 13.5C25.1 12.4 22.6 12.6 22.6 11C22.6 9.8 23.8 9 25.2 9C26.1 9 27.5 9.1 27.5 9.1Z"
                fill="white"
              />
              <path
                d="M9.2 11.9L8.5 9.6C8.5 9.6 8.4 9.2 7.9 9H5L5 9.1C5.7 9.3 6.3 9.6 6.9 9.9"
                fill="#F9A51A"
              />
            </svg>
            <svg
              className="h-8 w-auto"
              viewBox="0 0 36 24"
              role="img"
              aria-labelledby="mastercard-card"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title id="mastercard-card">Cartão Mastercard</title>
              <rect width="36" height="24" rx="4" fill="#000" />
              <circle cx="13" cy="12" r="6" fill="#EB001B" />
              <circle cx="23" cy="12" r="6" fill="#F79E1B" />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18 16.6C19.6 15.2 20.6 13.2 20.6 11C20.6 8.8 19.6 6.8 18 5.4C16.4 6.8 15.4 8.8 15.4 11C15.4 13.2 16.4 15.2 18 16.6Z"
                fill="#FF5F00"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Pagamento seguro processado pelo Stripe
          </p>
        </div>
      </div>

      <Button
        onClick={handlePayment}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        size="lg"
        disabled={!selectedShipping}
      >
        Finalizar Compra
      </Button>
      {!selectedShipping && (
        <p className="text-sm text-red-500 text-center">
          Selecione uma opção de frete para continuar
        </p>
      )}
    </div>
  );
}
