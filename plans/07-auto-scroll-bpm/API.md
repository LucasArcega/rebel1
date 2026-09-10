# API — Plano 07: BPM via GetSongBPM

## Escopo

| Camada | Arquivos |
|--------|----------|
| shared | `packages/shared/src/bpm/types.ts` |
| shared | `packages/shared/src/bpm/getsongbpm-client.ts` |
| shared | `packages/shared/src/bpm/normalize-search.ts` |
| api | `apps/api/src/entities/bpm/lib/getsongbpm-client.ts` (re-export ou thin) |
| api | `apps/api/src/features/get-bpm/api/get-bpm.handler.ts` |
| api | `apps/api/src/features/get-bpm/api/routes.ts` |
| api | `apps/api/src/shared/config/env.ts` — `GETSONGBPM_API_KEY` |
| api | `apps/api/src/index.ts` — montar rota |

## GetSongBPM — referência externa

| Item | Valor |
|------|-------|
| Docs | https://getsongbpm.com/api |
| Base URL | `https://api.getsongbpm.com` |
| Auth | `GETSONGBPM_API_KEY` → query `api_key` ou header `X-API-KEY` |
| Rate limit | ~3.000 req/h; exceder → bloqueio 1 h |
| Termos | Grátis com **backlink obrigatório**; sem SLA “free forever” |

### Endpoints upstream usados

```
GET /search/?api_key=…&type=both&lookup={encodeURIComponent(`${songName} ${artistName}`)}
```

Resposta (trecho relevante):

```json
{
  "search": [
    {
      "id": "983pB",
      "title": "Highway to Hell",
      "tempo": "120",
      "time_sig": "4/4",
      "key_of": "A",
      "artist": { "name": "AC/DC", "id": "…" }
    }
  ]
}
```

**Matching:** preferir resultado cujo `artist.name` e `title` melhor correspondam ao `artistName`/`songName` da cifra (case-insensitive, normalizar acentos). Se ambíguo, retornar o primeiro com score simples ou `404`.

Alternativa se `type=both` falhar:

```
GET /search/?type=song&lookup={songName}
→ filtrar por artista no handler
```

## Endpoint Cifra Hub

```
GET /api/bpm?artist={artistSlug}&song={songSlug}
```

Query opcional (evitar segunda ida ao CC se caller já tiver metadados):

```
GET /api/bpm?artist=…&song=…&artistName=…&songName=…
```

### Resposta 200

```json
{
  "data": {
    "bpm": 120,
    "key": "A",
    "timeSig": "4/4",
    "source": "getsongbpm",
    "externalId": "983pB",
    "attribution": {
      "name": "GetSongBPM",
      "url": "https://getsongbpm.com"
    }
  }
}
```

### Respostas de erro

| Status | code | Quando |
|--------|------|--------|
| 404 | `BPM_NOT_FOUND` | Nenhum match confiável no GetSongBPM |
| 503 | `BPM_PROVIDER_UNAVAILABLE` | GetSongBPM down, rate limit, key inválida |
| 400 | `INVALID_PARAMS` | `artist` ou `song` ausente |
| 501 | `BPM_NOT_CONFIGURED` | `GETSONGBPM_API_KEY` não definida (dev sem key) |

## Variáveis de ambiente

```bash
# apps/api/.env (não commitar)
GETSONGBPM_API_KEY=sua_chave_aqui
# opcional:
GETSONGBPM_BASE_URL=https://api.getsongbpm.com
```

Adicionar `.env.example` na raiz ou em `apps/api/`:

```bash
GETSONGBPM_API_KEY=
```

## Cache (servidor)

Mapa em memória por `{artistSlug}/{songSlug}`:

```typescript
interface ServerBpmCacheEntry {
  bpm: number;
  key?: string;
  timeSig?: string;
  externalId?: string;
  cachedAt: number;
}
// TTL: 24h — BPM raramente muda; reduz rate limit
```

## Checklist

- [ ] `GETSONGBPM_API_KEY` em `env.ts` (opcional em dev — retorna 501 se ausente)
- [ ] Cliente HTTP GetSongBPM com timeout (5s) e User-Agent identificando Cifra Hub
- [ ] Handler: resolver nomes (`artistName`/`songName`) — usar query params ou buscar cifra principal (evitar se possível; preferir params do web)
- [ ] Normalizar `tempo` string → `number` (faixa 40–220; fora da faixa → 404)
- [ ] Rota `GET /api/bpm` registrada em `apps/api/src/index.ts`
- [ ] Testes unitários em `packages/shared`: parse resposta, matching artista/título, clamp BPM
- [ ] Log warn em miss (sem vazar API key)

## Verificação (curl)

Pré-requisito: API em `:3001` com `GETSONGBPM_API_KEY` configurada.

```bash
# Hit internacional (alta chance de match)
curl -s "http://localhost:3001/api/bpm?artist=ac-dc&song=highway-to-hell&artistName=AC%2FDC&songName=Highway%20to%20Hell" | jq .

# Música já usada no projeto
curl -s "http://localhost:3001/api/bpm?artist=system-of-a-down&song=lonely-day&artistName=System%20Of%20A%20Down&songName=Lonely%20Day" | jq .

# Sem key configurada (dev)
curl -s -w "\nHTTP %{http_code}\n" "http://localhost:3001/api/bpm?artist=x&song=y"
```

## Output esperado

- AC/DC: `bpm` numérico (~120), `source: "getsongbpm"`, `attribution.url` presente
- Música desconhecida: HTTP 404, `{ "error": { "code": "BPM_NOT_FOUND" } }`
- Sem API key: HTTP 501 ou 503 documentado no handler

## Segurança

- **Nunca** repassar `GETSONGBPM_API_KEY` ao browser
- **Nunca** commitar `.env`
- Tratar resposta upstream como não confiável (validar tipos com zod)
