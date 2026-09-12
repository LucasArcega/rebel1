# Plano 10: Base UI e design system

**Branch:** `10-base-ui-design-system`
**Status:** Implementado
**Prioridade:** 1 (fundação de frontend)
**Dependências:** Plano 08 (diagramas, hover e variações que serão a primeira migração)

## Motivação

O frontend já possui componentes visuais próprios, mas overlays, foco, camadas, tamanhos e estados ainda são resolvidos caso a caso. O resultado aparece no fluxo de acordes: o preview pode ficar atrás de outros elementos e o seletor de uma única forma ocupa quase a tela inteira. Sem uma base comum, cada nova tela tende a introduzir mais CSS e comportamentos incompatíveis.

Este plano adota o [Base UI](https://base-ui.com/) como camada de primitives acessíveis e sem estilo, preserva o CSS e a identidade visual atuais e cria um contrato de design system que também seja legível por agentes de código. A primeira entrega valida a fundação migrando o hover de acordes e o seletor de variações.

## História do usuário

Como pessoa que consulta cifras, quero previews, diálogos e controles previsíveis, compactos e acessíveis, para navegar pelos acordes sem perder o contexto da música.

Como equipe de produto, queremos componentes, tokens e layouts com APIs documentadas, para que novas interfaces reutilizem o mesmo sistema em vez de inventarem padrões locais.

## Critérios de aceite

### Fundação

- [x] `@base-ui/react` está instalado no workspace web e encapsulado por componentes públicos de `apps/web/src/shared/ui`.
- [x] Imports diretos de `@base-ui/react` fora de `shared/ui` são rejeitados pelo lint; features e widgets consomem apenas a API pública do projeto.
- [x] Tokens semânticos cobrem cores, tipografia, espaçamento, raios, elevação, movimento, tamanhos de controle e camadas (`z-index`) nos temas escuro, claro e impressão.
- [x] Nenhum componente migrado usa cor, sombra, raio ou `z-index` arbitrário quando existe token equivalente.
- [x] Os primitives iniciais `Button`, `IconButton`, `Popover`, `Dialog`, `Tooltip`, `Select` e `Slider` possuem API tipada, `data-slot` estável e exportação pelo barrel de `shared/ui`.
- [x] Os layouts iniciais `Stack`, `Inline`, `Surface` e `AppShell` usam tokens de espaçamento e funcionam sem acoplamento a domínio.

### Contrato de uso e catálogo

- [x] `shared/ui/README.md` documenta instalação, tokens, variantes, exemplos e a decisão entre Tooltip, Popover e Dialog.
- [x] O catálogo descreve todos os primitives e layouts entregues, incluindo estados padrão, hover, foco, disabled, loading, erro e tema claro/escuro quando aplicável.
- [x] Existe uma rota apenas de desenvolvimento, `/ui-system`, com os estados determinísticos do catálogo; a rota não integra o bundle/roteamento de produção.
- [x] Componentes de domínio continuam nas respectivas slices FSD; `shared/ui` não importa entities, features, widgets ou pages.

### Migração dos acordes

- [x] O hover/foco do acorde usa o `Popover` do design system, renderizado em portal e reposicionado automaticamente nas bordas da viewport.
- [x] O preview aparece acima do conteúdo da página e abaixo de diálogos, sem ser cortado por sidebar, containers com overflow ou cabeçalho.
- [x] Mouse, teclado e toque têm caminhos operáveis: hover/foco exibe o preview, `Escape` fecha e o foco retorna ao acionador.
- [x] A ação “ver formas” abre um `Dialog` do design system com título, fechamento explícito, clique externo e focus trap.
- [x] Quando há uma única forma, o seletor é compacto, não ocupa a tela inteira no desktop e o diagrama não ultrapassa `198px` (1,5× o tamanho-base de `132px`).
- [x] Quando há múltiplas formas, o diálogo usa grade responsiva, largura máxima de `560px` e cada diagrama respeita o limite de `198px`.
- [x] A forma escolhida continua persistida por acorde e refletida tanto no hover quanto na faixa de diagramas.

### Qualidade

- [x] Testes de componente cobrem contratos públicos, acessibilidade básica, eventos de abertura/fechamento e variantes dos primitives.
- [x] Playwright cobre colisão do popover, ordem de camadas, teclado/foco, uma forma, múltiplas formas e viewport móvel.
- [x] `npm run typecheck`, `npm run build` e os testes web passam sem regressões.
- [x] A validação manual de [MANUAL.md](./MANUAL.md) foi executada nos temas escuro e claro.

## Fora do escopo

- Redesenhar todas as páginas ou alterar a identidade visual do Cifra Hub.
- Migrar todo o CSS legado no mesmo ticket.
- Adotar Tailwind CSS, shadcn CLI, registry remoto ou copiar componentes shadcn.
- Criar Storybook ou publicar um pacote externo de componentes.
- Alterar parser, catálogo de acordes, API ou persistência de negócio.

## Arquivos de implementação

- [WEB.md](./WEB.md) — arquitetura, tokens, primitives, layouts e migração
- [PLAYWRIGHT.md](./PLAYWRIGHT.md) — cobertura automatizada de interação e geometria
- [MANUAL.md](./MANUAL.md) — roteiro visual e de acessibilidade

## Validação esperada

```bash
npm run typecheck
npm run lint
npm run build
npm test -w @cifra-hub/web
npm run test:e2e -w @cifra-hub/web -- e2e/smoke/ui-system.spec.ts
npm run test:e2e -w @cifra-hub/web -- e2e/smoke/chord-overlays.spec.ts
```

Abrir `http://localhost:5173/ui-system` e uma cifra com uma e várias formas; repetir no tema claro. Preview de produção não expõe `/ui-system`.

