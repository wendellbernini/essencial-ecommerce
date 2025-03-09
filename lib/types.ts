export interface PromoBanner {
  id: number;
  image_url: string;
  link: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  has_countdown: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
  title?: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price: number | null;
  images: string[];
  category_id: number;
  stock_quantity: number;
  featured: boolean;
  is_new_release: boolean;
  created_at: string;
  updated_at: string;
  rating?: number;
  reviews_count?: number;
  categories?: {
    name: string;
    slug: string;
  };
}

export interface SecondaryBanner {
  id: number;
  image_url: string;
  link: string | null;
  title: string | null;
  type: "double" | "carousel";
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
