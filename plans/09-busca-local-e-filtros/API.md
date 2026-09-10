# API — Plano 09: melhorias Solr (packages/shared)

## Escopo

| Camada | Arquivos |
|--------|----------|
| shared | `packages/shared/src/search/solr-client.ts` |
| shared | `packages/shared/src/search/normalize-query.ts` |
| shared | `packages/shared/src/search/dedupe-results.ts` |
| api | `apps/api/src/features/search-chords/api/search.handler.ts` (pass-through, sem mudança de contrato) |

> O endpoint `GET /api/search?q=…` **mantém o mesmo shape** `{ data: SearchResult[] }`. Melhorias são internas ao shared.

## Checklist

### `normalize-query.ts`

- [ ] `normalizeSearchQuery(q: string): string` — trim, colapsar `\s+`
- [ ] Opcional: detectar `"artista - música"` → priorizar termos (não alterar `q` enviado ao Solr na v1; documentar)

### `dedupe-results.ts`

- [ ] `dedupeSearchResults(results: SearchResult[]): SearchResult[]`
- [ ] Chave: `${artistSlug}/${songSlug}`
- [ ] Em conflito, manter maior `hits` (null hits → perder)

### `sort-results.ts`

- [ ] `sortSearchResultsByHits(results: SearchResult[]): SearchResult[]`
- [ ] `hits` desc; empate → `songName` localeCompare pt-BR

### `solr-client.ts`

- [ ] Pipeline: fetch → filter t=2 → map → dedupe → sort → slice(limit)
- [ ] Testes unitários com fixtures JSON

## Verificação (curl)

```bash
# API :3001
curl -s "http://localhost:3001/api/search?q=avenged+buried" | jq '[.data[] | {artist: .artistName, song: .songName, hits}]'

# Sem duplicatas de artistSlug/songSlug
curl -s "http://localhost:3001/api/search?q=coldplay" | jq '[.data | group_by(.artistSlug + "/" + .songSlug) | .[] | length] | max'
# esperado: 1
```

## Output esperado

- Resultados únicos por música
- Ordenados por popularidade (`hits`) quando disponível
- Mesmo contrato JSON para o web (sem breaking change)

## Fora do escopo (API)

- Novo endpoint `/api/search/local` — busca local é **100% client-side**
- Parâmetros Solr avançados (`fq`, `sort` remoto custom)
