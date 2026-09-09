# Status dos planos — Cifra Hub

Índice global. Atualizar ao concluir um plano (Fase 6 do skill `implement-plan`).

| NN | Plano | Status | Dependências | Branch |
|----|-------|--------|--------------|--------|
| 01 | [versoes-e-instrumentos](./01-versoes-e-instrumentos/README.md) | **Implementado** | — | `cursor/fsd-cifra-app-8862` |
| 02 | [parser-letra-e-tablaturas](./02-parser-letra-e-tablaturas/README.md) | Planejado | — | — |
| 03 | [teclado](./03-teclado/README.md) | Planejado | 02 (parser) | — |
| 04 | [ux-seletor-erros](./04-ux-seletor-erros/README.md) | Planejado | 02, 03 | — |
| 05 | [melhorias-produto](./05-melhorias-produto/README.md) | Planejado | 02 estável | — |
| 06 | [self-hosted](./06-self-hosted/README.md) | Planejado (futuro) | 02 estável | — |

## Ordem sugerida

1. **02** — letra + baixo (maior impacto no seletor)
2. **04** — UX de erros (pode paralelizar parcialmente com 02)
3. **03** — teclado (baixa disponibilidade no CC)
4. **05** — melhorias de produto (transposição, auto-scroll, etc.)
5. **06** — self-hosted (após parser maduro): shared → mobile/desktop, deprecar API na nuvem

> **Nota:** `apps/api` (Node local) permanece **ativo** para web até o plano 06 ser executado. Não hospedar em produção.

## Legenda

| Status | Significado |
|--------|-------------|
| Planejado | Documentado, não iniciado |
| Em progresso | Branch aberta, implementação em andamento |
| Implementado | Critérios de aceite + testes verdes |
| Bloqueado | Dependência externa ou ambiente |
