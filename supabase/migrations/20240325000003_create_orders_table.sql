-- Criar enum para status do pedido
create type order_status as enum (
  'pending', -- Aguardando pagamento
  'processing', -- Pagamento confirmado, em processamento
  'shipped', -- Enviado
  'delivered', -- Entregue
  'cancelled' -- Cancelado
);

-- Criar tabela de pedidos
create table if not exists public.orders (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    status order_status not null default 'pending',
    total_amount integer not null, -- em centavos
    shipping_address jsonb not null,
    stripe_session_id text,
    stripe_payment_intent_id text,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Criar tabela de itens do pedido
create table if not exists public.order_items (
    id uuid not null default uuid_generate_v4() primary key,
    order_id uuid not null references public.orders(id) on delete cascade,
    product_id bigint not null references public.products(id) on delete restrict,
    quantity integer not null check (quantity > 0),
    unit_price integer not null, -- em centavos
    total_price integer not null, -- em centavos
    product_data jsonb not null, -- snapshot dos dados do produto no momento da compra
    created_at timestamp with time zone not null default now()
);

-- Habilitar RLS
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Criar função para verificar se é o webhook do Stripe
create or replace function is_stripe_webhook() returns boolean as $$
begin
  -- Verifica se a role atual é o service_role (usado pelo webhook)
  return current_user = 'service_role';
end;
$$ language plpgsql security definer;

-- Criar políticas de segurança para pedidos
create policy "Usuários podem ver seus próprios pedidos"
    on public.orders for select
    using (auth.uid() = user_id);

create policy "Webhook pode inserir pedidos"
    on public.orders for insert
    with check (is_stripe_webhook() or auth.uid() = user_id);

-- Criar políticas de segurança para itens dos pedidos
create policy "Usuários podem ver itens dos seus próprios pedidos"
    on public.order_items for select
    using (
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    );

create policy "Webhook pode inserir itens dos pedidos"
    on public.order_items for insert
    with check (
        is_stripe_webhook() or
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    );

-- Criar função para atualizar o timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Criar trigger para atualizar o timestamp
create trigger handle_orders_updated_at
    before update on public.orders
    for each row
    execute function public.handle_updated_at(); 