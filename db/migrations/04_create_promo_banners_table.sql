-- Cria a tabela promo_banners
CREATE TABLE IF NOT EXISTS public.promo_banners (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  link TEXT,
  original_price DECIMAL(10,2) NOT NULL,
  sale_price DECIMAL(10,2) NOT NULL,
  discount_percentage INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN original_price > 0 
      THEN ROUND(((original_price - sale_price) / original_price * 100)::numeric)
      ELSE 0 
    END
  ) STORED,
  has_countdown BOOLEAN DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
-- Adiciona trigger para atualizar updated_at
CREATE TRIGGER update_promo_banners_updated_at
  BEFORE UPDATE ON public.promo_banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilita RLS
ALTER TABLE public.promo_banners ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Admins podem gerenciar banners" ON public.promo_banners
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Todos podem ver banners ativos" ON public.promo_banners
  FOR SELECT
  TO authenticated, anon
  USING (is_active = true);

-- Índices
CREATE INDEX idx_promo_banners_active_dates ON public.promo_banners (is_active, start_date, end_date);
CREATE INDEX idx_promo_banners_order ON public.promo_banners (order_index); 