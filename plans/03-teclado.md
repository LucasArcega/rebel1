# Plano 03: teclado

## Contexto

O mapeamento `keyboard: '/teclado'` já existe em `INSTRUMENT_PATHS`, mas o teclado é **raro** no Cifra Club. Na maioria das músicas não há transcrição dedicada.

## Status

| Item | Situação |
|------|----------|
| Path `/teclado/` no parser | Mapeado, não testado |
| Página no CC | Geralmente 404 |
| `priorityVersions` | Teclado quase nunca aparece |
| App | `?instrument=keyboard` → 404 (ex.: `coldplay/the-scientist`) |

## Problema

1. **Disponibilidade** — poucas músicas têm `/teclado/` no site
2. **Descoberta** — instrumentos podem existir no menu do CC sem estar em `priorityVersions` do SSR inicial
3. **Formato** — transcrição de teclado pode usar formato diferente de cifra com `<b>`

## Fase 3a — Descoberta

- [ ] Levantar músicas com transcrição de teclado no CC
- [ ] Verificar se aparecem em `priorityVersions` ou só no menu de instrumentos
- [ ] Definir estratégia: listar só versões do SSR vs. buscar menu adicional

## Fase 3b — Parser

- [ ] Testar `?instrument=keyboard` em música que tenha `/teclado/`
- [ ] Identificar formato SSR (acordes, partitura, texto)
- [ ] Implementar extrator se diferente de cifra violão
- [ ] Reutilizar `extractLyricChordContent` se formato for igual

## Fase 3c — Frontend

- [ ] Exibir teclado no seletor apenas quando existir (ver [04-ux-seletor-erros.md](./04-ux-seletor-erros.md))
- [ ] Mensagem clara quando instrumento não existe no CC

## Testes

- [ ] Encontrar ao menos 2–3 músicas com `/teclado/` válido no CC
- [ ] `?instrument=keyboard` retorna conteúdo
- [ ] Troca no seletor funciona quando listado

## Dependências

- [02-parser-letra-e-tablaturas.md](./02-parser-letra-e-tablaturas.md) — padrões de extração SSR
- [04-ux-seletor-erros.md](./04-ux-seletor-erros.md) — ocultar opções indisponíveis
