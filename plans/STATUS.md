# Status dos planos — Cifra Hub

Índice global dos planos implementados, parciais e planejados.

| NN | Plano | Status | Branch |
|----|-------|--------|--------|
| 01 | [versoes-e-instrumentos](./01-versoes-e-instrumentos/README.md) | **Implementado** | `cursor/plan-features-complete-8862` |
| 02 | [parser-letra-e-tablaturas](./02-parser-letra-e-tablaturas/README.md) | **Implementado** | `cursor/plan-features-complete-8862` |
| 03 | [teclado](./03-teclado/README.md) | **Implementado** | `cursor/plan-features-complete-8862` |
| 04 | [ux-seletor-erros](./04-ux-seletor-erros/README.md) | **Implementado** | `cursor/plan-features-complete-8862` |
| 05 | [melhorias-produto](./05-melhorias-produto/README.md) | **Implementado** | `cursor/plan-features-complete-8862` |
| 06 | [self-hosted](./06-self-hosted/README.md) | **Parcial** (Node mantido) | `cursor/plan-features-complete-8862` |
| 07 | [auto-scroll-bpm](./07-auto-scroll-bpm/README.md) | **Implementado** | `cursor/plan-07-auto-scroll-bpm-974b` |
| 08 | [dicionario-acordes-variacoes](./08-dicionario-acordes-variacoes/README.md) | **Em revisão** | `codex/08-dicionario-acordes-variacoes-impl` |
| 09 | [busca-local-e-filtros](./09-busca-local-e-filtros/README.md) | Planejado | — |
| 10 | [base-ui-design-system](./10-base-ui-design-system/README.md) | Planejado | — |

## Próximos planos

**09 — busca local e filtros** — filtro instantâneo na biblioteca offline; busca híbrida (salvas primeiro + Solr deduplicado).

**10 — Base UI e design system** — primitives acessíveis, tokens e layouts compartilhados; primeira migração no hover e seletor compacto de formas dos acordes.

## Arquitetura final

```
packages/shared   ← parser, tipos, Solr, testes vitest
apps/api          ← thin wrapper local (dev web / CORS)
apps/web          ← React FSD completo
apps/mobile       ← fetchChordDirect (self-hosted, sem API)
```

## Comandos

```bash
npm install
npm test          # vitest em packages/shared
npm run typecheck
npm run build
npm run dev:api   # :3001
npm run dev:web   # :5173
```

> `apps/api` é **conveniência de dev** para web. Self-hosted real: `apps/mobile/src/chord-client.ts`.
