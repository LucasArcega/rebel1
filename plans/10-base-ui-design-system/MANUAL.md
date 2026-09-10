# Plano 10 — Validação manual

## Pré-requisitos

```bash
npm install
npm run dev:web
```

Abrir `http://localhost:5173/ui-system` e uma cifra que contenha acordes com uma e múltiplas formas. Repetir a inspeção principal nos temas escuro e claro.

## 1. Catálogo e consistência

- Conferir Button, IconButton, Popover, Dialog, Tooltip, Select e Slider em todos os estados documentados.
- Conferir Stack, Inline, Surface e AppShell em desktop e viewport estreita.
- Verificar que espaçamentos, raios, sombras e foco seguem o mesmo ritmo visual.
- Ativar tema claro e confirmar que não existem valores herdados ilegíveis.
- Tentar abrir `/ui-system` no preview/build de produção e confirmar que a rota de catálogo não está disponível.

## 2. Preview do acorde

- Passar o mouse em acordes no início, meio e fim de linhas.
- Testar acordes próximos ao topo e ao rodapé da viewport.
- Confirmar que o preview troca de lado quando necessário e permanece inteiro na tela.
- Confirmar que sidebar, cabeçalho e containers de conteúdo não cobrem nem cortam o preview.
- Mover o ponteiro do acorde até a ação “ver formas”; o preview deve permanecer aberto.
- Navegar até um acorde com `Tab`, abrir/interagir sem mouse e fechar com `Escape`.

## 3. Uma única forma

- Abrir “ver formas” para um acorde com uma forma.
- Confirmar que o diálogo é compacto, centralizado e não se aproxima do tamanho da tela inteira no desktop.
- Medir visualmente/devtools: popup até `320px`; diagrama até `198px`.
- Confirmar título, botão fechar, clique no backdrop, `Escape` e retorno de foco.

## 4. Múltiplas formas

- Abrir um acorde com duas ou mais formas.
- Confirmar grade responsiva, popup até `560px` e diagramas até `198px`.
- Escolher outra forma, fechar e abrir novamente.
- Confirmar a seleção no diálogo, no preview da letra e na faixa de acordes.

## 5. Mobile e zoom

- Repetir os fluxos em `390×844`.
- Confirmar margem mínima de `12px`, ausência de scroll horizontal e controles com área de toque confortável.
- Testar zoom do navegador em 200%; conteúdo e fechamento continuam acessíveis.

## 6. Acessibilidade e movimento

- Percorrer todos os controles somente com teclado.
- Confirmar foco visível e focus trap dentro do diálogo.
- Ativar redução de movimento no sistema e repetir abertura/fechamento.
- Usar leitor de tela para conferir nome do acorde, título do diálogo, estado selecionado e nomes dos botões de ícone.

## 7. Regressão

- Alterar tom, capotraste, fonte, tema e velocidade de auto-scroll.
- Confirmar que os controles migrados preservam valores e comportamento existentes.
- Imprimir/visualizar impressão e confirmar que overlays e controles interativos não aparecem.

