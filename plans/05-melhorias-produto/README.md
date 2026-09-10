# Plano 05: melhorias de produto

**Status:** Implementado
**Dependências:** 02

## Critérios de aceite

### 5a — Transposição + capo ✅

- [x] UI para subir/descer semitons
- [x] Transposição no conteúdo exibido
- [x] Offline salva original
- [x] Capotraste (casas 0–11)

### 5b — Auto-scroll ✅ (será evoluído pelo plano 07)

- [x] Play/pause de rolagem
- [x] Velocidade ajustável (ms) — **legado**; ver [07-auto-scroll-bpm](../07-auto-scroll-bpm/README.md)

### 5c — Offline avançado ✅

- [x] Botão "Salvar offline" explícito
- [x] Contador de cifras salvas no header (`Salvas N`)

### 5d — Robustez scraping ✅

- [x] Testes unitários do parser (`packages/shared`, vitest)
- [x] Log quando parser falha (HTML 200)

### 5e — Apresentação ✅

- [x] Tamanho de fonte (sm/md/lg)
- [x] Tema claro/escuro
- [x] Impressão (`@media print`)

### 5f — Busca ✅

- [x] Histórico de buscas recentes (localStorage)
- [x] Formulário na página `/search` + contagem de resultados
