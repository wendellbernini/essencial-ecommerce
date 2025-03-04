# Guia de Estilo - Essencial E-commerce

Este documento serve como referência para o padrão visual a ser seguido em todas as páginas do Essencial E-commerce, garantindo consistência e coesão em toda a plataforma.

## 🎨 Paleta de Cores

### Cores Principais

- **Fundo Principal**: `bg-white` (Branco)
- **Cor Primária/Destaque**: `#F1641E` (Laranja)
- **Fundo Secundário/Destaque**: `#FDEBD2` (Bege claro)
- **Texto Principal**: `text-gray-900` (Quase preto)
- **Texto Secundário**: `text-gray-700` (Cinza escuro)
- **Texto Terciário**: `text-gray-500` (Cinza médio)
- **Bordas**: `border-gray-200` (Cinza claro)

### Estados e Feedback

- **Sucesso**: `text-green-600` / `border-green-600` (Verde)
- **Destaque**: `bg-orange-500` (Laranja mais intenso)
- **Hover em Links**: `hover:text-orange-500` (Laranja)
- **Hover em Botões Claros**: `hover:bg-gray-100` (Cinza muito claro)

## 📏 Tipografia

### Hierarquia de Texto

- **Título Principal (H1)**: `text-4xl md:text-5xl font-bold text-gray-900`
- **Título de Seção (H2)**: `text-2xl font-bold text-gray-900`
- **Subtítulo (H3)**: `text-lg font-bold text-gray-800`
- **Texto de Destaque**: `text-lg text-gray-700`
- **Texto Normal**: `text-sm text-gray-600`
- **Texto Pequeno/Metadados**: `text-xs text-gray-500`

### Família de Fontes

- Sistema padrão do Tailwind (sans-serif)

## 🧩 Componentes

### Botões

- **Botão Primário**: `bg-[#F1641E] text-white hover:bg-[#e05a1c]`
- **Botão Secundário**: `bg-white text-gray-800 hover:bg-gray-100 border border-gray-300`
- **Botão Fantasma**: `variant="ghost"`
- **Botão Ícone**: `variant="ghost" size="icon"`
- **Botão Outline**: `variant="outline"`

### Cards e Containers

- **Card Padrão**: `bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow`
- **Container Principal**: `container mx-auto px-4`
- **Seções Alternadas**: Alternar entre `bg-white` e `bg-gray-50` para criar separação visual

### Navegação

- **Links de Navegação**: `text-gray-700 hover:text-orange-500`
- **Link Ativo**: `text-orange-500`
- **Barra de Navegação**: `border-b border-gray-200`

### Formulários

- **Input de Busca**: `rounded-full border-gray-300 pl-4 pr-10 py-2 focus:ring-orange-500 focus:border-orange-500`
- **Inputs Padrão**: `rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500`

### Badges

- **Badge Destaque**: `bg-orange-500 text-white`
- **Badge Outline**: `variant="outline" className="text-green-600 border-green-600"`

## 📱 Responsividade

### Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Padrões Responsivos

- **Navegação**: Menu hamburger em mobile, menu completo em desktop
- **Grids**:
  - Mobile: `grid-cols-2`
  - Tablet: `md:grid-cols-3` ou `md:grid-cols-4`
  - Desktop: `lg:grid-cols-4` ou `lg:grid-cols-6`
- **Espaçamento**: Reduzir padding/margin em telas menores
- **Tipografia**: Reduzir tamanho de fonte em telas menores

## 🖼️ Imagens e Ícones

### Imagens

- **Produtos**: Proporção quadrada (`aspect-square`)
- **Efeito Hover**: `group-hover:scale-105 transition-transform duration-300`
- **Arredondamento**: `rounded-lg` para cards, `rounded-full` para avatares/categorias

### Ícones

- **Biblioteca**: Lucide React
- **Tamanho Padrão**: `h-5 w-5` ou `h-6 w-6` para ícones maiores
- **Cor**: Geralmente herda a cor do texto do elemento pai

## 🧠 Padrões de Interação

### Hover

- **Cards**: Leve aumento de sombra (`hover:shadow-md`)
- **Imagens**: Leve zoom (`scale-105`)
- **Botões de Ação**: Aparecem apenas no hover (`opacity-0 group-hover:opacity-100`)

### Transições

- **Duração Padrão**: `duration-300`
- **Timing Function**: `ease` ou `ease-out`

## 📦 Layout de Página

### Estrutura Comum

1. **Barra de Anúncio**: Fundo bege claro (`#FDEBD2`) com texto centralizado
2. **Cabeçalho**: Logo, busca e navegação do usuário
3. **Navegação de Categorias**: Links para categorias principais
4. **Conteúdo Principal**: Seções com alternância de fundos branco e cinza claro
5. **Rodapé**: Links de navegação, informações da empresa e redes sociais

### Espaçamento

- **Entre Seções**: `py-12` (padding vertical)
- **Entre Elementos**: `space-y-2` para espaçamento vertical pequeno, `gap-4` ou `gap-6` para grids

## 🔍 Acessibilidade

- **Contraste**: Manter alto contraste entre texto e fundo
- **Foco**: Estilizar estados de foco para navegação por teclado
- **Textos Alternativos**: Sempre incluir `alt` descritivo em imagens

---

Este guia deve ser consultado ao desenvolver novas páginas e componentes para garantir a consistência visual em todo o Essencial E-commerce.
