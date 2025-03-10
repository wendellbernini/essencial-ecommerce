import Image from "next/image";
import Link from "next/link";
import { Heart, Share2, Star, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductBySlug } from "@/lib/server-data";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-2xl font-bold text-gray-900">
            Produto não encontrado
          </h1>
          <p className="mt-4 text-gray-600">
            O produto que você está procurando não existe ou foi removido.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-orange-500 hover:text-orange-600"
          >
            ← Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  // Formatar preço para o formato brasileiro
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  // Verificar se o produto tem desconto
  const hasDiscount =
    product.sale_price !== null && product.sale_price < product.price;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galeria de Imagens */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className="aspect-square relative rounded-lg overflow-hidden border border-gray-200 hover:border-orange-500 transition-colors"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações do Produto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    (45 avaliações)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </div>

            <div className="border-t border-b border-gray-200 py-6">
              <div className="flex items-baseline space-x-2">
                {hasDiscount ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(product.sale_price!)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                      {Math.round(
                        ((product.price - product.sale_price!) /
                          product.price) *
                          100
                      )}
                      % OFF
                    </Badge>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="mt-4 flex items-center text-sm text-gray-600">
                <Truck className="h-4 w-4 mr-2" />
                Frete grátis para todo o Brasil
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex space-x-2">
                <Button className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700">
                  Adicionar ao carrinho
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-600 hover:text-orange-500 hover:bg-orange-50 border-gray-200"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">
                  Disponibilidade
                </h3>
                <p className="text-sm text-gray-600">
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} unidades em estoque`
                    : "Produto esgotado"}
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        </div>

        {/* Avaliações e Informações Adicionais */}
        <div className="mt-16">
          <Tabs defaultValue="reviews" className="w-full">
            <TabsList className="w-full justify-start border-b border-gray-200 bg-transparent">
              <TabsTrigger
                value="reviews"
                className="text-gray-600 hover:text-orange-500 data-[state=active]:text-orange-700 data-[state=active]:bg-orange-50"
              >
                Avaliações
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="text-gray-600 hover:text-orange-500 data-[state=active]:text-orange-700 data-[state=active]:bg-orange-50"
              >
                Detalhes do produto
              </TabsTrigger>
              <TabsTrigger
                value="shipping"
                className="text-gray-600 hover:text-orange-500 data-[state=active]:text-orange-700 data-[state=active]:bg-orange-50"
              >
                Envio e devoluções
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
