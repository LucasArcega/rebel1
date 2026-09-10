# WEB — Plano 07: auto-scroll BPM

## Escopo (FSD)

| Camada | Arquivos |
|--------|----------|
| shared | `shared/lib/scroll-bpm.ts` (funções puras) |
| shared | `shared/lib/scroll-bpm-storage.ts` (prefs por música) |
| features | `features/auto-scroll-chord/model/use-auto-scroll-bpm.ts` |
| features | `features/auto-scroll-chord/model/use-tap-tempo.ts` |
| features | `features/auto-scroll-chord/ui/auto-scroll-bpm-controls.tsx` |
| widgets | `widgets/chord-viewer/ui/chord-viewer.tsx` (trocar controles) |

## Checklist

### Funções puras (`scroll-bpm.ts`)

- [ ] `beatIntervalMs(bpm: number): number`
- [ ] `scrollPerBeat(lineHeight: number, linesPerBeat: number): number`
- [ ] `calculateTapTempoBpm(taps: number[]): number | null` — mínimo 2 intervalos, descarta outliers
- [ ] Validar BPM: `clamp(bpm, 40, 240)`

### Hook `useAutoScrollBpm`

- [ ] Recebe `contentRef`, `lineHeight` (derivado de `fontSize` ou medido no DOM)
- [ ] Estado: `bpm`, `linesPerBeat`, `isPlaying`
- [ ] `useEffect` com `setInterval` em `beatIntervalMs(bpm)` → `scrollTop += scrollPerBeat`
- [ ] Parar ao chegar no fim
- [ ] Pausar ao interagir com o conteúdo (opcional, recomendado)

### Tap tempo (`useTapTempo`)

- [ ] Botão “Tap” — registra `Date.now()` a cada clique
- [ ] Janela de 2s sem toque → reset da sequência
- [ ] Após 3+ toques → calcular BPM e chamar `onBpmChange`
- [ ] Feedback visual: “Batendo…” / BPM calculado

### UI (`AutoScrollBpmControls`)

- [ ] Input numérico BPM (40–240)
- [ ] Slider BPM (mesma faixa)
- [ ] Botão Tap tempo
- [ ] Select ou slider “Linhas por batida” (0.5–4)
- [ ] Play / Pausar
- [ ] Indicador visual de batida (pulso no botão play ou barra — opcional mas desejável)

### Persistência (`scroll-bpm-storage.ts`)

```typescript
interface ScrollBpmPrefs {
  bpm: number;
  linesPerBeat: number;
}

// chave: scroll-bpm/{artistSlug}/{songSlug}
```

- [ ] Carregar ao abrir música
- [ ] Salvar ao alterar BPM ou linesPerBeat (debounce 300ms)

### Integração `ChordViewer`

- [ ] Passar `artistSlug`, `songSlug`, `fontSize` para o hook
- [ ] Substituir `AutoScrollControls` por `AutoScrollBpmControls`
- [ ] Medir `lineHeight` do `#chord-print-area` via `ResizeObserver` ou constante por `fontSize`

## Migração do modo legado

| Opção | Descrição |
|-------|-----------|
| A (recomendada) | Remover slider de velocidade; só BPM |
| B | Toggle “Modo: BPM / Manual” mantendo `use-auto-scroll.ts` |

Critério de aceite do README assume **opção A**.

## Tipos

```typescript
export interface AutoScrollBpmState {
  bpm: number;
  linesPerBeat: number;
  isPlaying: boolean;
  lastTapBpm: number | null;
}
```

## Testes unitários (`packages/shared`)

- [ ] `beatIntervalMs(120)` → `500`
- [ ] `beatIntervalMs(60)` → `1000`
- [ ] `calculateTapTempoBpm` com toques regulares a 500ms → ~120 BPM
- [ ] `calculateTapTempoBpm` com < 2 intervalos → `null`
