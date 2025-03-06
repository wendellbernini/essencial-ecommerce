-- Cria a tabela users
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  full_name text,
  phone text,
  avatar_url text,
  role text DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Cria função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Cria trigger para atualizar o updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Cria políticas de segurança
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Política para usuários autenticados lerem seus próprios dados
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Política para usuários autenticados atualizarem seus próprios dados
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Política para admins lerem todos os dados
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Política para admins atualizarem todos os dados
CREATE POLICY "Admins can update all profiles" ON public.users
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  ); 