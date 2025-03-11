"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Share2, Star, Truck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductBreadcrumb } from "@/components/product-breadcrumb";
import { Product } from "@/lib/types";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

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

  const handleQuantityChange = (value: number) => {
    // Garante que a quantidade não seja menor que 1 ou maior que o estoque
    const newQuantity = Math.max(1, Math.min(value, product.stock_quantity));
    setQuantity(newQuantity);
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        {product.categories && product.subcategories && (
          <div className="mb-4">
            <ProductBreadcrumb
              category={product.categories}
              subcategory={product.subcategories}
              classifications={product.classifications}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Galeria de Imagens */}
          <div className="space-y-3">
            <div className="aspect-[4/3] relative rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={product.images[currentImageIndex]}
                alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square relative rounded-lg overflow-hidden border transition-colors ${
                      currentImageIndex === index
                        ? "border-orange-500"
                        : "border-gray-200 hover:border-orange-500"
                    }`}
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
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
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

            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-baseline space-x-2">
                {hasDiscount ? (
                  <>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatPrice(product.sale_price!)}
                    </span>
                    <span className="text-base text-gray-500 line-through">
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
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center text-sm text-gray-600">
                <Truck className="h-4 w-4 mr-2" />
                Frete grátis para todo o Brasil
              </div>
            </div>

            <div className="space-y-3">
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

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 mb-1">
                    Disponibilidade
                  </h3>
                  <p className="text-sm text-gray-600">
                    {product.stock_quantity > 0
                      ? `${product.stock_quantity} unidades em estoque`
                      : "Produto esgotado"}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <h3 className="font-medium text-gray-900 mb-1">Quantidade</h3>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 text-lg font-medium"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock_quantity}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value) || 1)
                      }
                      className="w-24 h-9 text-center border rounded-md text-base font-medium"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 text-lg font-medium"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock_quantity}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-lg font-bold mb-3" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2 className="text-base font-bold mb-2" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3 className="text-sm font-bold mb-2" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-3 text-sm" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc list-inside mb-3 text-sm"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal list-inside mb-3 text-sm"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-bold text-gray-900" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-orange-500 hover:text-orange-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                  }}
                >
                  {product.description || ""}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Avaliações e Informações Adicionais */}
        <div className="mt-12">
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
