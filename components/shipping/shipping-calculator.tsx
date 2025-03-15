"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Truck } from "lucide-react";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/cart-context";
import { ShippingOption } from "@/contexts/cart-context";

// Schema para validação do CEP
const zipCodeSchema = z.object({
  zipCode: z
    .string()
    .min(8, "CEP inválido")
    .max(9, "CEP inválido")
    .regex(/^\d{5}-?\d{3}$/, "CEP inválido")
    .transform((value) => value.replace(/\D/g, "")),
});

type ZipCodeFormData = z.infer<typeof zipCodeSchema>;

interface ShippingCalculatorProps {
  originZipCode: string;
  weight: number;
  length: number;
  height: number;
  width: number;
  allowSelection?: boolean;
  prefilledZipCode?: string;
}

export function ShippingCalculator({
  originZipCode,
  weight,
  length,
  height,
  width,
  allowSelection = false,
  prefilledZipCode,
}: ShippingCalculatorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { selectedShipping, setSelectedShipping } = useCart();

  const form = useForm<z.infer<typeof zipCodeSchema>>({
    resolver: zodResolver(zipCodeSchema),
    defaultValues: {
      zipCode: prefilledZipCode || "",
    },
  });

  useEffect(() => {
    if (prefilledZipCode) {
      form.setValue("zipCode", prefilledZipCode);
      form.handleSubmit(calculateShipping)();
    }
  }, [prefilledZipCode]);

  async function calculateShipping(values: z.infer<typeof zipCodeSchema>) {
    try {
      setIsLoading(true);
      setShowResults(false);
      setShippingOptions([]);
      setSelectedShipping(null);

      const requestData = {
        originZipCode,
        destinationZipCode: values.zipCode,
        weight,
        length,
        height,
        width,
      };

      console.log("Enviando requisição de cálculo com dados:", requestData);

      const response = await fetch("/api/shipping/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log("Resposta recebida:", data);

      if (!response.ok) {
        throw new Error(data.error || "Erro ao calcular o frete");
      }

      if (!data.shippingOptions || data.shippingOptions.length === 0) {
        toast.error("Não foi possível calcular o frete para este CEP");
        return;
      }

      setShippingOptions(data.shippingOptions);
      setShowResults(true);
      console.log("Opções de frete definidas:", data.shippingOptions);
    } catch (error: any) {
      console.error("Erro ao calcular frete:", error);
      toast.error(
        error.message || "Erro ao calcular o frete. Por favor, tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Função para formatar o CEP enquanto o usuário digita
  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const handleShippingSelect = (option: ShippingOption) => {
    setSelectedShipping(option);
  };

  return (
    <div className="space-y-4 border rounded-lg p-4">
      <h3 className="text-lg font-medium">
        {allowSelection ? "Selecionar Frete" : "Calcular Frete"}
      </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(calculateShipping)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="flex gap-2">
                    <Input
                      {...field}
                      value={formatZipCode(field.value)}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        if (value.length <= 8) {
                          field.onChange(value);
                        }
                      }}
                      placeholder="00000-000"
                      maxLength={9}
                      disabled={isLoading || !!prefilledZipCode}
                      className="max-w-[200px]"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !!prefilledZipCode}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Calculando...
                        </>
                      ) : (
                        "Calcular"
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
        </div>
      )}

      {showResults && shippingOptions.length > 0 && (
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serviço</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead>Valor</TableHead>
                {allowSelection && <TableHead></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {shippingOptions.map((option) => (
                <TableRow key={option.code}>
                  <TableCell>
                    {option.company} - {option.service}
                  </TableCell>
                  <TableCell>{option.deadline} dias úteis</TableCell>
                  <TableCell>{formatPrice(option.price)}</TableCell>
                  {allowSelection && (
                    <TableCell>
                      <Button
                        variant={
                          selectedShipping?.code === option.code
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleShippingSelect(option)}
                        className={
                          selectedShipping?.code === option.code
                            ? "bg-orange-500 hover:bg-orange-600 text-white"
                            : ""
                        }
                      >
                        {selectedShipping?.code === option.code
                          ? "Selecionado"
                          : "Selecionar"}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!prefilledZipCode && (
        <div className="text-sm text-gray-500">
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-500 hover:text-orange-600"
          >
            Não sei meu CEP
          </a>
        </div>
      )}
    </div>
  );
}
