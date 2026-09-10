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

- [ ] `BpmLookupResult`: `{ bpm, key?, timeSig?, source, attribution? }`
- [ ] `bpmApi.lookup(params)` → `GET /api/bpm?...`

### `useBpmQuery`

- [ ] TanStack Query, `enabled` quando cifra carregou
- [ ] `staleTime`: 24h (BPM estável)
- [ ] Não retry agressivo em 404 (miss é esperado em MPB)
- [ ] Cache key: `['bpm', artistSlug, songSlug]`

### Funções puras (`scroll-bpm.ts`)

- [ ] `beatIntervalMs(bpm: number): number`
- [ ] `scrollPerBeat(lineHeight: number, linesPerBeat: number): number`
- [ ] `calculateTapTempoBpm(taps: number[]): number | null`
- [ ] `clampBpm(bpm: number): number` — 40–240

### Hook `useAutoScrollBpm`

- [ ] Props: `contentRef`, `lineHeight`, `initialBpm?`, `artistSlug`, `songSlug`
- [ ] Estado: `bpm`, `linesPerBeat`, `isPlaying`, `bpmSource`
- [ ] `useEffect` interval em `beatIntervalMs(bpm)` → `window.scrollBy(0, scrollPerBeat)`
- [ ] Parar ao fim do documento
- [ ] `initialBpm` do GetSong só aplica se `bpmSource !== 'manual' && !== 'tap'`

### Tap tempo (`useTapTempo`)

- [ ] Botão “Tap” — `Date.now()` por clique
- [ ] Reset após 2s sem toque
- [ ] 3+ toques → BPM → `bpmSource = 'tap'`

### UI (`AutoScrollBpmControls`)

- [ ] Input + slider BPM (40–240)
- [ ] Botão Tap tempo
- [ ] Slider “Linhas por batida” (0.5–4)
- [ ] Play / Pausar
- [ ] Badge de origem: `GetSong` / `Tap` / `Manual` / `…` (loading)
- [ ] Mensagem suave se 404: “BPM não encontrado — use tap ou informe manualmente”

### Backlink GetSongBPM (`getsong-attribution.tsx`)

- [ ] Renderizar **somente** quando BPM veio de GetSong (API ou cache com source getsong)
- [ ] Texto mínimo: `BPM via GetSongBPM` → link `https://getsongbpm.com` (`target="_blank"`, `rel="noreferrer"`)
- [ ] Posição: rodapé da `chord-viewer__sidebar` (sempre visível quando aplicável)

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

- [ ] Carregar ao abrir música (prefs do usuário > cache GetSong > API)
- [ ] Salvar ao alterar BPM, linesPerBeat ou source (debounce 300ms)
- [ ] Cache GetSong local evita bater na API ao revisitar a mesma música

### Integração `ChordViewer`

- [ ] Passar slugs + nomes para `useBpmQuery` e `useAutoScrollBpm`
- [ ] Substituir `AutoScrollControls` por `AutoScrollBpmControls`
- [ ] `contentRef` no `chord-content-area` (scroll da página — já implementado)
- [ ] Medir `lineHeight` via `ResizeObserver` em `.chord-line` ou constante por `fontSize`

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

- [ ] `beatIntervalMs(120)` → `500`
- [ ] `beatIntervalMs(60)` → `1000`
- [ ] `calculateTapTempoBpm` — toques regulares 500ms → ~120
- [ ] `calculateTapTempoBpm` — < 2 intervalos → `null`
- [ ] Normalização resposta GetSongBPM (mock JSON)
