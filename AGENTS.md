# AGENTS.md

Orientação para agentes no monorepo **Cifra Hub** (`apps/api` + `apps/web` + `packages/shared`).

Adaptado das convenções de planos/escopo do JourneyCore. Stack e pastas deste repo prevalecem.

## Comandos

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm test                 # shared + workspaces
npm run dev:api          # :3001
npm run dev:web          # :5173
```

Web: `npx vitest run` e `npx playwright test` em `apps/web`.

## Arquitetura

```
packages/shared   ← parser, tipos, Solr, harmonia, fingering
apps/api          ← BFF local (Hono), proxy Vite `/api` → :3001
apps/web          ← React FSD
```

`apps/api` é conveniência de dev. Self-hosted real fica para o plano 06 (parcial).

## Planos

Índice: `plans/STATUS.md`. Pasta = branch: `plans/{NN}-{slug}/`.

- README obrigatório; API e WEB em arquivos separados
- Sem itens opcionais no escopo (`.cursor/rules/plans-no-optional.mdc`)
- pt-BR em critérios e tickets (`.cursor/rules/issues-tickets-ptbr.mdc`)
- Entrega completa: skill `implement-plan`
- Só planejar: skill `enrich-plans`
- Merge sem gate: skill `fast-merge` → `main`

## Git

- Alvo padrão: `main`
- Branch de plano: `{NN}-{kebab-slug}`
- Commit / PR / merge só com pedido explícito, exceto `fast-merge`

## Escopo

Alterar só o que o plano ou o pedido exigir (`.cursor/rules/scope-guardian.mdc`).
