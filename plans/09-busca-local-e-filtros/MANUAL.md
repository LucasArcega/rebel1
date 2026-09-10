# MANUAL — Plano 09: busca local e filtros

## Pré-requisitos

```bash
npm run dev:api   # :3001
npm run dev:web   # :5173
```

Ter **≥ 3 cifras salvas** offline (abrir online antes): ex. Coldplay, SOAD, MPB.

## Fase A — Filtro biblioteca

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Abrir `/library` | Lista de salvas |
| 2 | Digitar “cold” no filtro | Só Coldplay (se salvo) |
| 3 | Digitar “xyzinexistente” | “Nenhuma cifra salva corresponde…” |
| 4 | Limpar filtro | Lista completa volta |
| 5 | Repetir na home, seção “Salvas no dispositivo” | Mesmo comportamento |

### Acentos

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Salvar música com acento no artista | — |
| 2 | Filtrar sem acento (ex. “jose”) | Encontra “José” |

## Fase B — Busca híbrida

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Buscar “buried avenged” com música já salva | Seção **Salvas** no topo |
| 2 | Verificar badge **Salva** | Presente no card local |
| 3 | Seção **Cifra Club** abaixo | Sem duplicar a mesma música |
| 4 | Header | “1 salva · N online” (N coerente) |
| 5 | Buscar música nunca salva | Só seção online |

### Debounce

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Digitar rápido “coldplay scientist” | Solr não dispara a cada tecla |
| 2 | Pausar 300 ms | Resultados online aparecem |

## Fase C — Qualidade Solr

| # | Passo | Esperado |
|---|-------|----------|
| 1 | `curl …/search?q=coldplay` | Sem `artistSlug/songSlug` repetido |
| 2 | Primeiros resultados | Tendência a maior `hits` |

## Atalho “Buscar online”

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Filtrar biblioteca com termo sem match | Link/botão “Buscar online” |
| 2 | Clicar | Navega para `/search?q=…` com termo preenchido |

## Comandos de teste

```bash
npm test -w @cifra-hub/shared
# filter-offline-chords.test.ts, dedupe-results.test.ts (após implementação)

npm run typecheck
```

## Regressão

| # | Verificar |
|---|-----------|
| 1 | Remover cifra salva ainda funciona |
| 2 | Histórico de buscas recentes intacto |
| 3 | Abrir cifra a partir de resultado local usa versão/instrumento corretos |
