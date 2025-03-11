-- Remover políticas existentes
drop policy if exists "Qualquer um pode ler reviews" on public.reviews;
drop policy if exists "Usuários autenticados podem criar reviews" on public.reviews;
drop policy if exists "Usuários podem atualizar seus próprios reviews" on public.reviews;
drop policy if exists "Usuários podem deletar seus próprios reviews" on public.reviews;

create table if not exists public.reviews (
  id bigint primary key generated always as identity,
  product_id bigint not null,
  user_id uuid not null references auth.users(id),
  rating smallint not null check (rating between 1 and 5),
  title text not null,
  comment text not null,
  created_at timestamptz not null default now(),
  helpful_count integer not null default 0,
  reported_count integer not null default 0,
  is_verified_purchase boolean not null default false,
  
  constraint fk_product
    foreign key (product_id)
    references public.products(id)
    on delete cascade
);

-- Criar índices para melhorar performance
create index if not exists reviews_product_id_idx on public.reviews(product_id);
create index if not exists reviews_user_id_idx on public.reviews(user_id);
create index if not exists reviews_created_at_idx on public.reviews(created_at desc);

-- Criar políticas de segurança RLS
alter table public.reviews enable row level security;

-- Política para leitura: qualquer um pode ler reviews
create policy "Qualquer um pode ler reviews"
  on public.reviews for select
  using (true);

-- Política para inserção: usuário autenticado pode criar review
create policy "Usuários autenticados podem criar reviews"
  on public.reviews for insert
  with check (auth.uid() = user_id);

-- Política para atualização: usuário só pode atualizar seus próprios reviews
create policy "Usuários podem atualizar seus próprios reviews"
  on public.reviews for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Política para deleção: usuário só pode deletar seus próprios reviews
create policy "Usuários podem deletar seus próprios reviews"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- Criar função para calcular média das avaliações
create or replace function get_product_rating(product_id_param bigint)
returns table (
  average_rating numeric,
  total_reviews bigint
) as $$
begin
  return query
  select
    coalesce(avg(rating)::numeric, 0) as average_rating,
    count(*)::bigint as total_reviews
  from public.reviews
  where product_id = product_id_param;
end;
$$ language plpgsql security definer;

-- Remover políticas existentes da tabela users
drop policy if exists "Qualquer um pode ler dados básicos dos usuários" on public.users;
drop policy if exists "Usuários podem atualizar seus próprios dados" on public.users;

-- Criar tabela de usuários no schema public
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Criar função para sincronizar dados do usuário
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, full_name, avatar_url, created_at, updated_at)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url',
    new.created_at,
    new.updated_at
  );
  return new;
end;
$$;

-- Criar trigger para executar a função quando um novo usuário for criado
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Criar políticas de segurança RLS para a tabela users
alter table public.users enable row level security;

-- Política para leitura: qualquer um pode ler dados básicos dos usuários
create policy "Qualquer um pode ler dados básicos dos usuários"
  on public.users for select
  using (true);

-- Política para atualização: usuário só pode atualizar seus próprios dados
create policy "Usuários podem atualizar seus próprios dados"
  on public.users for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Inserir usuários existentes na tabela public.users
insert into public.users (id, full_name, avatar_url, created_at, updated_at)
select 
  id,
  raw_user_meta_data->>'name' as full_name,
  raw_user_meta_data->>'avatar_url' as avatar_url,
  created_at,
  updated_at
from auth.users
on conflict (id) do nothing; 