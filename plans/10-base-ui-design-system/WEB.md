# Plano 10 — Web: Base UI e design system

## Objetivo técnico

Criar uma camada visual estável em `shared/ui`, construída sobre Base UI e tokens CSS semânticos. A camada deve esconder detalhes do fornecedor, oferecer primitives e layouts reutilizáveis e impedir que novas features contornem o sistema. O fluxo de acordes será a primeira migração real.

## Decisões

1. **Base UI é infraestrutura, não API de feature.** Somente arquivos internos de `shared/ui` importam `@base-ui/react`.
2. **CSS atual permanece.** Este plano não introduz Tailwind; Base UI recebe classes e `data-slot`, estilizados com CSS do projeto.
3. **Tokens são semânticos.** Features usam intenções como `--color-surface-raised` e `--layer-popover`, não valores copiados.
4. **Composição antes de configuração.** Os wrappers expõem a API necessária ao produto e preservam os subcomponentes compostos do Base UI.
5. **Acessibilidade pertence ao primitive.** Portal, foco, Escape, dismissal e ARIA não são reimplementados nas features.
6. **A rota de catálogo é ferramenta de desenvolvimento.** `/ui-system` serve à inspeção humana, ao Playwright e aos agentes, sem entrar no build de produção.

## Estrutura proposta

```text
apps/web/src/
├── app/
│   ├── router/
│   │   └── ui-system-route.tsx       # importada somente em DEV
│   └── styles/
│       ├── tokens.css                # decisões semânticas
│       └── global.css                # reset e estilos existentes
├── pages/
│   └── ui-system/
│       └── ui/ui-system-page.tsx     # catálogo determinístico
├── shared/
│   └── ui/
│       ├── button/
│       ├── dialog/
│       ├── icon-button/
│       ├── popover/
│       ├── select/
│       ├── slider/
│       ├── tooltip/
│       ├── layout/
│       │   ├── app-shell.tsx
│       │   ├── inline.tsx
│       │   ├── stack.tsx
│       │   └── surface.tsx
│       ├── README.md
│       └── index.ts
├── features/select-chord-fingering/
│   └── ui/fingering-picker.tsx       # consumidor de Dialog
└── widgets/chord-viewer/
    └── ui/chord-content.tsx          # consumidor de Popover
```

Os nomes finais podem acompanhar a convenção já existente por pasta, mas as fronteiras e responsabilidades acima são obrigatórias.

## Tokens

Extrair e normalizar os valores hoje espalhados por `global.css` em grupos semânticos:

