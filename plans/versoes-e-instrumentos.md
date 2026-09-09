# Plano: versões da cifra e instrumentos

## Contexto

Hoje o app lista versões via `priorityVersions` do SSR do Cifra Club, mas a troca só funciona de ponta a ponta para a versão **Principal** (`cifra-group`).

Problemas identificados:

| Caso | Situação atual |
|------|----------------|
| Principal | Funciona |
| Simplificada | Aparece no seletor, mas carrega a Principal |
| Letra | Aparece no seletor, parser não extrai |
| Baixo / bateria / gaita | Existem em algumas músicas, parser não extrai |
| Teclado | Raro; muitas músicas não têm transcrição |

## Fase 1 — Versões da mesma cifra (Principal / Simplificada)

### Como o Cifra Club diferencia

Mesmo instrumento (`cifra-group`), URLs distintas pelo `label.slug`:

```
/coldplay/the-scientist/              → Principal   (versionId 1351255)
/coldplay/the-scientist/simplificada/ → Simplificada (versionId 8799)
```

### Mudanças na API (`apps/api`)

- [ ] Incluir `labelSlug` em `ChordVersion` (`principal`, `simplificada`, `original`)
- [ ] Montar path com `label.slug` quando não for `principal`:
  - `principal` → `/{artist}/{song}/`
  - `simplificada` → `/{artist}/{song}/simplificada/`
- [ ] Aceitar query `?version=simplificada` em `GET /artists/:artist/songs/:song`
- [ ] `buildFetchUrl` deve combinar `instrument` + `version` (label slug)

### Mudanças no frontend (`apps/web`)

- [ ] Adicionar `version?: string` em `ChordSearchParams`
- [ ] `VersionSelector`: navegar com `?version=simplificada` quando `labelSlug !== 'principal'`
- [ ] `useChordQuery` / `chordRepository` / offline storage: chave inclui `version`
- [ ] Badge ou label mostrando versão ativa (ex.: "Simplificada")

### Testes

- [ ] `coldplay/the-scientist` Principal → acordes `Dm7`, `Bb9`, `F`…
- [ ] `coldplay/the-scientist` Simplificada → acordes `C#m`, `A`, `E`…
- [ ] Troca no seletor altera conteúdo e `versionId`
- [ ] Versão salva offline separadamente da Principal

## Fase 2 — Outros instrumentos (letra, baixo, etc.)

### Parser

- [ ] Letra: extrair bloco de texto puro do SSR (sem `[Primeira Parte]` / `<b>`)
- [ ] Tablatura baixo/bateria: detectar linhas `G|`, `D|`, `A|` sem exigir `#t1#` + `E|`
- [ ] Manter suporte atual a violão (`[Primeira Parte]` + `<b>`) e tablatura guitarra (`#t1#`)

### Navegação

- [ ] `?instrument=lyrics` → `/letra/`
- [ ] `?instrument=bass` → `/tabs-baixo/`
- [ ] Combinar com `?version=` quando aplicável

### Testes

- [ ] `avenged-sevenfold/buried-alive--` letra
- [ ] `avenged-sevenfold/buried-alive--` baixo
- [ ] `legiao-urbana/tempo-perdido` letra

## Fase 3 — Teclado (quando existir)

- [ ] Confirmar músicas com transcrição de teclado no Cifra Club
- [ ] Path `/teclado/` no parser (já mapeado, não testado)
- [ ] Exibir no seletor apenas quando existir na página
- [ ] Parser específico se o formato for diferente de cifra com acordes

> Teclado não aparece em `priorityVersions` na maioria das músicas. Pode exigir descoberta via menu de instrumentos do site, não só SSR inicial.

## Ordem de implementação

1. Fase 1 (Simplificada/Principal) — maior impacto, menor risco
2. Fase 2 (letra + tablaturas)
3. Fase 3 (teclado, conforme disponibilidade)
