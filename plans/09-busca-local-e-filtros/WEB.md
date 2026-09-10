# WEB — Plano 09: busca local e filtros

## Escopo (FSD)

| Camada | Arquivos |
|--------|----------|
| shared | `shared/lib/search-normalize.ts` |
| shared | `shared/lib/filter-offline-chords.ts` |
| shared | `shared/lib/search-local-chords.ts` |
| entities | `entities/offline-chord/lib/offline-chord-storage.ts` (opcional: `search`) |
| features | `features/filter-offline-library/model/use-offline-filter.ts` |
| features | `features/filter-offline-library/ui/offline-library-filter.tsx` |
| features | `features/search-results/ui/search-results-list.tsx` |
| features | `features/search-results/model/use-hybrid-search.ts` |
| features | `features/search-chord/model/use-search-chord-form.ts` (debounce opcional) |
| pages | `pages/library/ui/library-page.tsx` |
| pages | `pages/home/ui/home-page.tsx` |
| pages | `pages/search/ui/search-page.tsx` |

## Checklist — Fase A (filtro biblioteca)

### `filter-offline-chords.ts`

- [ ] `normalizeSearchText(value: string): string`
- [ ] `filterOfflineChords(items: OfflineChordRecord[], query: string): OfflineChordRecord[]`
- [ ] Match se query normalizada aparece em: `artistName`, `songName`, `version`, `instrument`
- [ ] Query vazia → retorna todos (ordenados por `savedAt` desc)

### `useOfflineFilter`

- [ ] Estado `filterQuery`
- [ ] `filteredItems` derivado de `items` + `filterOfflineChords`
- [ ] Persistir último filtro em `sessionStorage` (opcional, recomendado)

### `OfflineLibraryFilter`

- [ ] Input com placeholder “Filtrar por artista ou música…”
- [ ] Botão limpar (×) quando há texto
- [ ] Contador: “3 de 12 cifras”

### Integração

- [ ] `LibraryPage` — filtro acima da lista
- [ ] `HomePage` — mesmo filtro na seção “Salvas no dispositivo”
- [ ] `OfflineLibraryList` recebe `items` já filtrados (ou filtra internamente via hook)

## Checklist — Fase B (busca híbrida)

### `search-local-chords.ts`

```typescript
export interface LocalSearchResult {
  artistSlug: string;
  songSlug: string;
  artistName: string;
  songName: string;
  version: string;
  instrument: InstrumentSlug | 'cifra-group';
  savedAt: string;
  source: 'offline';
}
```

- [ ] `searchLocalChords(records: OfflineChordRecord[], query: string): LocalSearchResult[]`
- [ ] Dedup local: uma entrada por `artistSlug/songSlug` (versão mais recente)

### `useHybridSearch`

- [ ] Combina `useOfflineLibrary` + `useSearchQuery` (Solr)
- [ ] Retorna `{ local, remote, remoteFiltered, counts }`
- [ ] `remoteFiltered` exclui slugs já presentes em `local`

### `SearchResultsList`

- [ ] Seção **Salvas no dispositivo** (se `local.length > 0`)
- [ ] Seção **Cifra Club** (remote filtrado)
- [ ] Cards locais linkam com `?instrument=&version=` corretos
- [ ] Badge **Salva** no card local
- [ ] Header: “2 salvas · 18 online”

### Debounce

- [ ] `useSearchQuery` só dispara Solr se `query.length >= 2` e após 300 ms sem digitar
- [ ] Resultados locais aparecem **imediato** (sem debounce)

## Checklist — Fase C (UI busca)

- [ ] `SearchPage` — subtítulo com contagem híbrida
- [ ] Link “Buscar nas salvas” não necessário (híbrido unifica)
- [ ] Empty state híbrido: local vazio + online vazio → mensagem única

## Tipos

```typescript
export interface HybridSearchResult {
  local: LocalSearchResult[];
  remote: SearchResult[];
  counts: {
    local: number;
    remote: number;
    remoteExcluded: number; // dupes removidos
  };
}
```

## Testes (`packages/shared` ou `apps/web` vitest se existir)

- [ ] `normalizeSearchText('José')` === `normalizeSearchText('jose')`
- [ ] `filterOfflineChords` — match parcial artista
- [ ] `searchLocalChords` — dedup por slug
- [ ] Dedup remoto exclui slug presente no local

## CSS (mínimo)

- [ ] `.offline-library-filter` — input full width
- [ ] `.search-results__section-title` — “Salvas” / “Cifra Club”
- [ ] `.search-result-card--offline` — borda ou badge distinto
