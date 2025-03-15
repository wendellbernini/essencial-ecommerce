import { ShippingCalculateRequest, ShippingService } from "./types";

export class MelhorEnvioClient {
  private baseUrl: string;
  private token: string;

  constructor() {
    this.baseUrl =
      process.env.MELHOR_ENVIO_SANDBOX === "true"
        ? "https://sandbox.melhorenvio.com.br"
        : "https://www.melhorenvio.com.br";

    this.token = process.env.MELHOR_ENVIO_TOKEN || "";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.token}`,
      ...options.headers,
    };

    console.log("🔵 Fazendo requisição para:", url);
    console.log("🔵 Headers:", headers);
    console.log("🔵 Body:", options.body);

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🔴 Erro na resposta:", data);
      throw new Error(data.message || "Erro na requisição ao Melhor Envio");
    }

    console.log("🟢 Resposta recebida:", data);
    return data;
  }

  async calculateShipping(
    data: ShippingCalculateRequest
  ): Promise<ShippingService[]> {
    try {
      // Ajustando o payload conforme documentação do Melhor Envio
      const payload = {
        from: {
          postal_code: data.from.postal_code,
        },
        to: {
          postal_code: data.to.postal_code,
        },
        products: data.products.map((product) => ({
          id: product.id || "1",
          width: product.width,
          height: product.height,
          length: product.length,
          weight: product.weight,
          insurance_value: product.insurance_value,
          quantity: product.quantity,
        })),
        options: {
          insurance_value: data.products[0].insurance_value,
          receipt: false,
          own_hand: false,
          collect: false,
        },
        services: "1,2,3,4,17", // Códigos dos serviços: 1=PAC, 2=SEDEX, 3=Jadlog.Package, 4=Jadlog.Com, 17=Mini Envios
      };

      console.log("🟡 Payload preparado:", payload);

      const response = await this.request<ShippingService[]>(
        "/api/v2/me/shipment/calculate",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      // Filtra apenas as opções válidas
      const validOptions = response.filter(
        (option) => !option.error && option.price > 0
      );

      console.log("🟢 Opções válidas:", validOptions);
      return validOptions;
    } catch (error) {
      console.error("🔴 Erro ao calcular frete:", error);
      throw error;
    }
  }

  // Método para gerar token de autenticação
  static async generateToken(code: string): Promise<string> {
    const response = await fetch(
      "https://sandbox.melhorenvio.com.br/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: process.env.MELHOR_ENVIO_CLIENT_ID,
          client_secret: process.env.MELHOR_ENVIO_CLIENT_SECRET,
          code,
          redirect_uri:
            "https://a23a-177-12-49-168.ngrok-free.app/api/shipping/auth/callback",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao gerar token");
    }

    const data = await response.json();
    return data.access_token;
  }
}
