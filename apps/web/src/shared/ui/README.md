# Design system (`shared/ui`)

Camada pública de primitives e layouts do Cifra Hub. Features, widgets e pages importam **somente** este barrel: `@/shared/ui`. `@base-ui/react` fica encapsulado aqui.

## Instalação

`@base-ui/react` é dependência de `apps/web`. Não importe o pacote fora de `src/shared/ui`. O ESLint rejeita imports diretos e caminhos internos (`@/shared/ui/button`).

```ts
import {
  Button,
  IconButton,
  Popover,
  Dialog,
  Tooltip,
  Select,
  Slider,
  Stack,
  Inline,
  Surface,
  AppShell,
} from '@/shared/ui';
```

## Quando usar Tooltip, Popover ou Dialog

| Primitive | Use quando | Não use quando |
|---|---|---|
| **Tooltip** | Rótulo curto ou dica para quem vê a tela | Conteúdo interativo, formulário ou ação |
| **Popover** | Conteúdo contextual âncorado (preview, ação rápida) | Tarefa que exige foco exclusivo |
| **Dialog** | Tarefa modal (escolher forma, confirmar) | Dica breve ou preview ao passar o mouse |

## Tokens

Definições em `apps/web/src/app/styles/tokens.css`. Features usam intenções, nunca valores copiados.

| Grupo | Tokens | Quando usar |
|---|---|---|
| Cor | `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-text`, `--color-muted`, `--color-accent`, `--color-danger`, `--color-border`, `--color-scrim` | Temas escuro/claro |
| Espaço | `--space-1` … `--space-8` | Gaps, paddings, margens |
| Tipo | `--font-body`, `--font-mono`, `--text-sm/md/lg` | Hierarquia |
| Forma | `--radius-sm/md/lg/pill` | Controles e superfícies |
| Elevação | `--shadow-popover`, `--shadow-dialog` | Overlays |
| Movimento | `--duration-fast`, `--duration-normal` | `0ms` com `prefers-reduced-motion` |
| Controle | `--control-height-compact/default`, `--control-hit-target` (`44px`) | Botões, selects, sliders |
| Camada | `--layer-header` < `--layer-popover` < `--layer-scrim` < `--layer-dialog` < `--layer-toast` | Ordem de overlays |

Impressão remove popovers, diálogos, backdrops e controles do catálogo.

## Primitives

Todos expõem `data-slot` estável. Portals montam em `document.body`.

### Button

Variantes: `primary`, `secondary`, `ghost`, `danger`. Tamanhos: `compact`, `default`. Estados: hover, foco visível, `disabled`, `loading` (largura estável).

```tsx
<Button variant="primary">Buscar</Button>
<Button variant="danger" loading>Excluir</Button>
```

### IconButton

Exige `aria-label`. Mesmas variantes e tamanhos do Button.

```tsx
<IconButton aria-label="Fechar" variant="secondary">×</IconButton>
```

### Popover

Abertura por clique, `openOnHover` + `closeDelay`, ou estado controlado. Collision avoidance e offset padrão (`8px` / padding `12px`).

```tsx
<Popover>
  <Popover.Trigger openOnHover delay={0} closeDelay={140}>C</Popover.Trigger>
  <Popover.Portal>
    <Popover.Positioner>
      <Popover.Popup>
        <Popover.Title>Acorde C</Popover.Title>
      </Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</Popover>
```

### Dialog

Tamanhos `compact` (`320px`), `default` (`560px`), `wide` (`720px`). Focus trap, Escape, clique no backdrop e retorno de foco vêm do Base UI.

```tsx
<Dialog>
  <Dialog.Trigger>Abrir</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Viewport>
      <Dialog.Popup size="compact">
        <Dialog.Title>Título</Dialog.Title>
        <Dialog.Close aria-label="Fechar">×</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Viewport>
  </Dialog.Portal>
</Dialog>
```

### Tooltip

Somente texto descritivo.

```tsx
<Tooltip>
  <Tooltip.Trigger render={<IconButton aria-label="Tap tempo" />}>Tap</Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Positioner>
      <Tooltip.Popup>Toque o ritmo da música</Tooltip.Popup>
    </Tooltip.Positioner>
  </Tooltip.Portal>
</Tooltip>
```

A aplicação envolve a árvore com `Tooltip.Provider`.

### Select

Substitui `<select>` nativo. API de produto:

```tsx
<Select
  label="Fonte"
  value={fontSize}
  onValueChange={setFontSize}
  items={[
    { value: 'sm', label: 'Pequena' },
    { value: 'md', label: 'Média' },
    { value: 'lg', label: 'Grande' },
  ]}
/>
```

Composição: `Select.Root`, `Trigger`, `Value`, `Popup`, `Item`.

### Slider

Teclado, rótulo e valor acessível no thumb.

```tsx
<Slider aria-label="BPM" min={40} max={240} value={bpm} onValueChange={setBpm} label="BPM" />
```

## Layouts

- `Stack`: coluna com `gap` de token (`1`–`8`)
- `Inline`: linha com wrap e alinhamento
- `Surface`: `base` | `raised` | `interactive`
- `AppShell`: header, sidebar opcional e `main` — sem estado de música

## Matriz de estados

| | default | hover | focus | disabled | loading | erro | claro/escuro |
|---|---|---|---|---|---|---|---|
| Button / IconButton | ✓ | ✓ | ✓ | ✓ | ✓ | danger | tokens |
| Select | ✓ | ✓ | ✓ | ✓ | — | — | tokens |
| Slider | ✓ | ✓ | ✓ | ✓ | — | — | tokens |
| Popover / Dialog / Tooltip | aberto/fechado | — | trap no Dialog | — | — | — | tokens |

## Testes

- Preferir papel/nome acessível; `data-slot` só para geometria.
- Catálogo determinístico: rota DEV `/ui-system`.
- Não importar entities/features em `shared/ui`.
