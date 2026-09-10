# Guia de arquitetura do Cifra Hub

Este documento define as regras práticas para mudanças no monorepo. Em caso de conflito, o código existente e uma decisão explícita do projeto prevalecem.

## Princípios

1. Organize por domínio/capacidade, não por tipo técnico global.
2. Código que muda junto deve ficar junto.
3. Dependências apontam para camadas mais estáveis.
4. Comece simples; crie camadas apenas quando a complexidade exigir.
5. Exponha APIs públicas pequenas e esconda detalhes internos.

## Estrutura do monorepo

```text
apps/
  web/       # React: interface e experiência do usuário
  api/       # Hono: BFF fino para o frontend
  mobile/    # cliente self-hosted
packages/
  shared/    # parser, tipos e acesso ao Solr reutilizados entre runtimes
plans/       # planejamento e validação das entregas
```

Responsabilidades:

- `apps/web` não contém parsing do Cifra Club nem regras compartilhadas com outros runtimes.
- `apps/api` adapta HTTP, valida entradas e converte falhas em respostas; não duplica o parser.
- `apps/mobile` consome diretamente as capacidades necessárias ao modo self-hosted.
- `packages/shared` é a fonte única para parser, contratos e integrações realmente compartilhadas. Deve permanecer independente de React, DOM, Hono e detalhes de UI.
- Um app pode importar `@cifra-hub/shared`; `packages/shared` nunca importa um app.

## Frontend: FSD pragmático

`apps/web/src` segue estas camadas:

```text
app       # bootstrap, providers, router, layout e estilos globais
pages     # composição de uma rota
widgets   # blocos grandes de UI compostos
features  # ações/capacidades percebidas pelo usuário
entities  # conceitos de domínio, contratos e acesso a dados
shared    # infraestrutura e UI genuinamente genéricas
```

Fluxo permitido de dependências:

```text
app -> pages -> widgets -> features -> entities -> shared
```

Uma camada pode importar a si própria e as camadas à direita, nunca as camadas à esquerda. Evite dependências laterais entre slices da mesma camada; quando a composição for necessária, faça-a em uma camada superior.

### API pública dos slices

Todo slice consumido externamente expõe um `index.ts`:

```ts
import { useChordQuery } from '@/features/fetch-chord';
import type { ChordSong } from '@/entities/chord';
```

Não faça deep import em outro slice:

```ts
// proibido fora de entities/chord
import type { ChordSong } from '@/entities/chord/model/types';
```

Imports relativos são adequados dentro do próprio slice. Use o alias `@/` entre slices e camadas.

### Rotas e componentes

- `app/router` registra rotas e providers; não concentra regra de negócio.
- `pages` lê parâmetros e compõe features/widgets. Fetch, persistência e transformações reutilizáveis ficam nas camadas responsáveis.
- Componentes apresentam UI e coordenam interação local. Extraia lógica quando ela tiver regra própria, reutilização ou testes independentes.
- Não fragmente JSX sem ganho claro de leitura ou responsabilidade.

## API: feature-first

`apps/api/src` é organizado por capacidades:

```text
features/<capacidade>/api/   # rota e handler da operação
entities/<dominio>/          # tipos e comportamento de domínio reutilizados
shared/                      # configuração e infraestrutura transversal
```

Regras:

- Rotas validam entrada, chamam a operação e traduzem o resultado para HTTP.
- Handlers orquestram a operação; regras reutilizáveis pertencem à entidade ou a `@cifra-hub/shared`.
- Não crie pastas globais `controllers/`, `services/` ou `repositories/`.
- Não acesse internals de outra feature. Promova um contrato estável para `entities` ou para a API pública do módulo.

## Escolha da estrutura

Use a menor estrutura que torne a responsabilidade clara.

| Situação | Estrutura inicial |
| --- | --- |
| UI ou CRUD simples | `api`, `model`, `ui` somente quando necessários |
| Regra pura e reutilizável | `lib` ou `model` dentro do slice responsável |
| Contrato usado por várias features | `entities/<dominio>` |
| Código usado por mais de um app/runtime | `packages/shared` |
| Infraestrutura transversal sem domínio | `shared` do app |

Só introduza `domain/application/infrastructure/presentation` quando houver regras relevantes, múltiplas implementações, offline complexo, integrações alternativas ou necessidade real de testar o domínio isoladamente. Quantidade de arquivos, sozinha, não justifica novas camadas.

Não crie por padrão `UseCase`, `Repository`, `RepositoryImpl`, `Adapter`, `Factory`, `BaseService` ou wrappers de bibliotecas. Toda abstração deve resolver uma variação ou boundary existente.

## Estado e dados no frontend

| Tipo | Solução padrão |
| --- | --- |
| Dados remotos, cache e sincronização | TanStack Query |
| Estado local de componente | `useState` / `useReducer` |
| Estado derivado | cálculo puro / `useMemo` quando necessário |
| Navegação e filtros compartilháveis | URL / React Router |
| Formulário simples | estado local + Zod na borda |
| Persistência offline | repositório da entidade sobre IndexedDB |

- Não copie dados da Query para uma store global.
- Não recrie manualmente cache, retry, loading e invalidação.
- Zustand e React Hook Form não fazem parte da stack atual. Só adicione uma dependência quando o problema concreto justificar seu custo.
- Estado específico de uma feature permanece nela; infraestrutura de persistência genérica pode ficar em `shared`.

## `shared`: critério de entrada

Código só entra em `shared` quando:

1. é independente de uma feature específica;
2. tem pelo menos um boundary transversal real;
3. possui uma API estável e um nome de responsabilidade claro.

Não use nomes como `helpers.ts`, `common.ts`, `utils2.ts`, `stuff.ts` ou `manager.ts`. Prefira nomes do domínio. Duplicação pequena é melhor que uma abstração errada.

## Processo para uma mudança

1. Identifique o app e a capacidade de negócio afetados.
2. Localize o slice responsável e leia sua API pública.
3. Classifique a mudança como UI, estado, domínio, integração ou composição.
4. Implemente no slice existente ou crie o menor slice necessário.
5. Exporte somente o contrato que outros slices precisam.
6. Teste regras puras e boundaries importantes.
7. Execute as validações proporcionais à mudança.

Validação padrão na raiz:

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

Use apenas os comandos relevantes durante a iteração; antes de concluir uma mudança ampla, rode o conjunto completo.

## Checklist de PR

- [ ] A mudança está no app, camada e slice corretos?
- [ ] A direção `app -> pages -> widgets -> features -> entities -> shared` foi respeitada?
- [ ] Imports externos passam pelo `index.ts` do slice?
- [ ] `@cifra-hub/shared` continua independente dos apps e frameworks de UI/HTTP?
- [ ] Parser, contratos ou integrações compartilhadas não foram duplicados?
- [ ] A rota/page ficou focada em composição?
- [ ] Server state usa TanStack Query e estado local permaneceu local?
- [ ] Nada específico de domínio virou `shared` por conveniência?
- [ ] Toda nova abstração ou dependência resolve uma necessidade concreta?
- [ ] A mudança evita refatorações de módulos não relacionados?
- [ ] Typecheck, lint, testes e build relevantes passaram?

## Regra de decisão

Em caso de dúvida, priorize nesta ordem:

```text
clareza -> coesão -> boundaries -> simplicidade -> testabilidade -> reuso -> abstração
```

Complexidade arquitetural deve ser conquistada, não presumida.
