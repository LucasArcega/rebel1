# Plano 06: arquitetura self-hosted

**Status:** Parcial — infra pronta; **`apps/api` (Node) permanece ativo**
**Dependências:** 02

## Decisão de produto

> **O Node NÃO foi removido.** A web continua dependendo de `apps/api` em localhost (`npm run dev:api`).
> A remoção/depreciação da API só entra quando a aplicação for **empacotada** (Electron, Tauri ou app mobile com UI).

O plano 06 preparou o terreno (`packages/shared`, cliente mobile), sem desligar o fluxo atual.

## Entregas

| Fase | Status | Entrega |
|------|--------|---------|
| 6a | ✅ | `packages/shared` com parser, tipos, Solr |
| 6b | ✅ | `apps/api` importa `@cifra-hub/shared` (thin wrapper) |
| 6c | ✅ | `apps/web` importa tipos de `@cifra-hub/shared` |
| 6d | ✅ | `apps/mobile/src/chord-client.ts` — fetch direto (futuro) |
| 6e | ⏸️ | **Adiado** — manter `apps/api` até empacotar |
| 6f | ⏸️ | **Adiado** — web segue com proxy Vite → Node |

## Critérios de aceite

- [x] `packages/shared` exporta parser, tipos, URLs; testes vitest
- [x] `apps/api` é thin wrapper
- [x] `apps/mobile` busca e parseia sem Node
- [x] README raiz atualizado
- [x] `npm test` no monorepo

## Uso self-hosted (mobile)

```typescript
import { fetchChordDirect } from '@cifra-hub/mobile/src/chord-client';

const chord = await fetchChordDirect({
  artist: 'coldplay',
  song: 'the-scientist',
});
```

## Web

Continua usando `apps/api` local por CORS. Ver [WEB.md](./WEB.md).
