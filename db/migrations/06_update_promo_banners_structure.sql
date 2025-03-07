-- Remove restrições not null de campos que não são mais obrigatórios
ALTER TABLE public.promo_banners
  ALTER COLUMN title DROP NOT NULL,
  ALTER COLUMN original_price DROP NOT NULL,
  ALTER COLUMN sale_price DROP NOT NULL;

-- Define valores padrão para campos que não são mais usados
UPDATE public.promo_banners
SET 
  title = 'Banner ' || id::text,
  description = NULL,
  original_price = 0,
  sale_price = 0
WHERE title IS NULL;

-- Primeiro remove a coluna que depende de original_price
ALTER TABLE public.promo_banners
  DROP COLUMN IF EXISTS discount_percentage;

-- Depois remove as outras colunas
ALTER TABLE public.promo_banners
  DROP COLUMN IF EXISTS description,
  DROP COLUMN IF EXISTS original_price,
  DROP COLUMN IF EXISTS sale_price; 