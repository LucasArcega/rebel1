# API — Plano 02

## Escopo

- `apps/api/src/entities/chord/lib/parser.ts`

## Fase 2a — Letra

- [ ] `extractPlainLyricsContent` para texto puro do SSR
- [ ] Ativar quando `instrument === 'lyrics'`
- [ ] Preservar quebras de linha e seções

## Fase 2b — Baixo

- [ ] Detectar tablatura por `^[EADGB]\|` sem exigir `#t1#`
- [ ] Suportar linhas `G|`, `D|`, `A|`, `E|`
- [ ] Não quebrar guitarra (`#t1#` + `E|`)

## Fase 2c — Demais instrumentos

- [ ] Testar ukulele, viola, partituras, guitarpro
- [ ] Documentar formato SSR de cada um

## Verificação (curl)

```bash
# Letra
curl -s "http://localhost:3001/api/artists/coldplay/songs/the-scientist?instrument=lyrics"
curl -s "http://localhost:3001/api/artists/legiao-urbana/songs/tempo-perdido?instrument=lyrics"

# Baixo
curl -s "http://localhost:3001/api/artists/avenged-sevenfold/songs/buried-alive--?instrument=bass"

# Regressão bateria
curl -s "http://localhost:3001/api/artists/avenged-sevenfold/songs/buried-alive--?instrument=drums" | jq '.data.content[:60]'
```

## Output esperado

- Letra: HTTP 200, `content` com texto da música (sem acordes)
- Baixo: HTTP 200, `content` com linhas `G|`, `D|`, etc.
- Bateria: continua retornando tablatura `E|`
