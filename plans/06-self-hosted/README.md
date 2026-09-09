# Plano 06: arquitetura self-hosted (futuro)

**Status:** Planejado (documentação — sem implementação imediata)
**Dependências:** 02 estável (parser maduro antes de extrair)

## Contexto

Hoje o monorepo usa `apps/api` (Node/Hono) como **BFF local**: busca HTML do Cifra Club, parseia no servidor e entrega JSON ao `apps/web`. Isso existe principalmente por **CORS** — o browser não consegue `fetch` direto em `cifraclub.com.br` de forma confiável.

A visão de produto é **self-hosted**: nada de API hospedada em nuvem; o app roda na máquina ou dispositivo do usuário, com parser no cliente.

### Arquitetura atual (manter por hora)

```
apps/web (React)  →  apps/api (Node, localhost)  →  Cifra Club / Solr
                         ↑
                   vite proxy /api em dev
```

**Decisão:** manter `apps/api` até o plano 06 ser executado. Web continua funcionando com `npm run dev:api` + `npm run dev:web`.

### Arquitetura alvo

```
┌─────────────────────────────────────────────────────────┐
│  packages/shared                                        │
│  parser, tipos, buildFetchUrl, search client            │
└───────────────────────┬─────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  apps/mobile     apps/web (*)    apps/desktop (*)
  (React Native)  (limitado)      (Electron/Tauri)
        │               │               │
        └───────────────┴───────────────┘
                        │
              fetch direto CC + Solr
              (sem API na nuvem)

(*) web estática pura não busca CC ao vivo — ver WEB.md
```

## Objetivos

- [ ] Parser e tipos em pacote compartilhado (`packages/shared`)
- [ ] App mobile (RN) consome CC direto, sem `apps/api`
- [ ] Zero dependência de servidor hospedado pelo desenvolvedor
- [ ] `apps/api` marcado como legado / removido após migração
- [ ] Web: caminho documentado (desktop wrapper ou offline-only)

## Fora do escopo (este plano)

- Hospedar API em VPS, Railway, Cloudflare Workers, etc.
- Login / conta Cifra Club
- Contornar ToS do Cifra Club (documentar risco, não implementar bypass agressivo)

## Fases de implementação

| Fase | Nome | Entrega |
|------|------|---------|
| 6a | Extrair shared | `packages/shared` com parser + tipos |
| 6b | API usa shared | `apps/api` importa shared (sem duplicar) |
| 6c | Web usa shared (opcional) | Preparar web para modo client futuro |
| 6d | React Native | `apps/mobile` com fetch nativo |
| 6e | Deprecar API | Remover ou tornar opcional `apps/api` |
| 6f | Web self-hosted | Electron/Tauri ou PWA offline-only |

Detalhes: [MIGRATION.md](./MIGRATION.md), [MOBILE.md](./MOBILE.md), [WEB.md](./WEB.md).

## Critérios de aceite (plano completo)

- [ ] `packages/shared` exporta parser, tipos e URLs; testado isoladamente
- [ ] `apps/api` é thin wrapper (fetch + shared.parse) ou removido
- [ ] `apps/mobile` busca e parseia cifra sem Node
- [ ] Offline no mobile equivalente ao IndexedDB atual
- [ ] Documentação de deploy: sem backend na nuvem
- [ ] README raiz atualizado com arquitetura final

## Ordem em relação aos outros planos

| Quando | Plano |
|--------|-------|
| Agora | 02–05 com `apps/api` |
| Após 02 estável | Iniciar 6a + 6b |
| Quando houver demanda mobile | 6d |
| Por último | 6e + 6f |

## Arquivos de implementação

- [MIGRATION.md](./MIGRATION.md) — passos técnicos e estrutura de pastas
- [MOBILE.md](./MOBILE.md) — React Native / Expo
- [WEB.md](./WEB.md) — limitações CORS e alternativas web
