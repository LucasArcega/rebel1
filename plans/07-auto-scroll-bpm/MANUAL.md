# MANUAL — Plano 07: auto-scroll BPM + GetSongBPM

## Pré-requisitos

```bash
# apps/api/.env
GETSONGBPM_API_KEY=sua_chave   # obter em https://getsongbpm.com/api

npm run dev:api   # :3001
npm run dev:web   # :5173
```

## API (curl)

### BPM encontrado

```bash
curl -s "http://localhost:3001/api/bpm?artist=ac-dc&song=highway-to-hell&artistName=AC%2FDC&songName=Highway%20to%20Hell"
```

Esperado: JSON com `data.bpm` numérico, `data.source: "getsongbpm"`, `data.attribution.url`.

### BPM não encontrado

```bash
curl -s -w "\nHTTP %{http_code}\n" \
  "http://localhost:3001/api/bpm?artist=advan-haschi&song=caravana-dos-ciganos&artistName=Advan%20Haschi&songName=Caravana%20Dos%20Ciganos"
```

Esperado: HTTP 404 ou 200 com fallback documentado — **MPB pode não estar no catálogo**.

### Sem API key

```bash
# com GETSONGBPM_API_KEY vazio
curl -s -w "\nHTTP %{http_code}\n" "http://localhost:3001/api/bpm?artist=coldplay&song=the-scientist&artistName=Coldplay&songName=The%20Scientist"
```

Esperado: HTTP 501/503; web deve mostrar “BPM não configurado” ou cair em tap/manual.

## Casos de teste (browser)

### 1. BPM automático (GetSong)

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Abrir `/artists/ac-dc/songs/highway-to-hell` (ou coldplay/the-scientist) | Sidebar carrega |
| 2 | Aguardar lookup BPM | Campo BPM preenchido; badge **GetSong** |
| 3 | Verificar sidebar | Link **BPM via GetSongBPM** visível |
| 4 | Clicar link | Abre getsongbpm.com em nova aba |

### 2. BPM manual (fallback)

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Abrir música MPB sem catálogo (ex. caravana dos ciganos) | Mensagem “BPM não encontrado” |
| 2 | Informar BPM = **120** manualmente | Badge **Manual** |
| 3 | Clicar **Rolar** | Scroll a cada ~0,5s |

### 3. Tap tempo

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Clicar **Tap** 4x em ~120 BPM | Campo ≈ 115–125; badge **Tap** |
| 2 | Esperar 2s sem tocar | Sequência reseta |
| 3 | Tap após GetSong ter preenchido | Tap sobrescreve; badge **Tap** |

### 4. Rolagem sincronizada

| # | Passo | Esperado |
|---|-------|----------|
| 1 | BPM **120**, linhas/batida **1** | ~1 linha por batida |
| 2 | BPM **60** | Intervalo ≈ 1s entre rolagens |
| 3 | Linhas/batida **2** | Rolagem mais rápida visualmente |

### 5. Persistência

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Ajustar BPM=90, linhas=1.5, source manual | — |
| 2 | Navegar outra música e voltar | Valores restaurados |
| 3 | Recarregar página | Prefs mantidas; **não** refetch GetSong se manual/tap |

### 6. Fonte e fim da cifra

| # | Passo | Esperado |
|---|-------|----------|
| 1 | Rolagem ativa + fonte **Grande** | `scrollPerBeat` recalcula |
| 2 | BPM 40 até o fim | Auto-scroll **pausa** no final |

## Músicas de referência

| Artista | Slug | Música | GetSong (esperado) | BPM ref. |
|---------|------|--------|-------------------|----------|
| ac-dc | ac-dc | highway-to-hell | Provável match | ~120 |
| coldplay | coldplay | the-scientist | Provável match | ~74 |
| system-of-a-down | system-of-a-down | lonely-day | Provável match | ~90–120 |
| advan-haschi | advan-haschi | caravana-dos-ciganos | Provável miss | tap/manual |
| legiao-urbana | legiao-urbana | tempo-perdido | Variável | ~120 |

> Tablaturas: scroll por BPM funciona; “linhas por batida” é calibração manual.

## Comandos de teste unitário

```bash
npm test -w @cifra-hub/shared
# scroll-bpm.test.ts + getsongbpm normalize (após implementação)

npm run typecheck
```

## Checklist de conformidade GetSongBPM

- [ ] Link para https://getsongbpm.com visível no app quando BPM veio da API (não exercido — sem `GETSONGBPM_API_KEY` neste ambiente)
- [x] API key apenas no servidor (`apps/api/.env`)
- [x] Cache implementado para respeitar rate limit (3k/h)
