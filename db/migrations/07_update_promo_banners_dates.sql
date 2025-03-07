-- Permite valores nulos nas colunas de data
ALTER TABLE public.promo_banners
  ALTER COLUMN start_date DROP NOT NULL,
  ALTER COLUMN end_date DROP NOT NULL; 