# @cifra-hub/mobile

Cliente **self-hosted** para uso em React Native / Expo.

## Uso

```typescript
import { fetchChordDirect, searchChordsDirect } from '@cifra-hub/mobile/src/chord-client';

const chord = await fetchChordDirect({
  artist: 'coldplay',
  song: 'the-scientist',
  version: 'simplificada',
});

const results = await searchChordsDirect('coldplay');
```

Não depende de `apps/api` — usa `@cifra-hub/shared` para parsear HTML do Cifra Club no dispositivo.

## Próximo passo

Scaffold Expo em `apps/mobile` com UI FSD espelhando `apps/web`.
