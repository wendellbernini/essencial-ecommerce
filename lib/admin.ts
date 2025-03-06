import { createServerSupabaseClient } from "@/lib/supabase";
import { Category, Product } from "@/lib/supabase";

// Tipos
export type DashboardStats = {
  totalSales: number;
  newCustomers: number;
  totalOrders: number;
  activeProducts: number;
};

export type SalesByMonth = {
  month: string;
  total: number;
};

export type RecentSale = {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  amount: number;
  created_at: string;
};

// Funções
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServerSupabaseClient();

  // TODO: Implementar queries reais quando tivermos as tabelas
  return {
    totalSales: 45231.89,
    newCustomers: 2350,
    totalOrders: 12234,
    activeProducts: 573,
  };
}

export async function getSalesByMonth(): Promise<SalesByMonth[]> {
  const supabase = createServerSupabaseClient();

  // TODO: Implementar query real quando tivermos a tabela de vendas
  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return months.map((month) => ({
    month,
    total: Math.floor(Math.random() * 5000) + 1000,
  }));
}

export async function getRecentSales(): Promise<RecentSale[]> {
  const supabase = createServerSupabaseClient();

  // TODO: Implementar query real quando tivermos a tabela de vendas
  return [
    {
      id: "1",
      customer: {
        name: "Maria Aparecida",
        email: "maria.ap@gmail.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Maria`,
      },
      amount: 1999.0,
      created_at: new Date().toISOString(),
    },
    {
      id: "2",
      customer: {
        name: "João Carlos",
        email: "joao.carlos@email.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Joao`,
      },
      amount: 399.0,
      created_at: new Date().toISOString(),
    },
    {
      id: "3",
      customer: {
        name: "Ana Silva",
        email: "ana.silva@hotmail.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Ana`,
      },
      amount: 799.0,
      created_at: new Date().toISOString(),
    },
    {
      id: "4",
      customer: {
        name: "Pedro Oliveira",
        email: "pedro.oli@gmail.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro`,
      },
      amount: 2499.0,
      created_at: new Date().toISOString(),
    },
    {
      id: "5",
      customer: {
        name: "Lucia Santos",
        email: "lucia.santos@uol.com.br",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=Lucia`,
      },
      amount: 899.0,
      created_at: new Date().toISOString(),
    },
  ];
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar produtos:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error("Erro ao buscar categorias:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return [];
  }
}
