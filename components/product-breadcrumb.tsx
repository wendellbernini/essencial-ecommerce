import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface ProductBreadcrumbProps {
  category: {
    name: string;
    slug: string;
  };
  subcategory: {
    name: string;
    slug: string;
  };
  classifications?: Array<{
    id: number;
    name: string;
    slug: string;
    type: string;
  }>;
}

export function ProductBreadcrumb({
  category,
  subcategory,
  classifications,
}: ProductBreadcrumbProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500">
      <Link
        href={`/categoria/${category.slug}`}
        className="hover:text-orange-500 transition-colors"
      >
        {category.name}
      </Link>

      <ChevronRight className="h-4 w-4" />

      <Link
        href={`/categoria/${category.slug}/${subcategory.slug}`}
        className="hover:text-orange-500 transition-colors"
      >
        {subcategory.name}
      </Link>

      {classifications?.map((classification, index) => (
        <span key={classification.id} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/categoria/${category.slug}?filter=${classification.slug}`}
            className="hover:text-orange-500 transition-colors"
          >
            {classification.name}
          </Link>
        </span>
      ))}
    </nav>
  );
}
