# API — Plano 04

## Escopo

- `apps/api/src/features/get-chord/api/get-chord.handler.ts`
- `apps/api/src/features/get-chord/api/routes.ts`

## Checklist

- [ ] Resposta de erro com `code`: `PARSE_FAILED`, `NOT_FOUND_ON_CC`, etc.
- [ ] Diferenciar HTTP 404 do CC vs HTML 200 com parser null
- [ ] Manter compatibilidade com `error.message` existente

## Verificação (curl)

```bash
# Parser falha (letra, antes do plano 02)
curl -s "http://localhost:3001/api/artists/coldplay/songs/the-scientist?instrument=lyrics" | jq .

# CC 404
curl -s "http://localhost:3001/api/artists/coldplay/songs/the-scientist?instrument=keyboard" | jq .
```
