-- Adiciona campos de dimensões e peso à tabela de produtos
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS weight INTEGER DEFAULT 300, -- Peso em gramas
ADD COLUMN IF NOT EXISTS length INTEGER DEFAULT 16, -- Comprimento em cm
ADD COLUMN IF NOT EXISTS height INTEGER DEFAULT 12, -- Altura em cm
ADD COLUMN IF NOT EXISTS width INTEGER DEFAULT 12; -- Largura em cm

-- Adiciona comentários aos campos
COMMENT ON COLUMN public.products.weight IS 'Peso do produto em gramas';
COMMENT ON COLUMN public.products.length IS 'Comprimento do produto em centímetros';
COMMENT ON COLUMN public.products.height IS 'Altura do produto em centímetros';
COMMENT ON COLUMN public.products.width IS 'Largura do produto em centímetros'; 