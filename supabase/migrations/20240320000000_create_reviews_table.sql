-- Remover políticas existentes
drop policy if exists "Qualquer um pode ler reviews" on public.reviews;
drop policy if exists "Usuários autenticados podem criar reviews" on public.reviews;
drop policy if exists "Usuários podem atualizar seus próprios reviews" on public.reviews;
drop policy if exists "Usuários podem deletar seus próprios reviews" on public.reviews;
drop policy if exists "Usuários e admins podem deletar reviews" on public.reviews;

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

-- Política para deleção: usuário pode deletar seus próprios reviews ou admin pode deletar qualquer review
create policy "Usuários e admins podem deletar reviews"
  on public.reviews for delete
  using (
    auth.uid() = user_id OR 
    exists (
      select 1 from public.users 
      where id = auth.uid() 
      and is_admin = true
    )
  );

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
  is_admin boolean not null default false,
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

-- Criar tabela de votos úteis
create table if not exists public.review_helpful_votes (
    id uuid default gen_random_uuid() primary key,
    review_id bigint references public.reviews(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(review_id, user_id)
);

-- Habilitar RLS
alter table public.review_helpful_votes enable row level security;

-- Políticas de acesso para votos úteis
create policy "Usuários podem ver votos úteis"
on public.review_helpful_votes for select
using (true);

create policy "Usuários podem votar uma vez por review"
on public.review_helpful_votes for insert
to authenticated
with check (
    not exists (
        select 1 from public.review_helpful_votes rhv
        where rhv.review_id = review_helpful_votes.review_id
        and rhv.user_id = auth.uid()
    )
    or exists (
        select 1 from public.users
        where id = auth.uid()
        and is_admin = true
    )
);

-- Função para incrementar o contador de votos úteis
create or replace function public.increment_helpful_count(review_id_param bigint)
returns void
language plpgsql
security definer
as $$
begin
    update public.reviews
    set helpful_count = coalesce(helpful_count, 0) + 1
    where id = review_id_param;
end;
$$; 