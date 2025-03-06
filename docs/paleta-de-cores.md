# Paleta de Cores - Essencial E-commerce

Este documento serve como referência para a paleta de cores utilizada no site Essencial, garantindo consistência visual em todo o projeto.

## 🎨 Cores Principais

### Cores de Marca (Brand Colors)

- `bg-[#FDEBD2]`: Cor pastel principal, usada no fundo do hero e seções destacadas
- `text-orange-500`: Cor de destaque para elementos especiais (#F97316)
- `bg-gray-800`: Cor principal para botões e ações (#1F2937)
- `hover:bg-gray-700`: Estado hover dos botões principais (#374151)

### Tons de Laranja (Destaques)

- `bg-orange-500`: Badges de destaque e elementos especiais (#F97316)
- `text-orange-500`: Links ativos, filtros selecionados e textos destacados
- `bg-orange-50`: Fundo suave para elementos destacados (#FFF7ED)
- `hover:text-orange-500`: Hover de links e elementos interativos secundários

### Tons de Cinza

- `text-gray-900`: Títulos principais (#111827)
- `text-gray-800`: Subtítulos e botões principais (#1F2937)
- `text-gray-700`: Textos do corpo (#374151)
- `text-gray-600`: Textos secundários (#4B5563)
- `text-gray-500`: Textos de placeholder (#6B7280)
- `text-gray-400`: Ícones em estado normal (#9CA3AF)
- `text-gray-300`: Bordas suaves (#D1D5DB)
- `text-gray-200`: Separadores (#E5E7EB)
- `text-gray-100`: Fundos alternativos (#F3F4F6)
- `text-gray-50`: Fundo suave e hovers (#F9FAFB)

### Brancos e Fundos

- `bg-white`: Fundo padrão de cards e seções principais
- `bg-gray-50`: Fundo alternativo para seções
- `bg-[#FDEBD2]`: Fundo especial para seções de destaque

## 🎯 Aplicação das Cores

### Elementos de Destaque

1. **Badges e Tags de Destaque**

```css
bg-orange-500
text-white
```

2. **Filtros e Links Ativos**

```css
text-orange-500
font-medium
```

3. **Elementos "Mais Vendido"**

```css
bg-orange-500
text-white
text-sm
font-medium
```

### Botões

1. **Botão Principal**

```css
bg-gray-800
text-white
hover:bg-gray-700
focus:ring-gray-800
```

2. **Botão Secundário**

```css
bg-white
text-gray-700
border
border-gray-200
hover:bg-gray-50
hover:text-gray-800
```

3. **Botão Ghost**

```css
text-gray-600
hover:text-orange-500
hover:bg-gray-50
```

### Links e Interações

1. **Links de Navegação**

```css
text-gray-600
hover:text-orange-500
```

2. **Links de Destaque**

```css
text-orange-500
hover:text-orange-600
```

### Seções

1. **Hero e Seções Destacadas**

```css
bg-[#FDEBD2]
```

2. **Seções Principais**

```css
bg-white
```

3. **Seções Alternadas**

```css
bg-gray-50
```

### Elementos de Formulário

```css
bg-white
border-gray-200
focus:ring-gray-800
focus:border-gray-800
placeholder-gray-500
```

## 💡 Boas Práticas

1. **Uso do Laranja**

   - Reserve para elementos que precisam de destaque visual
   - Use em badges, tags e indicadores de status
   - Aplique em links ativos e filtros selecionados
   - Evite usar em áreas grandes ou botões principais

2. **Uso dos Tons de Cinza**

   - Use para botões principais e ações importantes
   - Aplique em textos e elementos de interface básicos
   - Mantenha a hierarquia visual com diferentes tons

3. **Consistência**

   - Use `text-gray-900` para títulos principais
   - Use `text-gray-600` para textos secundários
   - Use laranja estrategicamente para chamar atenção
   - Mantenha o pastel `#FDEBD2` como identidade visual

4. **Interatividade**
   - Botões principais: tons de cinza
   - Hovers secundários: laranja
   - Links: transição de cinza para laranja no hover
   - Mantenha feedback visual consistente

## 🔄 Atualizações

Este documento deve ser atualizado sempre que houver mudanças significativas na paleta de cores do projeto. Mantenha-o sempre sincronizado com a implementação atual do site.

---

_Última atualização: Março 2024_
