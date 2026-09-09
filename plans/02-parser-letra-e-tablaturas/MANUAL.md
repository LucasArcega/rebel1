# MANUAL — Plano 02

## Pré-requisitos

```bash
npm run dev:api   # :3001
npm run dev:web   # :5173
```

## Casos de teste

| Artista | Música | Query | Esperado |
|---------|--------|-------|----------|
| coldplay | the-scientist | `?instrument=lyrics` | Letra sem acordes |
| avenged-sevenfold | buried-alive-- | `?instrument=lyrics` | Letra |
| legiao-urbana | tempo-perdido | `?instrument=lyrics` | Letra |
| avenged-sevenfold | buried-alive-- | `?instrument=bass` | Tab baixo `G\|` |
| avenged-sevenfold | buried-alive-- | `?instrument=drums` | Tab bateria (regressão) |

## Smoke UI

| # | Passo | Resultado esperado |
|---|-------|-------------------|
| 1 | Abrir música com versão "Letra" no seletor | Conteúdo de letra renderizado |
| 2 | Clicar versão Baixo (se listada) | Tablatura de baixo visível |
| 3 | Voltar para Principal | Cifra com acordes normal |
