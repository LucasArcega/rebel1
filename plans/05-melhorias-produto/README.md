# Plano 05: melhorias de produto

**Status:** Parcial (5a implementado)
**Dependências:** 02 estável (para transposição em tablaturas)

## Contexto

Funcionalidades e limitações que não são bugs de parser, mas afetam a experiência.

## Critérios de aceite (por sub-fase)

Implementar em tickets/planos filhos ou fases incrementais:

### 5a — Transposição (prioridade 1)

- [x] UI para subir/descer semitons
- [x] Transposição aplicada no conteúdo exibido (cifra com acordes)
- [x] Versão offline salva sem alterar tom original
- [x] Capotraste (casas 0–11) com transposição efetiva

### 5b — Auto-scroll

- [ ] Play/pause de rolagem com velocidade ajustável

### 5c — Offline avançado

- [ ] Botão "Salvar para offline" explícito
- [ ] Indicador de quantidade de cifras salvas

## Fora do escopo

- Login / sync Cifra Club
- Contribuir/editar cifras
- App mobile nativo
- Player de áudio (link YouTube já existe)

## Sub-planos sugeridos (futuro)

| ID | Foco |
|----|------|
| 05a | Transposição |
| 05b | Auto-scroll |
| 05c | Offline avançado |
| 05d | Robustez scraping |
| 05e | Apresentação (fonte, tema, impressão) |
| 05f | Busca avançada |

## Arquivos de implementação

Criar `WEB.md` / `API.md` / `MANUAL.md` ao iniciar cada sub-fase.
