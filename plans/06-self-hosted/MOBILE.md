# MOBILE — Plano 06 (React Native)

## Por que RN encaixa no self-hosted

Apps nativos **não sofrem CORS** do browser. O mesmo `fetch` + `parseCifraClubHtml` do shared funciona no dispositivo, sem `apps/api`.

## Stack sugerida

| Item | Escolha |
|------|---------|
| Framework | React Native + Expo (recomendado para DX) |
| Navegação | Expo Router ou React Navigation |
| Estado servidor | TanStack Query (igual ao web) |
| Offline | expo-sqlite ou MMKV + JSON |
| Estrutura | FSD espelhando `apps/web` |

## Estrutura proposta

```
apps/
  mobile/
    src/
      app/           # entry, providers
      pages/
      widgets/
      features/
      entities/
      shared/
    app.json
```

## Checklist de implementação

- [ ] Criar `apps/mobile` no monorepo
- [ ] Depender de `@cifra-hub/shared`
- [ ] Portar entities: `chord`, `search`, `offline-chord`
- [ ] Portar features: `fetch-chord`, `search-chord`, `select-version`, `offline-library`
- [ ] UI: `ChordContent` como `Text` monoespaçado em `ScrollView`
- [ ] Deep links: `/artists/:artist/songs/:song?version=&instrument=`
- [ ] Testar em iOS e Android (Expo Go ou build local)

## Fluxo de dados (sem API)

```typescript
// entities/chord/api/chord-client.ts (mobile)
import { parseCifraClubHtml, buildFetchUrl } from '@cifra-hub/shared';

export async function fetchChord(params: ChordSearchParams) {
  const url = buildFetchUrl('https://www.cifraclub.com.br', ...);
  const html = await fetch(url, { headers: MOBILE_HEADERS }).then(r => r.text());
  return parseCifraClubHtml(html, ...);
}
```

## Offline

| Web (hoje) | Mobile (alvo) |
|------------|---------------|
| IndexedDB | SQLite / MMKV |
| `buildOfflineChordId` | Mesma chave lógica |
| Auto-save on fetch | Igual |

## Critérios de aceite mobile

- [ ] Busca por nome funciona (Solr direto do app)
- [ ] Abrir cifra Principal e Simplificada
- [ ] Troca de versão no seletor
- [ ] Salvar e listar biblioteca offline
- [ ] App funciona sem `localhost:3001`

## Fora do escopo (v1 mobile)

- App Store / Play Store publish
- Sincronização entre dispositivos
- Push notifications
