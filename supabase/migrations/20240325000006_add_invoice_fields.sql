-- Adicionar campos de nota fiscal à tabela orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS invoice_url text,
ADD COLUMN IF NOT EXISTS invoice_number text,
ADD COLUMN IF NOT EXISTS invoice_key text,
ADD COLUMN IF NOT EXISTS invoice_status text,
ADD COLUMN IF NOT EXISTS invoice_issued_at timestamp with time zone;

-- Adicionar comentários aos campos
COMMENT ON COLUMN public.orders.invoice_url IS 'URL da nota fiscal';
COMMENT ON COLUMN public.orders.invoice_number IS 'Número da nota fiscal';
COMMENT ON COLUMN public.orders.invoice_key IS 'Chave da nota fiscal eletrônica';
COMMENT ON COLUMN public.orders.invoice_status IS 'Status da nota fiscal (pending, processing, issued)';
COMMENT ON COLUMN public.orders.invoice_issued_at IS 'Data de emissão da nota fiscal'; 