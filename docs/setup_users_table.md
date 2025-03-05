# Configuração da Tabela de Usuários no Supabase

Para configurar a tabela de usuários e suas políticas de segurança, siga os passos abaixo:

1. Acesse o [Supabase Studio](https://app.supabase.com)
2. Selecione seu projeto
3. Vá para a seção "SQL Editor"
4. Crie um novo script SQL
5. Cole o conteúdo do arquivo `docs/create_users_table.sql`
6. Execute o script

O script irá:

- Criar a tabela `users` com os campos necessários
- Configurar a chave primária referenciando a tabela `auth.users`
- Habilitar Row Level Security (RLS)
- Criar uma política que permite usuários verem e editarem apenas seus próprios dados
- Configurar um trigger para atualizar automaticamente o campo `updated_at`

## Estrutura da Tabela

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

## Campos

- `id`: UUID do usuário (referencia auth.users)
- `full_name`: Nome completo do usuário
- `phone`: Número de telefone
- `created_at`: Data de criação do registro
- `updated_at`: Data da última atualização

## Políticas de Segurança

O script configura uma política que permite que usuários:

- Vejam apenas seus próprios dados
- Editem apenas seus próprios dados

## Verificação

Após executar o script, você pode verificar se tudo foi configurado corretamente:

1. Na seção "Authentication > Users", crie um novo usuário ou use um existente
2. Na seção "Table Editor", verifique se a tabela `users` foi criada
3. Tente inserir um registro manualmente para o usuário criado
4. Verifique se as políticas de RLS estão funcionando corretamente

## Troubleshooting

Se encontrar algum erro:

1. Verifique se não há tabela `users` já existente
2. Confirme se o usuário do Supabase tem permissões suficientes
3. Verifique se a tabela `auth.users` existe e está acessível
