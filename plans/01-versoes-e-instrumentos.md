# Plano 01: versões da cifra (Principal / Simplificada)

## Contexto

O Cifra Club expõe versões da mesma música via `priorityVersions` no SSR. Cada versão tem `instrument.slug` e `label.slug`, que definem a URL.

## Status geral

| Caso | Situação |
|------|----------|
| Principal | ✅ Funciona |
| Simplificada | ✅ Funciona (Fase 1 concluída) |
| Letra | ❌ Ver [02-parser-letra-e-tablaturas.md](./02-parser-letra-e-tablaturas.md) |
| Baixo | ❌ Ver [02-parser-letra-e-tablaturas.md](./02-parser-letra-e-tablaturas.md) |
| Bateria / gaita | ⚠️ Parcial — ver [02-parser-letra-e-tablaturas.md](./02-parser-letra-e-tablaturas.md) |
| Teclado | ❌ Ver [03-teclado.md](./03-teclado.md) |
| UX do seletor / erros | ❌ Ver [04-ux-seletor-erros.md](./04-ux-seletor-erros.md) |
| Melhorias de produto | 📋 Ver [05-melhorias-produto.md](./05-melhorias-produto.md) |

## Fase 1 — Versões da mesma cifra ✅

### Como o Cifra Club diferencia

Mesmo instrumento (`cifra-group`), URLs distintas pelo `label.slug`:

```
/coldplay/the-scientist/              → Principal   (versionId 1351255)
/coldplay/the-scientist/simplificada/ → Simplificada (versionId 8799)
```

### API (`apps/api`) — concluído

- [x] `labelSlug` em `ChordVersion` (`principal`, `simplificada`, `original`)
- [x] Path com `label.slug` quando não for `principal`
- [x] Query `?version=simplificada` em `GET /artists/:artist/songs/:song`
- [x] `buildFetchUrl` combina `instrument` + `version`

### Frontend (`apps/web`) — concluído

- [x] `version?: string` em `ChordSearchParams`
- [x] `VersionSelector` navega com `?version=simplificada`
- [x] Offline: chave inclui `version`
- [x] Badge da versão ativa (ex.: "Simplificada")

### Testes — concluídos

- [x] `coldplay/the-scientist` Principal → `Dm7`, `Bb9`, `F`…
- [x] `coldplay/the-scientist` Simplificada → `C#m`, `A`, `E`…
- [x] Troca no seletor altera conteúdo e `versionId`
- [x] Versão salva offline separadamente da Principal

## Próximos planos

1. [02-parser-letra-e-tablaturas.md](./02-parser-letra-e-tablaturas.md) — letra, baixo e demais instrumentos
2. [03-teclado.md](./03-teclado.md) — teclado (quando existir no CC)
3. [04-ux-seletor-erros.md](./04-ux-seletor-erros.md) — seletor e mensagens de erro
4. [05-melhorias-produto.md](./05-melhorias-produto.md) — transposição, offline, scraping, etc.
