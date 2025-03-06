-- Habilita RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Remove políticas existentes
DROP POLICY IF EXISTS "Admins têm acesso total" ON public.products;
DROP POLICY IF EXISTS "Usuários podem ver produtos" ON public.products;

-- Política para admins terem acesso total
CREATE POLICY "Admins têm acesso total" ON public.products
  FOR ALL
  USING (
    auth.jwt() ->> 'role' = 'admin'
  )
  WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Política para usuários lerem produtos
CREATE POLICY "Usuários podem ver produtos" ON public.products
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Remove trigger existente
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;

-- Função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para atualizar o updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 