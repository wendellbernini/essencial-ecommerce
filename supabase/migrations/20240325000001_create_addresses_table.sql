-- Criar a tabela de endereços se ela não existir
create table if not exists public.addresses (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    name text not null,
    recipient text not null,
    zip_code text not null,
    street text not null,
    number text not null,
    complement text,
    neighborhood text not null,
    city text not null,
    state text not null,
    phone text,
    is_default boolean not null default false,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Habilitar RLS
alter table public.addresses enable row level security;

-- Criar políticas de segurança
create policy "Usuários podem ver seus próprios endereços"
    on public.addresses for select
    using (auth.uid() = user_id);

create policy "Usuários podem inserir seus próprios endereços"
    on public.addresses for insert
    with check (auth.uid() = user_id);

create policy "Usuários podem atualizar seus próprios endereços"
    on public.addresses for update
    using (auth.uid() = user_id);

create policy "Usuários podem deletar seus próprios endereços"
    on public.addresses for delete
    using (auth.uid() = user_id);

-- Criar função para atualizar o timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Criar trigger para atualizar o timestamp
create trigger handle_addresses_updated_at
    before update on public.addresses
    for each row
    execute function public.handle_updated_at(); 