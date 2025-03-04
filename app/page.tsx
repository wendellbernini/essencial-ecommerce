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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Barra de anúncio superior */}
      <div className="bg-[#FDEBD2] text-[#222222] py-2 px-4 text-center text-sm">
        <p>
          Aproveite até 30% de desconto! Confira nossas ofertas especiais hoje.
        </p>
      </div>

      {/* Cabeçalho */}
      <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Botão de menu mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/placeholder.svg?height=40&width=90"
                alt="Essencial"
                width={90}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Barra de busca */}
            <div className="hidden md:flex flex-1 mx-6 relative">
              <Input
                type="search"
                placeholder="Buscar por produtos"
                className="w-full rounded-full border-gray-300 pl-4 pr-10 py-2 focus:ring-orange-500 focus:border-orange-500"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Navegação do usuário */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="hidden md:flex">
                <User className="h-5 w-5 mr-1" />
                <span>Entrar</span>
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Busca mobile - exibida apenas em dispositivos móveis */}
          <div className="mt-3 relative md:hidden">
            <Input
              type="search"
              placeholder="Buscar por produtos"
              className="w-full rounded-full border-gray-300 pl-4 pr-10 py-2"
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Navegação de categorias */}
          <nav className="hidden md:flex items-center justify-between mt-4 text-sm">
            <ul className="flex space-x-6">
              {[
                "Casa & Decoração",
                "Roupas & Calçados",
                "Joias & Acessórios",
                "Materiais para Artesanato",
                "Casamento & Festas",
                "Brinquedos & Entretenimento",
                "Arte & Colecionáveis",
                "Vintage",
              ].map((category) => (
                <li key={category}>
                  <Link
                    href="#"
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

      <main>
        {/* Seção principal */}
        <section className="relative bg-[#FDEBD2] py-10">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Encontre coisas que você vai amar. Apoie vendedores
                independentes. Só na Essencial.
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                Descobertas diárias de pequenos negócios criativos.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Decoração
                </Button>
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Joias
                </Button>
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Roupas
                </Button>
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Presentes
                </Button>
                <Button className="bg-white text-gray-800 hover:bg-gray-100 border border-gray-300">
                  Casamento
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categorias populares */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Categorias populares
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                {
                  name: "Decoração",
                  image: "/placeholder.svg?height=150&width=150",
                },
                {
                  name: "Joias",
                  image: "/placeholder.svg?height=150&width=150",
                },
                {
                  name: "Roupas",
                  image: "/placeholder.svg?height=150&width=150",
                },
                {
                  name: "Acessórios",
                  image: "/placeholder.svg?height=150&width=150",
                },
                {
                  name: "Arte",
                  image: "/placeholder.svg?height=150&width=150",
                },
                {
                  name: "Materiais para Artesanato",
                  image: "/placeholder.svg?height=150&width=150",
                },
              ].map((category) => (
                <Link
                  href="#"
                  key={category.name}
                  className="text-center group"
                >
                  <div className="rounded-full overflow-hidden mb-3 mx-auto w-24 h-24 md:w-32 md:h-32">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-gray-800">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Produtos em destaque */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Nossas escolhas para você</h2>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="under25">Até R$125</TabsTrigger>
                  <TabsTrigger value="under50">Até R$250</TabsTrigger>
                  <TabsTrigger value="under100">Até R$500</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="group">
                  <div className="relative mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=200&width=200&text=Produto${
                        i + 1
                      }`}
                      alt={`Produto ${i + 1}`}
                      width={200}
                      height={200}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                    {i % 3 === 0 && (
                      <Badge className="absolute bottom-2 left-2 bg-orange-500">
                        Mais vendido
                      </Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                      Produto artesanal com design exclusivo
                    </h3>
                    <div className="flex items-center mt-1 mb-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className="w-3 h-3 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">(45)</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-medium">
                        R${(75 + i * 25).toFixed(2)}
                      </p>
                      {i % 4 === 0 && (
                        <Badge
                          variant="outline"
                          className="text-green-600 border-green-600"
                        >
                          Frete grátis
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vistos recentemente */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Vistos recentemente</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="group">
                  <div className="relative mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=150&width=150&text=Recente${
                        i + 1
                      }`}
                      alt={`Produto Recente ${i + 1}`}
                      width={150}
                      height={150}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                    Item artesanal
                  </h3>
                  <p className="font-medium text-sm">
                    R${(50 + i * 17.5).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Escolhas do editor */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Escolhas do editor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <Image
                    src={`/placeholder.svg?height=300&width=400&text=Coleção${
                      i + 1
                    }`}
                    alt={`Coleção ${i + 1}`}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-2">
                      Coleção Selecionada {i + 1}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Descubra nossa seleção especial de itens únicos feitos por
                      criadores independentes.
                    </p>
                    <Button variant="outline" className="w-full">
                      Comprar agora
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-white border-t border-gray-200 pt-12 pb-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-bold text-lg mb-4">Comprar</h3>
              <ul className="space-y-2">
                {[
                  "Cartões de presente",
                  "Blog Essencial",
                  "Mapa do site",
                  "Essencial Brasil",
                  "Essencial Portugal",
                  "Essencial Internacional",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-orange-500 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Vender</h3>
              <ul className="space-y-2">
                {[
                  "Venda na Essencial",
                  "Equipes",
                  "Fóruns",
                  "Afiliados & Criadores",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-orange-500 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Sobre</h3>
              <ul className="space-y-2">
                {[
                  "Essencial, Inc.",
                  "Políticas",
                  "Investidores",
                  "Carreiras",
                  "Imprensa",
                  "Impacto",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-orange-500 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Ajuda</h3>
              <ul className="space-y-2">
                {[
                  "Central de Ajuda",
                  "Configurações de Privacidade",
                  "Fale Conosco",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-orange-500 text-sm"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <h4 className="font-bold text-sm mb-2">
                  Baixe o aplicativo Essencial
                </h4>
                <div className="flex space-x-2">
                  <Link href="#">
                    <Image
                      src="/placeholder.svg?height=40&width=120&text=App+Store"
                      alt="Baixe na App Store"
                      width={120}
                      height={40}
                      className="h-10"
                    />
                  </Link>
                  <Link href="#">
                    <Image
                      src="/placeholder.svg?height=40&width=120&text=Google+Play"
                      alt="Disponível no Google Play"
                      width={120}
                      height={40}
                      className="h-10"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/placeholder.svg?height=30&width=80&text=Essencial"
                alt="Essencial"
                width={80}
                height={30}
                className="h-8 w-auto mr-4"
              />
              <p className="text-sm text-gray-500">© 2023 Essencial, Inc.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-600 hover:text-orange-500">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-500">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-500">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-600 hover:text-orange-500">
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
