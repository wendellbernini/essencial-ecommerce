import { NextResponse } from "next/server";
import { MelhorEnvioClient } from "@/lib/melhor-envio/client";

export async function GET(request: Request) {
  try {
    // Pegar o código da URL
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json(
        { error: "Código de autorização não fornecido" },
        { status: 400 }
      );
    }

    console.log("Código de autorização recebido:", code);

    // Gerar o token
    const token = await MelhorEnvioClient.generateToken(code);

    console.log("Token gerado com sucesso:", token);

    // Retornar o token para o usuário
    return new Response(
      `
      <html>
        <body>
          <h1>Token Gerado com Sucesso!</h1>
          <p>Adicione este token ao seu arquivo .env.local:</p>
          <pre>MELHOR_ENVIO_TOKEN=${token}</pre>
          <script>
            console.log("Token:", "${token}");
          </script>
        </body>
      </html>
    `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao gerar token:", error);
    return NextResponse.json({ error: "Erro ao gerar token" }, { status: 500 });
  }
}
