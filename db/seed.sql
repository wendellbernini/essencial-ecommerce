-- Primeiro: Limpar as tabelas existentes
DELETE FROM public.products;
DELETE FROM public.categories;

-- Resetar as sequências de ID
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
ALTER SEQUENCE products_id_seq RESTART WITH 1;

-- Inserir categorias
INSERT INTO public.categories (name, slug, description, image_url, created_at) 
VALUES ('Skincare', 'skincare', 'Produtos para cuidados com a pele', 'https://source.unsplash.com/random/400x400/?skincare', NOW());

INSERT INTO public.categories (name, slug, description, image_url, created_at) 
VALUES ('Maquiagem', 'maquiagem', 'Produtos de maquiagem e beleza', 'https://source.unsplash.com/random/400x400/?makeup', NOW());

INSERT INTO public.categories (name, slug, description, image_url, created_at) 
VALUES ('Cabelos', 'cabelos', 'Produtos para cuidados com os cabelos', 'https://source.unsplash.com/random/400x400/?haircare', NOW());

INSERT INTO public.categories (name, slug, description, image_url, created_at) 
VALUES ('Perfumes', 'perfumes', 'Fragrâncias e perfumes', 'https://source.unsplash.com/random/400x400/?perfume', NOW());

INSERT INTO public.categories (name, slug, description, image_url, created_at) 
VALUES ('Corpo & Banho', 'corpo-e-banho', 'Produtos para cuidados corporais', 'https://source.unsplash.com/random/400x400/?bodycare', NOW());

INSERT INTO public.categories (name, slug, description, image_url, created_at) 
VALUES ('Unhas', 'unhas', 'Produtos para cuidados com as unhas', 'https://source.unsplash.com/random/400x400/?nailcare', NOW());

-- Aguardar um momento para garantir que as categorias foram inseridas
SELECT pg_sleep(1);

-- Inserir produtos
INSERT INTO public.products (
    name, 
    slug, 
    description, 
    price, 
    sale_price,
    category_id, 
    stock_quantity, 
    images, 
    featured,
    created_at,
    updated_at
) VALUES
('Sérum Facial Vitamina C', 'serum-facial-vitamina-c', 'Sérum facial com vitamina C para iluminação e uniformização da pele', 129.90, NULL, 1, 50, '["https://source.unsplash.com/random/400x400/?serum"]'::jsonb, true, NOW(), NOW()),
('Paleta de Sombras Nude', 'paleta-sombras-nude', 'Paleta com 12 cores neutras para looks naturais', 89.90, NULL, 2, 30, '["https://source.unsplash.com/random/400x400/?eyeshadow"]'::jsonb, true, NOW(), NOW()),
('Shampoo Hidratante', 'shampoo-hidratante', 'Shampoo para hidratação profunda dos fios', 45.90, NULL, 3, 100, '["https://source.unsplash.com/random/400x400/?shampoo"]'::jsonb, false, NOW(), NOW()),
('Perfume Floral', 'perfume-floral', 'Fragrância floral com notas de jasmim e rosa', 199.90, 179.90, 4, 20, '["https://source.unsplash.com/random/400x400/?perfume-bottle"]'::jsonb, true, NOW(), NOW()),
('Hidratante Corporal', 'hidratante-corporal', 'Hidratante corporal com manteiga de karité', 59.90, NULL, 5, 80, '["https://source.unsplash.com/random/400x400/?body-lotion"]'::jsonb, false, NOW(), NOW()),
('Esmalte Gel', 'esmalte-gel', 'Esmalte em gel de longa duração', 24.90, 19.90, 6, 60, '["https://source.unsplash.com/random/400x400/?nail-polish"]'::jsonb, false, NOW(), NOW()); 