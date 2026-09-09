# MANUAL — Plano 03

## Casos de teste

Preencher após Fase 3a (descoberta):

| Artista | Música | Esperado |
|---------|--------|----------|
| TBD | TBD | Conteúdo de teclado |

## Regressão

```bash
curl -s "http://localhost:3001/api/artists/coldplay/songs/the-scientist?instrument=keyboard"
# Esperado: 404 (página inexistente no CC) — não é bug
```
