"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export function AuthForm() {
  const supabase = createClientComponentClient();
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  useEffect(() => {
    setRedirectUrl(`${window.location.origin}/auth/callback`);
  }, []);

  return (
    <div className="w-full max-w-[400px] mx-auto p-4">
      {redirectUrl && (
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#f97316", // orange-500
                  brandAccent: "#ea580c", // orange-600
                },
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
                button_label: "Entrar",
                loading_button_label: "Entrando...",
                social_provider_text: "Entrar com {{provider}}",
                link_text: "Já tem uma conta? Entre",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Senha",
                button_label: "Criar conta",
                loading_button_label: "Criando conta...",
                social_provider_text: "Criar conta com {{provider}}",
                link_text: "Não tem uma conta? Cadastre-se",
              },
              magic_link: {
                button_label: "Enviar link mágico",
                loading_button_label: "Enviando link...",
                link_text: "Enviar link mágico para o email",
              },
              forgotten_password: {
                button_label: "Redefinir senha",
                loading_button_label: "Redefinindo...",
                link_text: "Esqueceu sua senha?",
              },
            },
          }}
        />
      )}
    </div>
  );
}
