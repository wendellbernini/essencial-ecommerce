-- Adicionar campos de rastreamento à tabela de pedidos
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS tracking_code text,
ADD COLUMN IF NOT EXISTS estimated_delivery timestamp with time zone,
ADD COLUMN IF NOT EXISTS status_history jsonb[] DEFAULT '{}';

-- Adicionar comentários aos campos
COMMENT ON COLUMN public.orders.tracking_code IS 'Código de rastreamento do pedido';
COMMENT ON COLUMN public.orders.estimated_delivery IS 'Data estimada de entrega';
COMMENT ON COLUMN public.orders.status_history IS 'Histórico de status do pedido com timestamps'; 