# Plano 10 — Playwright

## Objetivo

Validar comportamento, acessibilidade prática, geometria e ordem de camadas. Testes unitários não detectam um popover cortado por `overflow`, atrás da sidebar ou um diálogo desproporcional.

## Estratégia

Usar a rota DEV `/ui-system` para estados determinísticos dos primitives e uma cifra real/fixture para confirmar a integração. Cada cenário deve rodar pelo menos em desktop (`1440×900`) e mobile (`390×844`) quando indicado.

## Cenários obrigatórios

### Catálogo

- [x] `/ui-system` existe no servidor de desenvolvimento e apresenta todos os primitives/layouts do plano.
- [x] A URL equivalente em preview de produção retorna a rota normal de fallback/404 e não expõe o catálogo.
- [x] Button, IconButton, Select e Slider são operáveis por teclado e exibem foco visível.
- [x] Tooltip contém somente conteúdo descritivo; Popover aceita foco em ação interna; Dialog mantém o foco preso.
- [x] Tema escuro e tema claro não produzem texto ou controles ilegíveis.

### Popover de acorde

- [x] Hover em acorde central abre o preview e permite mover o ponteiro até “ver formas” sem fechamento prematuro.
- [x] Foco pelo teclado abre/torna acessível o preview; `Escape` fecha e devolve o foco ao acorde.
- [x] Acordes próximos às bordas superior, inferior, esquerda e direita permanecem inteiros dentro da viewport.
- [x] O bounding box do popover não intercepta a sidebar quando há espaço útil no conteúdo.
- [x] O popover fica visualmente acima de header, sidebar e conteúdo, e abaixo do backdrop/dialog quando o seletor é aberto.
- [x] Scroll, resize e mudança de fonte não deixam o popover preso em coordenadas antigas.

### Seletor de formas

- [x] Com uma forma, o popup no desktop tem largura máxima de `320px`, o diagrama tem largura/altura máxima de `198px` e o backdrop não transforma o conteúdo em tela cheia.
- [x] Com várias formas, o popup tem largura máxima de `560px`, a grade reorganiza sem overflow horizontal e cada diagrama respeita `198px`.
- [x] `Escape`, botão fechar e clique no backdrop fecham o diálogo e devolvem foco ao acionador.
- [x] `Tab` e `Shift+Tab` não escapam do diálogo enquanto ele está aberto.
- [x] Escolher outra forma atualiza o preview e a faixa de acordes depois de fechar e reabrir.
- [x] Em `390×844`, popup e conteúdo mantêm margem mínima de `12px`, sem scroll horizontal e sem controles fora da viewport.

### Preferências de movimento e impressão

- [x] Com `prefers-reduced-motion: reduce`, overlays abrem e fecham sem animação essencial.
- [x] Em mídia de impressão, popovers, diálogos, backdrops e controles do catálogo não aparecem.

## Seletores

Preferir papel e nome acessível. Usar os `data-slot` estáveis somente para geometria e para diferenciar partes sem papel próprio:

```ts
page.getByRole('dialog', { name: /variações de/i });
page.getByRole('button', { name: /ver formas/i });
page.locator('[data-slot="popover-popup"]');
page.locator('[data-slot="chord-diagram"]');
```

Não selecionar classes visuais nem depender de delays fixos. Esperar estados (`visible`, `hidden`, foco) e medir `boundingBox()` após a estabilização.

## Arquivos previstos

- `apps/web/e2e/smoke/ui-system.spec.ts`
- `apps/web/e2e/smoke/chord-overlays.spec.ts`
- fixtures locais do catálogo e dos acordes, seguindo a estrutura Playwright existente

## Comandos de validação

```bash
npm run test:e2e -w @cifra-hub/web -- e2e/smoke/ui-system.spec.ts
npm run test:e2e -w @cifra-hub/web -- e2e/smoke/chord-overlays.spec.ts
```

