import { NextResponse } from "next/server";
import { MelhorEnvioClient } from "@/lib/melhor-envio/client";

interface ShippingCalculationParams {
  originZipCode: string;
  destinationZipCode: string;
  weight: number; // em gramas
  length: number; // em cm
  height: number; // em cm
  width: number; // em cm
}

interface ShippingOption {
  service: string;
  code: string;
  price: number;
  deadline: number;
}

interface ViaCEPResponse {
  cep: string;
  uf: string;
  localidade: string;
  erro?: boolean;
}

// Fatores de multiplicação por região
const REGION_FACTORS: { [key: string]: number } = {
  // Sul
  PR: 1.2,
  SC: 1.2,
  RS: 1.2,
  // Sudeste
  SP: 1.0,
  RJ: 1.0,
  MG: 1.1,
  ES: 1.1,
  // Centro-Oeste
  MT: 1.4,
  MS: 1.3,
  GO: 1.3,
  DF: 1.2,
  // Nordeste
  BA: 1.4,
  CE: 1.5,
  PE: 1.4,
  MA: 1.6,
  PB: 1.4,
  PI: 1.5,
  RN: 1.4,
  SE: 1.4,
  AL: 1.4,
  // Norte
  AM: 1.8,
  PA: 1.7,
  AC: 1.9,
  RO: 1.7,
  RR: 1.9,
  AP: 1.8,
  TO: 1.6,
};

async function getAddressInfo(cep: string): Promise<ViaCEPResponse | null> {
  try {
    const cleanCEP = cep.replace(/\D/g, "");
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data = await response.json();
    return data.erro ? null : data;
  } catch {
    return null;
  }
}

async function calculateShipping({
  originZipCode,
  destinationZipCode,
  weight,
  length,
  height,
  width,
}: ShippingCalculationParams): Promise<ShippingOption[]> {
  try {
    // Buscar informações dos CEPs
    const [originInfo, destinationInfo] = await Promise.all([
      getAddressInfo(originZipCode),
      getAddressInfo(destinationZipCode),
    ]);

    if (!originInfo || !destinationInfo) {
      throw new Error("CEP de origem ou destino inválido");
    }

    // Converte peso para kg
    const weightInKg = Math.max(0.3, weight / 1000);

    // Calcula o volume em cm³
    const volume =
      Math.max(16, length) * Math.max(2, height) * Math.max(11, width);

    // Fator de região
    const regionFactor = REGION_FACTORS[destinationInfo.uf] || 1.3;

    // Cálculo base do frete considerando peso, volume e região
    const basePrice = Math.max(
      20,
      (weightInKg * 10 + volume * 0.001) * regionFactor
    );

    // Prazo base em dias baseado na região
    const baseDeadline = Math.min(10, Math.floor(regionFactor * 3));

    // Formata os valores para 2 casas decimais
    const formatPrice = (price: number) => Number(price.toFixed(2));

    // Retorna opções de frete
    return [
      {
        service: "SEDEX",
        code: "04014",
        price: formatPrice(basePrice * 2),
        deadline: baseDeadline,
      },
      {
        service: "PAC",
        code: "04510",
        price: formatPrice(basePrice),
        deadline: baseDeadline * 2,
      },
    ];
  } catch (error) {
    console.error("Erro ao calcular frete:", error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { originZipCode, destinationZipCode, weight, length, height, width } =
      await request.json();

    // Validações básicas
    if (!originZipCode || !destinationZipCode) {
      return NextResponse.json(
        { error: "CEP de origem e destino são obrigatórios" },
        { status: 400 }
      );
    }

    const client = new MelhorEnvioClient();

    // Convertendo gramas para kg se necessário
    const weightInKg = weight >= 1 ? weight / 1000 : weight;

    const shippingData = {
      from: {
        postal_code: originZipCode.replace(/\D/g, ""),
      },
      to: {
        postal_code: destinationZipCode.replace(/\D/g, ""),
      },
      products: [
        {
          id: "1",
          width: Number(width) || 11,
          height: Number(height) || 2,
          length: Number(length) || 16,
          weight: weightInKg, // Peso em kg
          insurance_value: 100, // Valor do seguro em reais
          quantity: 1,
        },
      ],
    };

    console.log("🟡 Enviando requisição para o Melhor Envio:", shippingData);

    const shippingOptions = await client.calculateShipping(shippingData);

    console.log("🟢 Opções de frete recebidas:", shippingOptions);

    // Formata as opções de frete para o formato esperado pelo frontend
    const formattedOptions = shippingOptions
      .filter((option) => !option.error) // Remove opções com erro
      .map((option) => ({
        service: option.name,
        code: option.id.toString(),
        price: Number(option.price) || 0,
        deadline: Number(option.delivery_time) || 0,
        company: option.company.name,
      }));

    console.log("🟢 Opções formatadas:", formattedOptions);

    return NextResponse.json({ shippingOptions: formattedOptions });
  } catch (error: any) {
    console.error("🔴 Erro ao calcular frete:", error);
    return NextResponse.json(
      {
        error: "Erro ao calcular frete",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