| Grupo | Exemplos mínimos | Uso |
|---|---|---|
| Cor | `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-text`, `--color-muted`, `--color-accent`, `--color-danger`, `--color-border`, `--color-scrim` | Temas e estados |
| Espaçamento | `--space-1` a `--space-8` | Gaps, paddings e margens |
| Tipografia | `--font-body`, `--font-mono`, `--text-sm`, `--text-md`, `--text-lg`, pesos e line-height | Hierarquia consistente |
| Forma | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill` | Controles e superfícies |
| Elevação | `--shadow-popover`, `--shadow-dialog` | Overlays e superfícies elevadas |
| Movimento | `--duration-fast`, `--duration-normal`, curvas e fallback para `prefers-reduced-motion` | Entrada, saída e feedback |
| Controle | alturas compacta/padrão e hit target mínimo de `44px` | Botões, selects e sliders |
| Camada | `--layer-header`, `--layer-popover`, `--layer-scrim`, `--layer-dialog`, `--layer-toast` | Ordem global de overlays |

O tema claro sobrescreve intenções, não a estrutura dos componentes. Impressão remove overlays, scrims, sombras e controles interativos.

## Primitives públicos

### Button e IconButton

- Variantes `primary`, `secondary`, `ghost` e `danger`.
- Tamanhos `compact` e `default`.
- Estados disabled e loading sem alterar abruptamente a largura.
- `IconButton` exige nome acessível por `aria-label` ou conteúdo equivalente.

### Popover

- Composição pública para trigger, portal, positioner, popup, title e description.
- Posicionamento com collision avoidance do Base UI e offset padronizado.
- Props de produto para abertura por hover/foco, abertura controlada e atraso de fechamento.
- Portal montado na raiz documentada de overlays; sem coordenadas calculadas manualmente por feature.
- Camada `--layer-popover`, abaixo de scrim/dialog e acima da navegação e conteúdo.

### Dialog

- Composição pública para trigger, portal, backdrop, popup, title, description e close.
- Tamanhos `compact`, `default` e `wide`, todos com largura e altura limitadas pela viewport.
- Focus trap, retorno de foco, Escape e clique externo delegados ao Base UI.
- Scroll interno apenas no conteúdo do diálogo; a página de fundo permanece estável.

### Tooltip, Select e Slider

- Tooltip apenas para rótulo ou explicação curta, nunca para conteúdo interativo.
- Select substitui os selects visuais da sidebar sem alterar seus valores ou regras de negócio.
- Slider mantém suporte a teclado, rótulo e valor acessível no controle de velocidade.

## Layouts públicos

- `Stack`: fluxo vertical com gaps definidos por token.
- `Inline`: fluxo horizontal com wrap, alinhamento e gaps definidos por token.
- `Surface`: superfície semântica (`base`, `raised`, `interactive`) sem conhecimento de domínio.
- `AppShell`: composição responsiva de header, sidebar e conteúdo; não contém estado da música.

Esses componentes resolvem geometria e espaçamento. Textos, dados e regras continuam nas slices de negócio.

## Catálogo legível por pessoas e agentes

`shared/ui/README.md` deve conter:

- mapa de tokens e quando usar cada intenção;
- import público de cada primitive/layout;
- exemplos mínimos copiáveis, com props válidas;
- matriz de variantes e estados;
- regra de escolha: Tooltip para ajuda curta, Popover para conteúdo contextual/interativo e Dialog para tarefa modal;
- limites de dependência FSD e proibição de imports diretos do Base UI;
- orientação para `data-slot`, nomes acessíveis e testes.

A rota `/ui-system`, habilitada somente por `import.meta.env.DEV`, apresenta lado a lado temas, estados, overlays próximos às quatro bordas e os diálogos de uma e várias formas. Os dados são fixtures locais e determinísticos.

## Migração do fluxo de acordes

### Preview na letra

Substituir o cálculo manual e o portal próprio de `widgets/chord-viewer/ui/chord-content.tsx` pelo `Popover` compartilhado:

- o símbolo é o trigger;
- o diagrama e a ação “ver formas” são o conteúdo interativo;
- o positioner escolhe automaticamente acima/abaixo e desloca o popup para dentro da viewport;
- a área combinada trigger/popup preserva a interação no deslocamento do ponteiro;
- teclado abre por foco/ação e fecha por Escape;
- abrir o seletor fecha o popover antes de montar o diálogo.

### Seletor de formas

Migrar `features/select-chord-fingering/ui/fingering-picker.tsx` para `Dialog` e remover o gerenciamento manual de foco. O layout terá:

- variante `compact` quando existe uma forma: popup de até `320px`, diagrama de até `198px` e sem grade vazia;
- variante `default` quando existem várias: popup de até `560px`, grade responsiva e diagramas de até `198px`;
- margem mínima de `12px` da viewport;
- altura limitada à viewport, com scroll somente da lista quando necessário;
- grupo de seleção com nome acessível, estado selecionado visível e persistência atual intacta.

No mobile, o popup continua compacto e respeita a viewport; este ticket não transforma automaticamente todo diálogo em tela cheia.

## Fronteiras e lint

Adicionar `no-restricted-imports` à configuração web:

```text
apps/web/src/shared/ui/**  → pode importar @base-ui/react
apps/web/src/** restante  → importa somente de shared/ui
```

O barrel `shared/ui/index.ts` é a entrada pública. Imports de arquivos internos de um primitive também são bloqueados fora de `shared/ui`.

## Ordem de implementação

1. Instalar Base UI e registrar a restrição de imports.
2. Extrair tokens semânticos e mapear os valores legados sem mudança visual ampla.
3. Implementar Button, IconButton, Tooltip, Popover e Dialog.
4. Implementar Select e Slider e migrar os controles equivalentes da sidebar.
5. Implementar Stack, Inline, Surface e AppShell; migrar somente a estrutura já existente.
6. Criar documentação e rota DEV `/ui-system`.
7. Migrar preview e seletor de formas.
8. Remover CSS e lógica manual tornados obsoletos.
9. Executar testes, build, Playwright e validação manual.

## Arquivos de impacto provável

- `apps/web/package.json`
- `apps/web/eslint.config.js` ou configuração ESLint equivalente
- `apps/web/src/app/router/*`
- `apps/web/src/app/styles/global.css`
- `apps/web/src/app/styles/tokens.css`
- `apps/web/src/shared/ui/**`
- `apps/web/src/pages/ui-system/**`
- `apps/web/src/features/select-chord-fingering/ui/fingering-picker.tsx`
- `apps/web/src/widgets/chord-viewer/ui/chord-content.tsx`
- componentes da sidebar que hoje usam `button`, `select` e `input[type=range]` diretamente

