-- Garante que a coluna role existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'role'
  ) THEN
    ALTER TABLE public.users ADD COLUMN role text DEFAULT 'customer';
  END IF;
END $$;

-- Garante que o primeiro usuário seja admin
INSERT INTO public.users (id, role)
SELECT id, 'admin'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
LIMIT 1
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';

-- Atualiza as políticas da tabela users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Remove políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.users;

-- Recria as políticas
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can update all profiles" ON public.users
  FOR UPDATE
  USING (
    auth.jwt() ->> 'role' = 'admin'
  ); 