"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import Link from "next/link";

export function AuthForm() {
  const supabase = createClientComponentClient();
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  useEffect(() => {
    // Em produção, usa a URL da Vercel, em desenvolvimento usa localhost
    const isProduction = process.env.NODE_ENV === "production";
    const baseUrl = isProduction
      ? "https://essencial-ecommerce.vercel.app"
      : "http://localhost:3000";

    setRedirectUrl(`${baseUrl}/auth/callback`);
  }, []);

  return (
    <div className="w-full">
      {redirectUrl && (
        <div className="space-y-4">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "#111827",
                    brandAccent: "#374151",
                    brandButtonText: "white",
                    defaultButtonBackground: "white",
                    defaultButtonBackgroundHover: "#F1641E",
                    defaultButtonBorder: "#E2E4E7",
                    defaultButtonText: "#374151",
                    dividerBackground: "#E5E7EB",
                    inputBackground: "white",
                    inputBorder: "#E2E4E7",
                    inputBorderHover: "#d1d5db",
                    inputBorderFocus: "#F1641E",
                    inputText: "#374151",
                    inputPlaceholder: "#9CA3AF",
                    messageText: "#6B7280",
                    anchorTextColor: "#F1641E",
                    anchorTextHoverColor: "#ea580c",
                  },
                },
              },
              style: {
                container: {
                  gap: "20px",
                },
                button: {
                  borderRadius: "8px",
                  height: "44px",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                },
                input: {
                  borderRadius: "8px",
                  height: "44px",
                  fontSize: "14px",
                  transition: "all 0.2s ease",
                  backgroundColor: "white",
                },
                divider: {
                  margin: "24px 0",
                },
                message: {
                  fontSize: "14px",
                  padding: "0",
                  marginTop: "16px",
                  textAlign: "center",
                },
                anchor: {
                  fontSize: "14px",
                  textDecoration: "none",
                },
                label: {
                  fontSize: "14px",
                  marginBottom: "4px",
                  color: "#374151",
                },
              },
            }}
            providers={["google"]}
            redirectTo={redirectUrl}
            localization={{
              variables: {
                sign_in: {
                  email_label: "Email",
                  password_label: "Senha",
                  email_input_placeholder: "Seu endereço de email",
                  password_input_placeholder: "Sua senha",
                  button_label: "Entrar",
                  loading_button_label: "Entrando...",
                  social_provider_text: "Continuar com {{provider}}",
                  link_text: "Já tem uma conta? Entre",
                },
                sign_up: {
                  email_label: "Email",
                  password_label: "Senha",
                  email_input_placeholder: "Seu endereço de email",
                  password_input_placeholder: "Crie uma senha",
                  button_label: "Registrar",
                  loading_button_label: "Registrando...",
                  social_provider_text: "Continuar com {{provider}}",
                  link_text: "Não tem uma conta? Registre-se",
                },
                magic_link: {
                  email_input_placeholder: "Seu endereço de email",
                  button_label: "Enviar link mágico",
                  loading_button_label: "Enviando link...",
                  link_text: "Enviar link mágico para o email",
                },
                forgotten_password: {
                  email_label: "Email",
                  password_label: "Senha",
                  email_input_placeholder: "Seu endereço de email",
                  button_label: "Redefinir senha",
                  loading_button_label: "Redefinindo...",
                  link_text: "Esqueceu sua senha?",
                },
              },
            }}
            view="sign_in"
            showLinks={false}
          />
          <p className="text-sm text-gray-600 text-center mt-4">
            Ao fazer login ou se registrar, você concorda com nossos{" "}
            <Link
              href="/termos-de-uso"
              className="text-[#F1641E] hover:text-[#ea580c]"
            >
              Termos de Uso
            </Link>{" "}
            e confirma que leu nossa{" "}
            <Link
              href="/politica-de-privacidade"
              className="text-[#F1641E] hover:text-[#ea580c]"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
