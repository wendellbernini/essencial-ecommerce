import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
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
              width={400}
              height={120}
              className="h-20 w-auto"
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
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex text-gray-700 hover:text-orange-500 hover:bg-orange-50"
            >
              <User className="h-5 w-5 mr-1" />
              <span>Entrar</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-700 hover:text-orange-500 hover:bg-orange-50"
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
