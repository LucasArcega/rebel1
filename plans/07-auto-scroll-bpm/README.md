# Plano 07: auto-scroll baseado em BPM

**Status:** Planejado
**Dependências:** 05 (auto-scroll atual), 01–02 (cifra com linhas parseáveis)

## Contexto

Hoje o auto-scroll usa um **slider de velocidade** (intervalo fixo em ms entre cada pixel rolado). Isso não acompanha o **tempo da música** — o músico precisa ajustar manualmente enquanto toca.

O objetivo é sincronizar a rolagem com **BPM** (batidas por minuto), de forma que a cifra avance uma quantidade previsível **a cada batida**.

### Situação atual

```typescript
// apps/web/src/features/auto-scroll-chord/model/use-auto-scroll.ts
// scrollTop += 1 a cada `speed` ms (20–120)
```

### Situação alvo

```
intervalo entre batidas = 60_000 / bpm  (ms)
a cada batida → rolar N pixels (configurável ou derivado da fonte)
```

O Cifra Club **não expõe BPM** no SSR que parseamos hoje (`ChordSong` não tem campo `bpm`). O BPM será **informado pelo usuário** ou calculado via **tap tempo**.

## Critérios de aceite

- [ ] Controle de BPM (input numérico + slider, faixa ex.: 40–240)
- [ ] **Tap tempo**: 3+ toques calculam BPM médio e preenchem o campo
- [ ] Rolagem sincronizada: a cada batida, `scrollTop += pixelsPerBeat`
- [ ] Ajuste de **pixels por batida** (ou “linhas por batida”) para calibrar à densidade da cifra
- [ ] Play/pause mantidos; ao pausar, retoma na mesma posição
- [ ] Preferências salvas por música (`artist/song`) em `localStorage`
- [ ] Substituir o slider de “velocidade (ms)” pelo modo BPM (o modo antigo pode ficar como fallback opcional)

## Fora do escopo

- Detecção automática de BPM via áudio/YouTube
- Metrônomo sonoro (clique audível) — plano futuro opcional
- Parser extrair BPM do Cifra Club (campo inexistente hoje no SSR)
- Sincronização com vídeo do YouTube embutido

## Fórmula de referência

```
beatIntervalMs = 60_000 / bpm
scrollPerBeat  = lineHeight * linesPerBeat   // linesPerBeat default: 1

// a cada beatIntervalMs:
element.scrollTop += scrollPerBeat
```

Calibração fina: `linesPerBeat` de 0.5 a 4 (step 0.25).

## Arquivos de implementação

- [WEB.md](./WEB.md) — hook, UI, persistência
- [MANUAL.md](./MANUAL.md) — casos de teste manual

## Relação com outros planos

| Plano | Relação |
|-------|---------|
| 05 (5b) | Substitui/evolui o auto-scroll por velocidade fixa |
| 05 (5e) | `fontSize` afeta `lineHeight` → recalcular `scrollPerBeat` |
| 06 | Lógica pura de BPM pode ir em `packages/shared/lib/scroll-bpm.ts` se reutilizada no mobile |

## Ordem sugerida de implementação

1. `shared/lib/scroll-bpm.ts` — funções puras (`beatIntervalMs`, `tapTempo`, média)
2. `use-auto-scroll-bpm.ts` — substituir ou conviver com `use-auto-scroll.ts`
3. UI: BPM input, tap tempo, lines per beat
4. Persistência por música
5. Remover ou ocultar slider de velocidade legado
