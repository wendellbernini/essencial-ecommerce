Schema do Banco de Dados Supabase
1. Tabela users
Descrição: Armazena informações dos usuários do sistema
Colunas:
id (uuid, PK): Identificador único do usuário, referencia auth.users(id)
full_name (text): Nome completo do usuário
phone (text): Número de telefone do usuário
avatar_url (text): URL da imagem de perfil do usuário
role (text): Função do usuário ('customer' ou 'admin')
created_at (timestamp with time zone): Data de criação do registro
updated_at (timestamp with time zone): Data de atualização do registro
2. Tabela categories
Descrição: Armazena as categorias de produtos
Colunas:
id (bigint, PK): Identificador único da categoria
created_at (timestamp with time zone): Data de criação do registro
name (text): Nome da categoria
slug (text): Slug para URL amigável
description (text): Descrição da categoria
image_url (text): URL da imagem da categoria
3. Tabela products
Descrição: Armazena informações dos produtos
Colunas:
id (bigint, PK): Identificador único do produto
created_at (timestamp with time zone): Data de criação do registro
name (text): Nome do produto
slug (text): Slug para URL amigável
description (text): Descrição do produto
price (numeric): Preço regular do produto
sale_price (numeric): Preço promocional (opcional)
category_id (bigint, FK): Referência à tabela categories
stock_quantity (integer): Quantidade em estoque
images (json): Array de URLs das imagens do produto
featured (boolean): Indica se o produto é destacado
updated_at (timestamp with time zone): Data de atualização do registro
is_new_release (boolean): Indica se é um lançamento
is_best_seller (boolean): Indica se é um mais vendido
4. Tabela addresses
Descrição: Armazena endereços dos usuários
Colunas:
id (uuid, PK): Identificador único do endereço
user_id (uuid, FK): Referência ao usuário proprietário
name (varchar): Nome do endereço (ex: "Casa", "Trabalho")
recipient (varchar): Nome do destinatário
zip_code (varchar): CEP
street (varchar): Nome da rua
number (varchar): Número
complement (varchar): Complemento (opcional)
neighborhood (varchar): Bairro
city (varchar): Cidade
state (varchar): Estado (UF)
is_default (boolean): Indica se é o endereço padrão
phone (varchar): Telefone de contato
created_at (timestamp with time zone): Data de criação
updated_at (timestamp with time zone): Data de atualização
5. Tabela promo_banners
Descrição: Armazena banners promocionais para a página inicial
Colunas:
id (integer, PK): Identificador único do banner
title (text): Título do banner (opcional)
image_url (text): URL da imagem do banner
link (text): Link para redirecionamento (opcional)
start_date (timestamp with time zone): Data de início da promoção
end_date (timestamp with time zone): Data de término da promoção
is_active (boolean): Indica se o banner está ativo
order_index (integer): Ordem de exibição
created_at (timestamp with time zone): Data de criação
updated_at (timestamp with time zone): Data de atualização
has_countdown (boolean): Indica se deve exibir contagem regressiva
Relações entre tabelas:
products.category_id → categories.id: Cada produto pertence a uma categoria
Políticas de Segurança (RLS):
Usuários podem ver, inserir, atualizar e deletar seus próprios endereços
Usuários podem ver seus próprios perfis e atualizá-los
Administradores podem ver e atualizar todos os perfis
Administradores têm acesso total aos produtos
Usuários autenticados e anônimos podem visualizar produtos
Este é o schema completo do banco de dados Supabase utilizado no projeto Essencial E-commerce. O banco está estruturado para suportar todas as funcionalidades planejadas, incluindo gerenciamento de produtos, categorias, usuários, endereços e banners promocionais.