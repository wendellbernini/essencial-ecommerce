-- Criar função para verificar se é o webhook do Stripe
create or replace function is_stripe_webhook() returns boolean as $$
begin
  -- Verifica se a role atual é o service_role (usado pelo webhook)
  return current_user = 'service_role';
end;
$$ language plpgsql security definer;

-- Remover TODAS as políticas existentes
drop policy if exists "Usuários podem inserir seus próprios pedidos" on public.orders;
drop policy if exists "Webhook pode inserir pedidos" on public.orders;
drop policy if exists "Permitir service_role inserir pedidos" on public.orders;
drop policy if exists "Usuários podem ver seus próprios pedidos" on public.orders;

drop policy if exists "Usuários podem inserir itens nos seus próprios pedidos" on public.order_items;
drop policy if exists "Webhook pode inserir itens dos pedidos" on public.order_items;
drop policy if exists "Permitir service_role inserir itens dos pedidos" on public.order_items;
drop policy if exists "Usuários podem ver itens dos seus próprios pedidos" on public.order_items;

-- Criar novas políticas para pedidos
create policy "Permitir service_role inserir pedidos"
    on public.orders for insert
    with check (true);

create policy "Usuários podem ver seus próprios pedidos"
    on public.orders for select
    using (auth.uid() = user_id);

-- Criar novas políticas para itens dos pedidos
create policy "Permitir service_role inserir itens dos pedidos"
    on public.order_items for insert
    with check (true);

create policy "Usuários podem ver itens dos seus próprios pedidos"
    on public.order_items for select
    using (
        exists (
            select 1 from public.orders
            where orders.id = order_items.order_id
            and orders.user_id = auth.uid()
        )
    ); 