import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/profile/EditProfileForm";

// Força a página a ser dinâmica para sempre verificar a autenticação
export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  // Inicializa o cliente do Supabase no servidor
  const supabase = createServerComponentClient({ cookies });

  // Verifica se o usuário está autenticado
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Se não estiver autenticado, redireciona para o login
  if (!session) {
    redirect("/login");
  }

  // Busca os dados do usuário
  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .single();

  if (error) {
    console.error("Erro ao buscar dados do usuário:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Meu Perfil</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Menu lateral */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <nav className="space-y-2">
              <a
                href="/perfil"
                className="block py-2 px-4 bg-orange-50 text-orange-500 rounded-md font-medium"
              >
                Dados Pessoais
              </a>
              <a
                href="/perfil/enderecos"
                className="block py-2 px-4 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-md transition-colors"
              >
                Endereços
              </a>
              <a
                href="/perfil/pedidos"
                className="block py-2 px-4 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-md transition-colors"
              >
                Meus Pedidos
              </a>
              <a
                href="/perfil/wishlist"
                className="block py-2 px-4 text-gray-600 hover:bg-orange-50 hover:text-orange-500 rounded-md transition-colors"
              >
                Lista de Desejos
              </a>
            </nav>
          </div>

          {/* Conteúdo principal */}
          <div className="md:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Dados da Conta
              </h2>
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="mt-1 text-gray-900">{session.user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Último acesso
                  </label>
                  <p className="mt-1 text-gray-900">
                    {session.user.last_sign_in_at
                      ? new Date(session.user.last_sign_in_at).toLocaleString(
                          "pt-BR"
                        )
                      : "Primeiro acesso"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                Dados Pessoais
              </h2>
              <EditProfileForm
                initialData={{
                  full_name: userData?.full_name,
                  phone: userData?.phone,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
