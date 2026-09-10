# Plano 09: busca local e filtros

**Status:** Planejado  
**Prioridade:** 2 (UX de descoberta)  
**Dependências:** 05 (offline + busca básica), 05c (biblioteca IndexedDB)

## Contexto

Hoje existem dois fluxos de descoberta desconectados:

| Fluxo | Onde | Problema |
|-------|------|----------|
| **Busca online** | `/`, `/search` → Solr Cifra Club | Query ingênua, sem dedup, sem priorizar salvas |
| **Biblioteca offline** | `/library`, home | Lista completa, **sem filtro** |

Com o crescimento da biblioteca local, o usuário perde cifras salvas no scroll. Na busca online, músicas já abertas não aparecem primeiro — parece que o app “esqueceu” o histórico offline.

### Situação atual

```typescript
// packages/shared/src/search/solr-client.ts
// q=query, filtra t=2, limit 20, sem dedup nem sort explícito

// apps/web — OfflineLibraryList
// offlineDb.getAll() → renderiza tudo, zero filtro
```

### Situação alvo

```
Input único de busca
  ├── 1. Matches instantâneos no IndexedDB (badge "Salva")
  └── 2. Resultados Solr deduplicados e ordenados

/library e home
  └── Campo "Filtrar salvas…" (client-side, instantâneo)
```

## Critérios de aceite

### Fase A — Filtro local (biblioteca)

- [ ] Campo de filtro em `/library` e na seção “Salvas no dispositivo” da home
- [ ] Filtra por **artista**, **música**, **versão** e **instrumento** (case-insensitive, ignora acentos)
- [ ] Atualização instantânea enquanto digita (sem submit)
- [ ] Estado vazio: “Nenhuma cifra salva corresponde a …”
- [ ] Atalho: “Buscar online” preenchendo o formulário de busca com o termo atual

### Fase B — Busca híbrida (local + online)

- [ ] Ao buscar (`/search?q=…`), exibir **primeiro** resultados locais que batem com a query
- [ ] Badge **Salva** / **Offline** nos itens locais
- [ ] Resultados Solr abaixo, **sem duplicar** músicas já listadas como salvas (chave: `artistSlug + songSlug`)
- [ ] Contagem separada: “X salvas · Y online”
- [ ] Debounce de 300 ms na digitação antes de chamar Solr (evitar spam)

### Fase C — Qualidade da busca online

- [ ] Dedup Solr por `artistSlug/songSlug` (manter entrada com maior `hits`)
- [ ] Ordenação padrão: `hits` desc
- [ ] Normalização de query: trim, colapsar espaços, opcional `"artista - música"`
- [ ] Limite configurável (default 20, max 50 — já suportado na API)

## Fora do escopo

- Busca full-text **dentro** do conteúdo da cifra (letra/acordes)
- Índice FTS no IndexedDB (scan em memória basta para centenas de itens)
- Filtros avançados Solr (gênero, década, tipo artista/album)
- Sugestões/autocomplete remoto estilo Google
- Sincronizar biblioteca entre dispositivos

## Decisões

| Decisão | Escolha | Motivo |
|---------|---------|--------|
| Onde filtrar local | **Browser** (IndexedDB → array → filter) | Volume pequeno; zero latência |
| Normalização | `normalize('NFD')` + remove diacríticos | “Jose” encontra “José” |
| Chave de dedup | `artistSlug/songSlug` | Versões diferentes = mesma música na busca |
| Match local parcial | `includes` em artista OU música | Simples e previsível |

## Arquivos de implementação

- [WEB.md](./WEB.md) — filtros, busca híbrida, UI
- [API.md](./API.md) — melhorias Solr em `packages/shared`
- [MANUAL.md](./MANUAL.md) — casos de teste

## Relação com outros planos

| Plano | Relação |
|-------|---------|
| 05 (5c, 5f) | Evolui biblioteca offline e busca existentes |
| 07 | Independente |
| 08 | Independente |

## Ordem sugerida de implementação

1. `packages/shared` — `normalizeSearchText`, `dedupeSearchResults`, `sortSearchResults`
2. `filterOfflineChords` + testes unitários
3. UI filtro biblioteca (`/library`, home)
4. `searchLocalChords` + integração em `SearchResultsList`
5. Debounce + contagem híbrida + dedup Solr na API/shared
