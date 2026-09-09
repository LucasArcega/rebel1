# Cifra Hub

Monorepo React + API para consumir cifras do Cifra Club com arquitetura **FSD (Feature-Sliced Design)** + **Bulletproof**.

## Estrutura

```
apps/
  api/     # BFF local (Node/Hono) — thin wrapper sobre @cifra-hub/shared
  web/     # Frontend React (FSD + Bulletproof)
  mobile/  # Cliente self-hosted (fetch direto CC, sem API)
packages/
  shared/  # Parser, tipos e Solr (fonte única da verdade)
plans/     # Roadmap numerado — ver plans/STATUS.md
```

> A API roda em **localhost** (`npm run dev:api`) como conveniência de dev web (CORS). O parser vive em `packages/shared` e é reutilizado por `apps/mobile` para self-hosted.

### Camadas do frontend (`apps/web/src`)

| Camada | Responsabilidade |
|--------|------------------|
| `app/` | Providers, router, layout, estilos globais |
| `pages/` | Composição de rotas (finas) |
| `widgets/` | Blocos de UI compostos |
| `features/` | Interações do usuário (buscar, trocar versão) |
| `entities/` | Domínio e API de `chord` |
| `shared/` | UI kit, HTTP client, config |

Cada slice expõe API pública via `index.ts` (padrão Bulletproof).

## Rodar localmente

```bash
npm install
npm run dev:api   # http://localhost:3001
npm run dev:web   # http://localhost:5173
```

## API

```
GET /api/search?q=avenged sevenfold buried alive
GET /api/artists/:artist/songs/:song
GET /api/artists/:artist/songs/:song?instrument=bass
```

## Offline

Toda cifra aberta online é salva automaticamente no **IndexedDB** do navegador. Se a rede falhar, o app tenta carregar a versão salva.

- Home e `/library` listam as cifras salvas
- Badge **Offline** quando veio do dispositivo
- Badge **Salva offline** quando acabou de baixar

## Rotas do app

- `/` — busca por nome
- `/search?q=...` — resultados
- `/library` — cifras salvas
- `/artists/:artist/songs/:song` — visualizar cifra
