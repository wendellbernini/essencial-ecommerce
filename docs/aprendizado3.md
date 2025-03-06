# Estado Atual do Projeto - Aprendizado 3

## Reorganização de Layouts e Correção de Problemas de Hidratação

Acabamos de resolver um problema crítico relacionado à estrutura de layouts do Next.js, onde a página de login estava exibindo indevidamente o header e footer globais. A solução envolveu uma reorganização significativa da estrutura de pastas do projeto, implementando o conceito de Route Groups do Next.js. Criamos dois grupos principais: `(main)` para páginas que precisam de header/footer e `(auth)` para páginas de autenticação. O layout raiz (`app/layout.tsx`) foi simplificado para conter apenas a estrutura HTML básica e o CartProvider, enquanto um novo layout específico (`app/(main)/layout.tsx`) foi criado para gerenciar os componentes globais de navegação.

## Arquivos Atualizados e Mudanças Estruturais

Principais alterações:

- `app/layout.tsx`: Simplificado para conter apenas estrutura HTML básica e CartProvider
- `app/(main)/layout.tsx`: Novo arquivo para gerenciar header, footer e banner
- `app/(auth)/login/layout.tsx`: Corrigido path de importação do globals.css
- `app/(auth)/login/page.tsx`: Atualizado path de importação do AuthForm
- Movimentação de arquivos:
  - `app/login` → `app/(auth)/login`
  - `app/page.tsx` → `app/(main)/page.tsx`
  - `app/categoria` → `app/(main)/categoria`
  - `app/produto` → `app/(main)/produto`
  - `app/perfil` → `app/(main)/perfil`
  - `app/busca` → `app/(main)/busca`

## Lições Aprendidas e Pontos de Atenção

Insights importantes:

1. Ao usar Route Groups no Next.js, é crucial manter os caminhos de importação atualizados usando aliases (`@/`) em vez de caminhos relativos
2. O layout raiz deve ser o mais simples possível, delegando responsabilidades específicas para layouts intermediários
3. O uso de `suppressHydrationWarning` no html e body ajuda a evitar warnings de hidratação
4. Grupos de rotas (`(main)` e `(auth)`) permitem melhor organização e controle de layouts sem afetar a URL final
5. Ao mover arquivos entre pastas, sempre verificar e atualizar:
   - Importações de CSS globais
   - Caminhos de componentes
   - Referências a arquivos estáticos
   - Configurações de metadados

Estado atual: O projeto está funcionando corretamente com a página de login isolada do layout principal, evitando a duplicação de elementos HTML e problemas de hidratação. A estrutura atual facilita a adição de novas páginas de autenticação (registro, recuperação de senha) mantendo a consistência do layout.
