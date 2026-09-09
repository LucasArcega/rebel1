# MANUAL — Plano 01

**Status:** Implementado

## Pré-requisitos

```bash
npm run dev:api   # :3001
npm run dev:web   # :5173
```

## Smoke UI

| # | Passo | Resultado esperado |
|---|-------|-------------------|
| 1 | Abrir `/artists/coldplay/songs/the-scientist` | Cifra Principal com `Dm7`, `Bb9` |
| 2 | Clicar "Simplificada" no seletor | URL com `?version=simplificada`, acordes `C#m`, `A`, `E` |
| 3 | Badge "Simplificada" visível no header | Sim |
| 4 | Abrir `/library` após visitar ambas | Duas entradas ou mesma música com versões distintas offline |

## API (curl)

```bash
curl -s "http://localhost:3001/api/artists/coldplay/songs/the-scientist" | jq '.data.versionId'
# 1351255

curl -s "http://localhost:3001/api/artists/coldplay/songs/the-scientist?version=simplificada" | jq '.data.versionId'
# 8799
```
