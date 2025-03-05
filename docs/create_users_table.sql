-- Criação da tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Remover triggers e políticas existentes
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS sync_user_avatar_on_create ON users;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS sync_user_avatar();
DROP POLICY IF EXISTS "Users can view and edit their own data" ON users;

-- Adicionar nova coluna se não existir
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE users ADD COLUMN avatar_url TEXT;
  END IF;
END $$;

-- Criação da política de segurança RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para permitir que usuários vejam e editem apenas seus próprios dados
CREATE POLICY "Users can view and edit their own data" ON users
  FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger para atualizar o campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para copiar a foto do perfil do Google quando disponível
CREATE OR REPLACE FUNCTION sync_user_avatar()
RETURNS TRIGGER AS $$
BEGIN
  -- Se o usuário não tem avatar_url definido e tem uma foto do Google
  IF (NEW.avatar_url IS NULL AND NEW.raw_user_meta_data->>'avatar_url' IS NOT NULL) THEN
    NEW.avatar_url := NEW.raw_user_meta_data->>'avatar_url';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER sync_user_avatar_on_create
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_avatar(); 