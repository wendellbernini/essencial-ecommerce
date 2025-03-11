import { getProductBySlug } from "@/lib/server-data";
import { ProductDetails } from "./product-details";
import Link from "next/link";

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

  return <ProductDetails product={product} />;
}
