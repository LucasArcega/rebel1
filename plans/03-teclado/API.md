# API — Plano 03

## Escopo

- `apps/api/src/entities/chord/lib/parser.ts`
- `apps/api/src/entities/chord/model/types.ts` (se novos tipos)

## Checklist

- [ ] Levantar músicas com `/teclado/` no CC
- [ ] Testar formato SSR da transcrição
- [ ] Implementar ou reutilizar extrator
- [ ] Documentar músicas de referência neste arquivo

## Verificação (curl)

```bash
# Substituir por músicas válidas encontradas na Fase 3a
curl -s "http://localhost:3001/api/artists/{artist}/songs/{song}?instrument=keyboard"
```
