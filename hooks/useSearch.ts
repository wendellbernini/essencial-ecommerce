import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "./useDebounce";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  images: string[];
  categories: {
    id: string;
    name: string;
    slug: string;
  };
}

interface UseSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: Product[];
  isLoading: boolean;
  error: string | null;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce a query para evitar muitas requisições
  const debouncedQuery = useDebounce(query, 300);

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao buscar produtos");
      }

      setResults(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar produtos");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    searchProducts(debouncedQuery);
  }, [debouncedQuery, searchProducts]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
}
