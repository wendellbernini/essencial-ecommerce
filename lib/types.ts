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
