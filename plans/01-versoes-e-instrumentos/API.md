# API — Plano 01

**Status:** Implementado

## Escopo

- `apps/api/src/entities/chord/model/types.ts` — `labelSlug` em `ChordVersion`
- `apps/api/src/entities/chord/lib/parser.ts` — `buildVersionPath`, `buildFetchUrl`
- `apps/api/src/features/get-chord/api/routes.ts` — query `?version=`
- `apps/api/src/features/get-chord/api/get-chord.handler.ts`

## Checklist

- [x] `labelSlug` em `ChordVersion`
- [x] Path com `label.slug` quando não for `principal`
- [x] Query `?version=simplificada`
- [x] `buildFetchUrl` combina `instrument` + `version`

## Verificação (curl)

```bash
curl -s "http://localhost:3001/api/artists/coldplay/songs/the-scientist" | jq '.data | {versionId, sample: .content[:80]}'
curl -s "http://localhost:3001/api/artists/coldplay/songs/the-scientist?version=simplificada" | jq '.data | {versionId, cifraclubUrl}'
```

## Output esperado

- Principal: `versionId` 1351255, acordes `Dm7`, `Bb9`
- Simplificada: `versionId` 8799, acordes `C#m`, `A`, `E`
- `cifraclubUrl` termina em `/simplificada/` na versão simplificada
