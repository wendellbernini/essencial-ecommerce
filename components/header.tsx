"use client";

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
  LayoutDashboard,
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
import { useCart } from "@/contexts/cart-context";
import { useSearch } from "@/hooks/useSearch";
import { formatPrice } from "@/lib/utils";

export function Header() {
  const [session, setSession] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { toggleCart, total_items } = useCart();
  const { query, setQuery, results, isLoading } = useSearch();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      setIsAdmin(data.role === "admin");
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
    <header
      className={`bg-white border-b border-gray-200 transition-shadow duration-200 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Botão de menu mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700 hover:text-orange-500 hover:bg-orange-50"
          >
            <Menu className="h-6 w-6" />
          </Button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 -ml-3">
            <Image
              src="/images/logo.png"
              alt="Essencial"
              width={220}
              height={55}
              className="h-[55px] w-auto object-contain"
              priority
            />
          </Link>

          {/* Barra de busca */}
          <div className="hidden md:flex flex-1 mx-4 relative">
            <form
              action={`/busca`}
              className="w-full"
              onSubmit={(e) => {
                if (!query.trim()) {
                  e.preventDefault();
                }
              }}
            >
              <Input
                type="search"
                name="q"
                placeholder="Buscar por produtos"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-full bg-gray-100 border-gray-300 pl-4 pr-10 py-2 focus:ring-black focus:border-black placeholder-gray-900 text-gray-900"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-900 hover:text-black"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>

            {/* Resultados rápidos da busca */}
            {query.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Buscando produtos...
                  </div>
                ) : results.length > 0 ? (
                  <>
                    <div className="py-2">
                      {results.slice(0, 5).map((product) => (
                        <Link
                          key={product.id}
                          href={`/produto/${product.slug}`}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                        >
                          <div className="w-12 h-12 relative flex-shrink-0">
                            <Image
                              src={product.images[0] || "/placeholder.png"}
                              alt={product.name}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {product.categories.name}
                            </p>
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.sale_price ? (
                              <>
                                <span className="text-orange-500">
                                  {formatPrice(product.sale_price)}
                                </span>
                                <span className="ml-2 line-through text-gray-400">
                                  {formatPrice(product.price)}
                                </span>
                              </>
                            ) : (
                              formatPrice(product.price)
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    {results.length > 5 && (
                      <Link
                        href={`/busca?q=${encodeURIComponent(query)}`}
                        className="block px-4 py-3 text-sm text-center text-orange-500 hover:bg-orange-50 border-t border-gray-100"
                      >
                        Ver todos os {results.length} resultados
                      </Link>
                    )}
                  </>
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Nenhum produto encontrado
                  </div>
                )}
              </div>
            )}
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
                  {isAdmin && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin"
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500 bg-gray-50"
                        >
                          <LayoutDashboard className="mr-2.5 h-4 w-4" />
                          <span>Painel</span>
                        </Link>
                      </DropdownMenuItem>
                      <div className="h-px bg-gray-100 my-1" />
                    </>
                  )}
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
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50 relative"
              onClick={toggleCart}
            >
              <ShoppingCart className="h-5 w-5" />
              {total_items > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[10px] font-medium text-white">
                  {total_items}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Busca mobile */}
        <div className="mt-3 relative md:hidden">
          <form
            action={`/busca`}
            onSubmit={(e) => {
              if (!query.trim()) {
                e.preventDefault();
              }
            }}
          >
            <Input
              type="search"
              name="q"
              placeholder="Buscar por produtos"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full bg-gray-100 border-gray-300 pl-4 pr-10 py-2 focus:ring-black focus:border-black placeholder-gray-900 text-gray-900"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-900 hover:text-black"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* Resultados rápidos da busca - Mobile */}
          {query.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-[400px] overflow-y-auto z-50">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Buscando produtos...
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="py-2">
                    {results.slice(0, 3).map((product) => (
                      <Link
                        key={product.id}
                        href={`/produto/${product.slug}`}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50"
                      >
                        <div className="w-12 h-12 relative flex-shrink-0">
                          <Image
                            src={product.images[0] || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {product.categories.name}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {results.length > 3 && (
                    <Link
                      href={`/busca?q=${encodeURIComponent(query)}`}
                      className="block px-4 py-3 text-sm text-center text-orange-500 hover:bg-orange-50 border-t border-gray-100"
                    >
                      Ver todos os {results.length} resultados
                    </Link>
                  )}
                </>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Nenhum produto encontrado
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navegação de categorias */}
        <nav className="hidden md:flex items-center justify-between mt-4 text-sm bg-white">
          <ul className="flex space-x-6">
            {[
              "SKINCARE",
              "MAQUIAGEM",
              "CABELOS",
              "PERFUMES",
              "CORPO & BANHO",
              "UNHAS",
            ].map((category) => (
              <li key={category}>
                <Link
                  href={`/categoria/${category
                    .toLowerCase()
                    .replace(/ & /g, "-e-")}`}
                  className="text-gray-700 hover:text-orange-500 flex items-center font-medium tracking-wide"
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
