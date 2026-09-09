# MIGRATION — Plano 06

## Fase 6a — Extrair `packages/shared`

### Estrutura proposta

```
packages/
  shared/
    package.json          # @cifra-hub/shared
    src/
      chord/
        parser.ts         # de apps/api/src/entities/chord/lib/parser.ts
        types.ts          # ChordSong, ChordVersion, InstrumentSlug
        urls.ts           # buildFetchUrl, buildVersionPath
      search/
        solr-client.ts    # de apps/api
        types.ts
      index.ts
```

### Checklist

- [x] Criar workspace `packages/shared` no root `package.json`
- [x] Mover parser e tipos (fonte única da verdade)
- [x] Garantir que shared **não** importa Hono, Node-only APIs desnecessárias
- [x] `fetch` para CC/Solr via `globalThis.fetch`
- [x] Testes unitários do parser em shared (vitest)

### Verificação

```bash
npm run typecheck -w @cifra-hub/shared
# testes do parser com fixtures HTML gravados (sem rede)
```

---

## Fase 6b — API usa shared

`apps/api` vira camada fina:

```typescript
// get-chord.handler.ts (futuro)
const html = await fetch(url, { headers: BROWSER_HEADERS });
const parsed = parseCifraClubHtml(html, ...);
```

### Checklist

- [x] Remover duplicata de parser em `apps/api`
- [x] API importa `@cifra-hub/shared`
- [x] Comportamento idêntico aos testes curl atuais (regressão)
- [x] README: API é **dev convenience**, não destino de produção

---

## Fase 6c — Web preparada (opcional, antes do mobile)

- [ ] `apps/web` importa tipos de `@cifra-hub/shared`
- [ ] Abstrair `chordApi` atrás de `ChordRepository` com duas implementações:
  - `HttpChordRepository` — chama `/api` (hoje)
  - `DirectChordRepository` — fetch CC + parse shared (só onde CORS permitir ou em build desktop)

Não ativar `DirectChordRepository` na web estática até Fase 6f.

---

## Fase 6d — React Native

Ver [MOBILE.md](./MOBILE.md).

---

## Fase 6e — Deprecar `apps/api`

### Checklist

- [ ] Mobile (e/ou desktop) cobre fluxos principais
- [ ] Remover `apps/api` do `npm run dev` padrão ou marcar `deprecated` no README
- [ ] Atualizar `vite.config.ts` — remover proxy se web migrar para desktop-only
- [ ] Atualizar planos 01–05 e skill `implement-plan` (comandos curl → shared tests)

### Critério

Só remover `apps/api` quando **nenhum** target de produção depender dele.

---

## Fase 6f — Web self-hosted

Ver [WEB.md](./WEB.md).

---

## Fixtures para testes offline do parser

Gravar HTML de referência em `packages/shared/fixtures/`:

| Arquivo | Origem |
|---------|--------|
| `the-scientist-principal.html` | Principal |
| `the-scientist-simplificada.html` | Simplificada |
| `tempo-perdido-letra.html` | Letra (após plano 02) |
| `buried-alive-bass.html` | Baixo (após plano 02) |

Testes não dependem de rede nem de API rodando.
