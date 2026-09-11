# Plano 07: auto-scroll baseado em BPM

**Status:** Em progresso
**Dependências:** 05 (auto-scroll atual), 01–02 (cifra com linhas parseáveis)

## Contexto

Hoje o auto-scroll usa um **slider de velocidade** (intervalo fixo em ms entre cada pixel rolado). Isso não acompanha o **tempo da música** — o músico precisa ajustar manualmente enquanto toca.

O objetivo é sincronizar a rolagem com **BPM** (batidas por minuto), de forma que a cifra avance uma quantidade previsível **a cada batida**.

### Situação atual

```typescript
// apps/web/src/features/auto-scroll-chord/model/use-auto-scroll.ts
// window.scrollBy a cada `speed` ms (20–120) — legado do plano 05
```

### Situação alvo

```
intervalo entre batidas = 60_000 / bpm  (ms)
a cada batida → rolar N pixels (configurável ou derivado da fonte)
BPM inicial → GetSongBPM (artist + song) via apps/api
fallback → tap tempo + input manual
```

## Pesquisa de fontes de BPM (2026)

| Fonte | BPM por nome? | Situação |
|-------|---------------|----------|
| **Cifra Club (SSR/parser)** | Não | `ChordSong` não traz BPM |
| **Spotify `/audio-features`** | Sim (via `tempo`) | **403** para apps novos (nov/2024+) |
| **[GetSongBPM](https://getsongbpm.com/api)** | Sim | **Escolhida** — API REST, busca por artista + título |
| [FreqBlog](https://freqblog.com/) | Sim | Alternativa futura (quota mensal) |
| [AcousticBrainz](https://acousticbrainz.org/) | Sim | Requer MusicBrainz ID; bulk CC0, projeto parado |
| [TuneBat](https://tunebat.com/) | Sim | Sem API oficial pública |

### GetSongBPM — decisão e limites

- **Gratuito hoje**, com API key; **não há garantia contratual de “grátis para sempre”**
- **Obrigatório:** link de volta para [GetSongBPM](https://getsongbpm.com) no app (site, UI ou listing) — sob pena de suspensão da chave
- **Rate limit:** ~3.000 requisições/hora por chave; exceder bloqueia a chave por 1 h
- **Base URL:** `https://api.getsongbpm.com`
- **Auth:** `api_key` (query) ou header `X-API-KEY`
- **Cobertura:** forte em catálogo internacional; **MPB/gospel/sertanejo** pode faltar ou errar → tap tempo continua essencial

## Critérios de aceite

### BPM automático (GetSongBPM)

- [x] Endpoint `GET /api/bpm?artist={slug}&song={slug}` no `apps/api` (proxy — **nunca** expor API key no web)
- [x] Variável de ambiente `GETSONGBPM_API_KEY` (documentada em `.env.example`)
- [x] Resposta normalizada: `{ bpm, key?, timeSig?, source: 'getsongbpm' | 'cache' }` ou `404` quando não encontrado
- [x] Ao abrir uma música, buscar BPM e **pré-preencher** o controle de auto-scroll
- [x] Estados UI: carregando / encontrado / não encontrado / erro de rede
- [x] **Backlink obrigatório** visível quando BPM veio do GetSong (ex.: rodapé da sidebar “BPM: GetSongBPM”)
- [x] Cache por música (`artistSlug/songSlug`) em `localStorage` + cache curto no servidor (evitar rate limit)

### Rolagem sincronizada

- [x] Controle de BPM (input numérico + slider, faixa 40–240)
- [x] **Tap tempo**: 3+ toques calculam BPM médio e preenchem o campo (sobrescreve valor buscado)
- [x] Rolagem sincronizada: a cada batida, `scrollTop += pixelsPerBeat`
- [x] Ajuste de **linhas por batida** (0.5–4, step 0.25) para calibrar densidade da cifra
- [x] Play/pause mantidos; ao pausar, retoma na mesma posição
- [x] Preferências salvas por música (`bpm`, `linesPerBeat`, `bpmSource: 'getsong' | 'tap' | 'manual'`)
- [x] Substituir slider de “velocidade (ms)” pelo modo BPM (opção A — só BPM)

## Fora do escopo

- Detecção automática de BPM via áudio/YouTube
- Metrônomo sonoro (clique audível) — plano futuro
- Parser extrair BPM do Cifra Club (campo inexistente no SSR)
- Sincronização com vídeo do YouTube embutido
- Integração primária com FreqBlog, AcousticBrainz ou Spotify
- Modo legado “velocidade em ms” (toggle manual — ver WEB.md opção B, **não** implementar salvo pedido)

## Fórmula de referência

```
beatIntervalMs = 60_000 / bpm
scrollPerBeat  = lineHeight * linesPerBeat   // linesPerBeat default: 1

// a cada beatIntervalMs:
window.scrollBy(0, scrollPerBeat)
```

Calibração fina: `linesPerBeat` de 0.5 a 4 (step 0.25).

## Fluxo de dados

```
SongPage carrega cifra
    → GET /api/bpm?artist=…&song=…
        → cache servidor (opcional, TTL 24h)
        → GetSongBPM GET /search/?type=both&lookup={song}+{artist}
        → normalizar tempo → bpm
    → web pré-preenche BPM + exibe fonte
    → usuário pode tap tempo ou editar manualmente
    → auto-scroll usa bpm efetivo
    → prefs persistidas em localStorage
```

## Arquivos de implementação

- [API.md](./API.md) — proxy GetSongBPM, env, cache, curl
- [WEB.md](./WEB.md) — hook, UI, persistência, backlink
- [MANUAL.md](./MANUAL.md) — casos de teste manual + curl

## Relação com outros planos

| Plano | Relação |
|-------|---------|
| 05 (5b) | Substitui auto-scroll por velocidade fixa |
| 05 (5e) | `fontSize` afeta `lineHeight` → recalcular `scrollPerBeat` |
| 06 | Lógica pura de BPM/scroll em `packages/shared` se reutilizada no mobile |

## Ordem sugerida de implementação

1. `packages/shared` — `scroll-bpm.ts` + tipos GetSongBPM + testes
2. `apps/api` — cliente GetSongBPM + rota `/api/bpm`
3. `apps/web` — entity/feature fetch-bpm + cache local
4. `use-auto-scroll-bpm.ts` + UI (BPM, tap, lines per beat)
5. Backlink GetSongBPM na sidebar
6. Remover slider de velocidade legado
