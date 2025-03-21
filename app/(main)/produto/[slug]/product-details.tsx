"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Share2, Star, Truck } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ProductBreadcrumb } from "@/components/product-breadcrumb";
import { ProductImageZoom } from "@/components/product-image-zoom";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/contexts/cart-context";
import Reviews from "./reviews";
import { Product, ReviewWithUser } from "@/lib/types";
import { ShippingCalculator } from "@/components/shipping/shipping-calculator";

interface ProductDetailsProps {
  product: Product;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const supabase = createClientComponentClient();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem, toggleCart } = useCart();

  useEffect(() => {
    const loadReviews = async () => {
      try {
        console.log(
          "Iniciando carregamento de reviews para produto:",
          product.id
        );
        // Buscar as reviews do produto
        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", product.id)
          .order("created_at", { ascending: false });

        if (reviewsError) {
          console.error("Erro ao buscar reviews:", reviewsError);
          return;
        }

        if (!reviewsData) {
          console.log("Nenhuma review encontrada");
          setReviews([]);
          setAverageRating(0);
          setTotalReviews(0);
          return;
        }

        console.log("Reviews encontradas:", reviewsData);

        // Processar cada review para incluir dados do usuário
        const processedReviews = await Promise.all(
          reviewsData.map(async (review) => {
            // Buscar dados do usuário para cada review
            const { data: userData } = await supabase
              .from("users")
              .select("full_name, avatar_url")
              .eq("id", review.user_id)
              .single();

            return {
              ...review,
              user: {
                name: userData?.full_name || "Usuário anônimo",
                avatar_url: userData?.avatar_url,
              },
            };
          })
        );

        console.log("Reviews processadas:", processedReviews);

        // Atualiza o estado com as reviews processadas
        setReviews(processedReviews || []);

        // Calcula a média das avaliações
        const total = processedReviews.length;
        const sum = processedReviews.reduce(
          (acc, review) => acc + review.rating,
          0
        );
        setAverageRating(total > 0 ? sum / total : 0);
        setTotalReviews(total);
      } catch (error) {
        console.error("Erro ao carregar avaliações:", error);
        // Em caso de erro, limpa o estado
        setReviews([]);
        setAverageRating(0);
        setTotalReviews(0);
      }
    };

    loadReviews();
  }, [product.id, supabase]);

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

  const handleAddToCart = () => {
    addItem({
      id: crypto.randomUUID(),
      product_id: String(product.id),
      name: product.name,
      price: product.price,
      sale_price: product.sale_price || undefined,
      quantity: quantity,
      image_url: product.images[0],
    });
    toggleCart();
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
            <ProductImageZoom
              src={product.images[currentImageIndex]}
              alt={`${product.name} - Imagem ${currentImageIndex + 1}`}
              priority
            />
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
                      className={`w-4 h-4 ${
                        i < Math.round(averageRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({totalReviews} avaliações)
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
                <Button
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                >
                  {product.stock_quantity === 0
                    ? "Produto esgotado"
                    : "Adicionar ao carrinho"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-gray-600 hover:text-orange-500 hover:bg-orange-50 border-gray-200"
                  onClick={() => toggleWishlist(product.id)}
                >
                  <Heart
                    className={cn(
                      "h-5 w-5",
                      isInWishlist(product.id)
                        ? "fill-orange-500 text-orange-500"
                        : "text-gray-600"
                    )}
                  />
                </Button>
              </div>

              {/* Calculador de Frete */}
              <ShippingCalculator
                weight={product.weight || 300} // Peso padrão de 300g se não especificado
                length={product.length || 16} // Dimensões padrão de uma caixa pequena
                height={product.height || 12}
                width={product.width || 12}
                originZipCode="01153000" // CEP de origem padrão
              />

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

            <TabsContent value="reviews" className="pt-6">
              <Reviews
                productId={product.id}
                initialReviews={reviews}
                averageRating={averageRating}
                totalReviews={totalReviews}
              />
            </TabsContent>

            <TabsContent value="details" className="pt-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-medium mb-4">
                  Especificações do Produto
                </h3>
                <table className="w-full">
                  <tbody>
                    <tr className="border-t">
                      <td className="py-2 text-sm font-medium text-gray-900">
                        Marca
                      </td>
                      <td className="py-2 text-sm text-gray-600">
                        {product.brand?.name}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-2 text-sm font-medium text-gray-900">
                        Categoria
                      </td>
                      <td className="py-2 text-sm text-gray-600">
                        {product.categories?.name}
                      </td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-2 text-sm font-medium text-gray-900">
                        Subcategoria
                      </td>
                      <td className="py-2 text-sm text-gray-600">
                        {product.subcategories?.name}
                      </td>
                    </tr>
                    {product.classifications?.map((classification) => (
                      <tr key={classification.id} className="border-t">
                        <td className="py-2 text-sm font-medium text-gray-900">
                          {classification.type}
                        </td>
                        <td className="py-2 text-sm text-gray-600">
                          {classification.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="pt-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-medium mb-4">
                  Informações de Envio
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Prazo de Entrega
                    </h4>
                    <p className="text-gray-600">
                      O prazo médio de entrega é de 3 a 7 dias úteis para todo o
                      Brasil. Entregas para regiões mais distantes podem levar
                      até 12 dias úteis.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Política de Devolução
                    </h4>
                    <p className="text-gray-600">
                      Você tem até 7 dias após o recebimento do produto para
                      solicitar a devolução. O produto deve estar em perfeito
                      estado, na embalagem original e com todos os acessórios.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Frete Grátis</h4>
                    <p className="text-gray-600">
                      Oferecemos frete grátis para todo o Brasil em compras
                      acima de R$ 99,00. Promoção por tempo limitado.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
