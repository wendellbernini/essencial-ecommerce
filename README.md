# Essencial E-commerce

Um e-commerce completo focado em produtos cosméticos e de beleza, inspirado no design e na experiência do site da Etsy.

## 📋 Sobre o Projeto

O Essencial é uma plataforma de e-commerce dedicada a produtos cosméticos e de beleza, com foco em oferecer uma experiência de compra intuitiva e agradável. O projeto visa conectar vendedores independentes com consumidores que buscam produtos únicos e de qualidade.

## 🚀 Tecnologias Utilizadas

- **Next.js**: Framework React para renderização do lado do servidor
- **React com TypeScript**: Para desenvolvimento de interfaces com tipagem estática
- **TailwindCSS**: Para estilização rápida e responsiva
- **Supabase**: Banco de dados SQL para armazenamento de dados
- **Firebase Auth**: Para autenticação de usuários
- **Cloudinary**: Para gerenciamento de imagens
- **Vercel**: Para deploy contínuo e hospedagem

## ✨ Funcionalidades Planejadas

- Página inicial com banner de destaque e produtos em evidência
- Catálogo de produtos com categorias e filtros
- Páginas de detalhes de produtos com galeria de imagens
- Carrinho de compras com cálculo de frete
- Sistema de checkout e pagamento
- Autenticação e área do cliente
- Painel administrativo para gestão de produtos e pedidos

## 🛠️ Instalação e Uso

1. Clone o repositório:

```bash
git clone https://github.com/wendellbernini/essencial-ecommerce.git
cd essencial-ecommerce
```

2. Instale as dependências:

```bash
npm install
```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=sua_api_key_do_firebase
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_auth_domain_do_firebase
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_project_id_do_firebase

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name_do_cloudinary
CLOUDINARY_API_KEY=sua_api_key_do_cloudinary
CLOUDINARY_API_SECRET=seu_api_secret_do_cloudinary
```

4. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. Acesse o projeto em [http://localhost:3000](http://localhost:3000)

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request.

---

Desenvolvido com ❤️ por [Wendell Bernini](https://github.com/wendellbernini)
