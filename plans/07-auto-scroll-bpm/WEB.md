# WEB — Plano 07: auto-scroll BPM + GetSongBPM

## Escopo (FSD)

| Camada | Arquivos |
|--------|----------|
| shared | `shared/lib/scroll-bpm.ts` |
| shared | `shared/lib/scroll-bpm-storage.ts` |
| entities | `entities/bpm/api/bpm-api.ts` |
| entities | `entities/bpm/model/types.ts` |
| features | `features/fetch-bpm/model/use-bpm-query.ts` |
| features | `features/auto-scroll-chord/model/use-auto-scroll-bpm.ts` |
| features | `features/auto-scroll-chord/model/use-tap-tempo.ts` |
| features | `features/auto-scroll-chord/ui/auto-scroll-bpm-controls.tsx` |
| features | `features/auto-scroll-chord/ui/getsong-attribution.tsx` |
| widgets | `widgets/chord-viewer/ui/chord-viewer.tsx` |

## Fluxo na song page

```
useChordQuery → ChordSong (artistName, songName, slugs)
useBpmQuery({ artist, song, artistName, songName })
  → GET /api/bpm?...
  → onSuccess: setInitialBpm (se usuário não editou manualmente)
AutoScrollBpmControls
  → exibe BPM + badge "GetSong" | "Tap" | "Manual"
  → backlink GetSongBPM quando source === 'getsongbpm'
```

## Checklist

### Entity `bpm`

- [x] `BpmLookupResult`: `{ bpm, key?, timeSig?, source, attribution? }`
- [x] `bpmApi.lookup(params)` → `GET /api/bpm?...`

### `useBpmQuery`

- [x] TanStack Query, `enabled` quando cifra carregou
- [x] `staleTime`: 24h (BPM estável)
- [x] Não retry agressivo em 404 (miss é esperado em MPB)
- [x] Cache key: `['bpm', artistSlug, songSlug]`

### Funções puras (`scroll-bpm.ts`)

- [x] `beatIntervalMs(bpm: number): number`
- [x] `scrollPerBeat(lineHeight: number, linesPerBeat: number): number`
- [x] `calculateTapTempoBpm(taps: number[]): number | null`
- [x] `clampBpm(bpm: number): number` — 40–240

### Hook `useAutoScrollBpm`

- [x] Props: `contentRef`, `lineHeight`, `initialBpm?`, `artistSlug`, `songSlug`
- [x] Estado: `bpm`, `linesPerBeat`, `isPlaying`, `bpmSource`
- [x] `useEffect` interval em `beatIntervalMs(bpm)` → `window.scrollBy(0, scrollPerBeat)`
- [x] Parar ao fim do documento
- [x] `initialBpm` do GetSong só aplica se `bpmSource !== 'manual' && !== 'tap'`

### Tap tempo (`useTapTempo`)

- [x] Botão “Tap” — `Date.now()` por clique
- [x] Reset após 2s sem toque
- [x] 3+ toques → BPM → `bpmSource = 'tap'`

### UI (`AutoScrollBpmControls`)

- [x] Input + slider BPM (40–240)
- [x] Botão Tap tempo
- [x] Slider “Linhas por batida” (0.5–4)
- [x] Play / Pausar
- [x] Badge de origem: `GetSong` / `Tap` / `Manual` / `…` (loading)
- [x] Mensagem suave se 404: “BPM não encontrado — use tap ou informe manualmente”

### Backlink GetSongBPM (`getsong-attribution.tsx`)

- [x] Renderizar **somente** quando BPM veio de GetSong (API ou cache com source getsong)
- [x] Texto mínimo: `BPM via GetSongBPM` → link `https://getsongbpm.com` (`target="_blank"`, `rel="noreferrer"`)
- [x] Posição: rodapé da `chord-viewer__sidebar` (sempre visível quando aplicável)

### Persistência (`scroll-bpm-storage.ts`)

```typescript
interface ScrollBpmPrefs {
  bpm: number;
  linesPerBeat: number;
  bpmSource: 'getsong' | 'tap' | 'manual';
  cachedGetSong?: {
    bpm: number;
    key?: string;
    fetchedAt: number;
  };
}
// chave: scroll-bpm/{artistSlug}/{songSlug}
```

- [x] Carregar ao abrir música (prefs do usuário > cache GetSong > API)
- [x] Salvar ao alterar BPM, linesPerBeat ou source (debounce 300ms)
- [x] Cache GetSong local evita bater na API ao revisitar a mesma música

### Integração `ChordViewer`

- [x] Passar slugs + nomes para `useBpmQuery` e `useAutoScrollBpm`
- [x] Substituir `AutoScrollControls` por `AutoScrollBpmControls`
- [x] `contentRef` no `chord-content-area` (scroll da página — já implementado)
- [x] Medir `lineHeight` via `ResizeObserver` em `.chord-line` ou constante por `fontSize`

## Prioridade de BPM efetivo

```
1. Prefs localStorage (manual/tap) se existirem para a música
2. Cache local GetSong (TTL 30 dias)
3. GET /api/bpm (GetSongBPM)
4. Default UI: 120 BPM até usuário ajustar
```

## Migração do modo legado

| Opção | Descrição |
|-------|-----------|
| A (recomendada) | Remover slider de velocidade; só BPM |
| B | Toggle “Modo: BPM / Manual” — **fora do escopo** |

## Tipos

```typescript
export type BpmSource = 'getsong' | 'tap' | 'manual';

export interface AutoScrollBpmState {
  bpm: number;
  linesPerBeat: number;
  isPlaying: boolean;
  bpmSource: BpmSource;
  lastTapBpm: number | null;
  isFetchingBpm: boolean;
  bpmError: string | null;
}
```

## Testes unitários (`packages/shared`)

- [x] `beatIntervalMs(120)` → `500`
- [x] `beatIntervalMs(60)` → `1000`
- [x] `calculateTapTempoBpm` — toques regulares 500ms → ~120
- [x] `calculateTapTempoBpm` — < 2 intervalos → `null`
- [x] Normalização resposta GetSongBPM (mock JSON)
