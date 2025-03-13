-- Create cart_items table
create table if not exists public.cart_items (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid not null references auth.users(id) on delete cascade,
    product_id bigint not null references public.products(id) on delete cascade,
    quantity integer not null check (quantity > 0),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    -- Garante que um usuário não pode ter o mesmo produto mais de uma vez no carrinho
    unique(user_id, product_id)
);

-- Enable RLS
alter table public.cart_items enable row level security;

-- Create policies
create policy "Users can view their own cart items"
    on public.cart_items for select
    using (auth.uid() = user_id);

create policy "Users can insert their own cart items"
    on public.cart_items for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own cart items"
    on public.cart_items for update
    using (auth.uid() = user_id);

create policy "Users can delete their own cart items"
    on public.cart_items for delete
    using (auth.uid() = user_id);

-- Create function to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger handle_cart_items_updated_at
    before update on public.cart_items
    for each row
    execute function public.handle_updated_at(); 