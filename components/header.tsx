import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  LogOut,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserAvatar } from "@/components/ui/user-avatar";

export function Header() {
  const [session, setSession] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    // Verifica o estado da sessão ao montar o componente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
    });

    // Inscreve para mudanças na sessão
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const fetchUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setUserData(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  // Determina o nome e avatar a serem exibidos
  const displayName =
    userData?.full_name ||
    session?.user?.user_metadata?.full_name ||
    "Minha Conta";
  const avatarUrl =
    userData?.avatar_url || session?.user?.user_metadata?.avatar_url;

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Botão de menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 hover:text-orange-500 hover:bg-orange-50"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image
              src="/images/logo_name.png"
              alt="Essencial"
              width={200}
              height={50}
              className="h-[50px] w-[200px] object-contain"
              priority
            />
          </Link>

          {/* Barra de busca */}
          <div className="hidden md:flex flex-1 mx-12 relative">
            <Input
              type="search"
              placeholder="Buscar por produtos"
              className="w-full rounded-full bg-white border-gray-200 pl-4 pr-10 py-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Navegação do usuário */}
          <div className="flex items-center space-x-4">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hidden md:flex items-center space-x-2 text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                  >
                    <UserAvatar
                      src={avatarUrl}
                      fallbackName={displayName}
                      className="h-8 w-8"
                    />
                    <span className="max-w-[100px] truncate">
                      {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white border border-gray-100 shadow-lg rounded-lg py-1"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/perfil"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Meu Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/perfil/pedidos"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      <span>Meus Pedidos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="/perfil/wishlist"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Lista de Desejos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                onClick={() => router.push("/login")}
              >
                <User className="h-5 w-5 mr-1" />
                <span>Entrar</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50"
              onClick={() => router.push("/perfil/wishlist")}
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50"
              onClick={() => router.push("/carrinho")}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Busca mobile */}
        <div className="mt-3 relative md:hidden">
          <Input
            type="search"
            placeholder="Buscar por produtos"
            className="w-full rounded-full bg-white border-gray-200 pl-4 pr-10 py-2 focus:ring-orange-500 focus:border-orange-500 placeholder-gray-500"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Navegação de categorias */}
        <nav className="hidden md:flex items-center justify-between mt-4 text-sm bg-white">
          <ul className="flex space-x-6">
            {[
              "Skincare",
              "Maquiagem",
              "Cabelos",
              "Perfumes",
              "Corpo & Banho",
              "Unhas",
            ].map((category) => (
              <li key={category}>
                <Link
                  href={`/categoria/${category
                    .toLowerCase()
                    .replace(/ & /g, "-e-")}`}
                  className="text-gray-700 hover:text-orange-500 flex items-center"
                >
                  {category}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
