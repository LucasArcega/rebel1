# MANUAL — Plano 07: auto-scroll BPM

## Pré-requisitos

```bash
npm run dev:api   # :3001
npm run dev:web   # :5173
```

## Casos de teste

### 1. BPM manual

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Abrir `/artists/coldplay/songs/the-scientist` | Cifra visível |
| 2 | Definir BPM = **120** | — |
| 3 | Clicar **Rolar** | Scroll avança a cada **0,5s** (2 batidas/s) |
| 4 | Definir BPM = **60** | Intervalo entre rolagens ≈ **1s** |

### 2. Tap tempo

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Clicar **Tap** 4x em ritmo constante (~120 BPM) | Campo BPM ≈ 115–125 |
| 2 | Esperar 2s sem tocar | Sequência de tap reseta |
| 3 | Iniciar rolagem após tap | Velocidade coerente com BPM calculado |

### 3. Linhas por batida

| # | Passo | Esperado |
|---|-------|----------|
| 1 | BPM 120, linhas/batida = **1** | Rola ~1 linha por batida |
| 2 | Aumentar para **2** | Rola ~2 linhas por batida (mais rápido visualmente) |
| 3 | Reduzir para **0.5** | Rola meia linha por batida |

### 4. Persistência

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Ajustar BPM=90, linhas/batida=1.5 em uma música | — |
| 2 | Navegar para outra música e voltar | BPM e linhas/batida restaurados |

### 5. Fonte e tema

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Com rolagem ativa, mudar fonte para **Grande** | `scrollPerBeat` recalcula (mais pixels por batida) |
| 2 | Pausar, trocar tema | Rolagem não reinicia sozinha |

### 6. Fim da cifra

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Rolar até o final com BPM baixo (40) | Auto-scroll **pausa** ao chegar no fim |

## Músicas de referência

| Artista | Música | BPM sugerido (aprox.) | Uso |
|---------|--------|----------------------|-----|
| coldplay | the-scientist | 74 | Cifra lenta |
| legiao-urbana | tempo-perdido | 120 | Rock médio |
| avenged-sevenfold | buried-alive-- | 120 | Tablatura (scroll menos preciso — OK) |

> Tablaturas e letra pura: scroll por BPM ainda funciona, mas “linhas por batida” é calibração manual.

## Comandos de teste unitário

```bash
npm test -w @cifra-hub/shared
# deve incluir scroll-bpm.test.ts após implementação
```
