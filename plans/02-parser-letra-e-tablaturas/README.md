# Plano 02: parser — letra e tablaturas

**Status:** Implementado
**Dependências:** nenhuma

## Contexto

A API extrai conteúdo dos chunks SSR do Cifra Club. O parser cobre cifra com acordes (`[Primeira Parte]` + `<b>`) e tablatura guitarra (`#t1#` + `E|`). Letra e baixo falham.

## Critérios de aceite

- [x] `?instrument=lyrics` retorna letra para músicas com `/letra/` no CC
- [x] `?instrument=bass` retorna tablatura de baixo (`G|`, `D|`, `A|`)
- [x] Bateria/gaita existentes continuam funcionando (formato `E|`)
- [x] Testes curl dos 3 casos documentados em MANUAL.md passam

## Fora do escopo

- Teclado → plano 03
- UX do seletor → plano 04
- Ukulele/viola/partituras/guitarpro → validar na Fase 2c; ticket separado se formato for distinto

## Status por instrumento

| Instrumento | Parser | Exemplo |
|-------------|--------|---------|
| Violão (cifra) | ✅ | `coldplay/the-scientist` |
| Letra | ❌ | `legiao-urbana/tempo-perdido` |
| Baixo | ❌ | `avenged-sevenfold/buried-alive--` |
| Bateria / gaita | ⚠️ formato `E\|` | `buried-alive--` ✅ |

## Arquivos de implementação

- [API.md](./API.md)
- [MANUAL.md](./MANUAL.md)

## Ordem interna

1. Letra (2a)
2. Baixo (2b)
3. Demais instrumentos (2c)
