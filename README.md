# Cifra Hub

Monorepo React + API para consumir cifras do Cifra Club com arquitetura **FSD (Feature-Sliced Design)** + **Bulletproof**.

## Estrutura

```
apps/
  api/   # Parser/proxy Hono (consome HTML SSR do Cifra Club)
  web/   # Frontend React (FSD + Bulletproof)
```

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
GET /api/artists/:artist/songs/:song
GET /api/artists/:artist/songs/:song?instrument=bass
```

Exemplo:

```bash
curl http://localhost:3001/api/artists/avenged-sevenfold/songs/buried-alive--
```

## Exemplo de rota no app

`/artists/avenged-sevenfold/songs/buried-alive--`
