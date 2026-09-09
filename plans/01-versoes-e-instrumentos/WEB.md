# WEB — Plano 01

**Status:** Implementado

## Escopo (FSD)

| Camada | Arquivos |
|--------|----------|
| entities | `entities/chord/model/types.ts`, `chord-api.ts` |
| features | `select-version/`, `fetch-chord/chord-repository.ts` |
| widgets | `chord-viewer/ui/chord-viewer.tsx` |
| pages | `song/ui/song-page.tsx` |
| shared | `shared/lib/offline-db.ts` |
| entities | `offline-chord/lib/offline-chord-storage.ts` |

## Checklist

- [x] `version?: string` em `ChordSearchParams`
- [x] `VersionSelector` navega com `?version=simplificada`
- [x] `parseVersionFromSearch` na song page
- [x] Offline: chave inclui `version`
- [x] Badge da versão ativa
- [x] Biblioteca offline linka com `?version=`

## Rotas / query params

- `/artists/:artist/songs/:song`
- `?version=simplificada` (omitir quando `principal`)
