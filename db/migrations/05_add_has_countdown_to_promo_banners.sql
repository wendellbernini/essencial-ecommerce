-- Adiciona a coluna has_countdown se ela não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'promo_banners' 
    AND column_name = 'has_countdown'
  ) THEN
    ALTER TABLE public.promo_banners ADD COLUMN has_countdown BOOLEAN DEFAULT false;
  END IF;
END $$; 