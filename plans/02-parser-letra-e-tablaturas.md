# Plano 02: parser — letra e tablaturas

## Contexto

A API busca o HTML do Cifra Club e extrai o conteúdo dos chunks SSR (`self.__next_f.push`). O parser atual cobre dois formatos:

1. **Cifra com acordes** — `[Primeira Parte]` + tags `<b>`
2. **Tablatura guitarra** — marcador `#t1#` + linhas começando em `E|`

Outros formatos existem no site mas **não são extraídos**, gerando 404 com `"Não foi possível extrair a cifra do HTML"`.

## Status por instrumento

| Instrumento | URL (`?instrument=`) | Página CC | Parser | Exemplo testado |
|-------------|----------------------|-----------|--------|-----------------|
| Violão (cifra) | — | `/{artist}/{song}/` | ✅ | `coldplay/the-scientist` |
| Letra | `lyrics` | `/letra/` | ❌ | `coldplay/the-scientist`, `legiao-urbana/tempo-perdido` |
| Baixo | `bass` | `/tabs-baixo/` | ❌ | `avenged-sevenfold/buried-alive--` |
| Bateria | `drums` | `/tabs-bateria/` | ⚠️ Só formato `E\|` | `avenged-sevenfold/buried-alive--` ✅ |
| Gaita | `harmonica` | `/tabs-gaita/` | ⚠️ Só formato `E\|` | `avenged-sevenfold/buried-alive--` ✅ |
| Guitarra (tab) | `guitar` | `/tabs-guitarra/` | ⚠️ Depende da página existir | `buried-alive--` → 404 no CC |
| Ukulele | `ukulele` | `/ukulele/` | ❓ Não testado | — |
| Viola | `viola` | `/viola/` | ❓ Não testado | — |
| Partituras | `sheet` | `/partituras/` | ❓ Não testado | — |
| Guitar Pro | `guitarpro` | `/guitarpro/` | ❓ Não testado | — |

> **Nota:** bateria e gaita funcionam quando a tablatura usa linhas `E|`, `B|`, etc. (formato guitarra). O plano anterior tratava ambos como "não extrai" — isso estava impreciso.

## Fase 2a — Letra

### Problema

Páginas `/letra/` retornam texto puro no SSR, sem `[Primeira Parte]` nem `<b>`. O `extractLyricChordContent` retorna `null`.

### Mudanças no parser (`apps/api/src/entities/chord/lib/parser.ts`)

- [ ] Novo extrator `extractPlainLyricsContent` para bloco de letra sem acordes
- [ ] Detectar formato por instrumento/contexto (quando `instrument === 'lyrics'`)
- [ ] Preservar quebras de linha e seções (`[Intro]`, estrofes)

### Navegação

- [x] `?instrument=lyrics` → `/letra/` (API já monta URL correta)
- [ ] Frontend: seletor já navega; falta parser responder

### Testes

- [ ] `coldplay/the-scientist?instrument=lyrics`
- [ ] `avenged-sevenfold/buried-alive--?instrument=lyrics`
- [ ] `legiao-urbana/tempo-perdido?instrument=lyrics`

## Fase 2b — Baixo e tablaturas alternativas

### Problema

`extractTablatureContent` exige `#t1#` **e** linha iniciando em `E|`. Tablaturas de baixo costumam começar em `G|`, `D|`, `A|`.

### Mudanças no parser

- [ ] Detectar tablatura por padrão `^[EADGB]\|` (ou similar) sem exigir `#t1#`
- [ ] Suportar múltiplas linhas de cordas (`G|`, `D|`, `A|`, `E|`)
- [ ] Não quebrar extração atual de guitarra (`#t1#` + `E|`)

### Navegação

- [x] `?instrument=bass` → `/tabs-baixo/` (API já monta URL correta)

### Testes

- [ ] `avenged-sevenfold/buried-alive--?instrument=bass`
- [ ] Validar que bateria/gaita existentes continuam funcionando

## Fase 2c — Demais instrumentos

### Problema

Ukulele, viola, partituras e Guitar Pro estão mapeados em `INSTRUMENT_PATHS`, mas não foram validados de ponta a ponta.

### Tarefas

- [ ] Testar cada instrumento com músicas conhecidas no CC
- [ ] Documentar formato SSR de cada um
- [ ] Adicionar extrator específico se necessário
- [ ] Tablatura guitarra separada: só exibir no seletor quando a página existir (ver [04-ux-seletor-erros.md](./04-ux-seletor-erros.md))

### Testes sugeridos

- [ ] Encontrar músicas com `/ukulele/`, `/viola/`, `/partituras/`, `/guitarpro/` no CC
- [ ] Confirmar comportamento quando página retorna 404 no CC (não é bug do parser)

## Ordem de implementação

1. Letra (maior demanda no seletor)
2. Baixo (segundo mais comum)
3. Validar demais instrumentos
