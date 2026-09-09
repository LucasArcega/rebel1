# Status dos planos — Cifra Hub

Índice global. Atualizar ao concluir um plano (Fase 6 do skill `implement-plan`).

| NN | Plano | Status | Dependências | Branch |
|----|-------|--------|--------------|--------|
| 01 | [versoes-e-instrumentos](./01-versoes-e-instrumentos/README.md) | **Implementado** | — | `cursor/fsd-cifra-app-8862` |
| 02 | [parser-letra-e-tablaturas](./02-parser-letra-e-tablaturas/README.md) | **Implementado** | — | `cursor/fsd-cifra-app-8862` |
| 03 | [teclado](./03-teclado/README.md) | Parcial | 02 | — |
| 04 | [ux-seletor-erros](./04-ux-seletor-erros/README.md) | **Implementado** | 02 | `cursor/fsd-cifra-app-8862` |
| 05 | [melhorias-produto](./05-melhorias-produto/README.md) | Parcial (5a) | 02 | `cursor/fsd-cifra-app-8862` |
| 06 | [self-hosted](./06-self-hosted/README.md) | Planejado (futuro) | 02 estável | — |

## Ordem sugerida

1. ~~**02** — letra + baixo~~ ✅
2. ~~**04** — UX de erros~~ ✅
3. **03** — teclado (depende de músicas com `/teclado/` no CC)
4. **05** — auto-scroll, offline avançado (5b–5f)
5. **06** — self-hosted (após parser maduro)

## Legenda

| Status | Significado |
|--------|-------------|
| Planejado | Documentado, não iniciado |
| Em progresso | Branch aberta, implementação em andamento |
| Implementado | Critérios de aceite + testes verdes |
| Parcial | Parte entregue; ver README do plano |
| Bloqueado | Dependência externa ou ambiente |

## Entregas recentes

- Parser: letra, baixo, tablaturas genéricas
- API: códigos de erro `PARSE_FAILED`, `NOT_FOUND_ON_CC`
- UI: mensagens de erro específicas
- Transposição + capotraste na visualização de cifras
- Busca: formulário na página de resultados + contagem

> **Nota:** `apps/api` (Node local) permanece ativo para web. Plano 06 cobre migração self-hosted.
