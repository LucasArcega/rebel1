# PLAYWRIGHT — Plano 08: dicionário de acordes

## Objetivo

Validar de forma determinística a faixa de acordes, o seletor de variações, a integração com transposição/capo e os estados visuais. Os testes não devem depender da disponibilidade ou do HTML atual do Cifra Club.

## Preparação

O repositório ainda não possui Playwright. A implementação deste plano deve adicionar:

```text
apps/web/
  playwright.config.ts
  e2e/
    fixtures/
      chord-song.ts
    helpers/
      route-mock.ts
    chord-diagrams.spec.ts
```

Adicionar `@playwright/test` às dependências de desenvolvimento do workspace web e os scripts:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

Configurar `baseURL` como `http://127.0.0.1:5173` e `webServer` com `npm run dev:web -- --host 127.0.0.1`. O mock de rota elimina a necessidade de iniciar `apps/api` nos testes determinísticos.

## Fixture principal

A fixture deve representar uma resposta realista do endpoint existente:

```typescript
const chordSongFixture = {
  artistSlug: 'fixture-artist',
  artistName: 'Fixture Artist',
  songSlug: 'diagramas',
  songName: 'Diagramas',
  versionId: 1,
  tone: 'Am',
  tuning: null,
  composers: [],
  hits: 1,
  youtubeId: null,
  cifraclubUrl: 'https://www.cifraclub.com.br/fixture-artist/diagramas/',
  content: '[Intro]\nAm  Bm11  C  C9\nD  D9/F#  E\n',
  chords: [
    { symbol: 'Am', normalizedSymbol: 'Am', order: 0 },
    { symbol: 'Bm11', normalizedSymbol: 'Bm11', order: 1 },
    { symbol: 'C', normalizedSymbol: 'C', order: 2 },
    { symbol: 'C9', normalizedSymbol: 'C9', order: 3 },
    { symbol: 'D', normalizedSymbol: 'D', order: 4 },
    { symbol: 'D9/F#', normalizedSymbol: 'D9/F#', order: 5 },
    { symbol: 'E', normalizedSymbol: 'E', order: 6 }
  ],
  versions: []
};
```

`route-mock.ts` deve interceptar `**/api/artists/fixture-artist/songs/diagramas*` e responder `{ data: chordSongFixture }`.

Criar também fixtures menores para:

- cifra legada sem `chords`;
- afinação alternativa explícita;
- acorde válido sem digitação cadastrada;
- duas versões com listas diferentes.

## Seletores

Preferir queries por papel, nome e texto acessível. Adicionar `data-testid` somente onde SVG ou estrutura repetida impossibilitarem um seletor estável.

Nomes acessíveis esperados:

- região “Acordes desta música”;
- imagem “Diagrama de Am”;
- botão “Ver variações de Am”;
- diálogo “Variações de Am”;
- opção “Selecionar variação …”.

## Cenários obrigatórios

### 1. Smoke da faixa

- Abrir `/artists/fixture-artist/songs/diagramas`.
- Confirmar título da música e região de acordes.
- Confirmar exatamente sete cards na ordem da fixture.
- Confirmar diagramas para `Am`, `Bm11`, `C`, `C9`, `D`, `D9/F#` e `E`.
- Confirmar que `×`, `○`, dedos e ao menos uma pestana existem nos SVGs correspondentes.

### 2. Variações e persistência

- Abrir as variações de um acorde com duas ou mais formas.
- Selecionar uma forma diferente.
- Confirmar atualização do card e estado selecionado.
- Recarregar a página.
- Confirmar restauração da forma escolhida.
- Injetar um ID inexistente no storage e confirmar fallback sem erro.

### 3. Transposição e capo

- Aumentar a transposição em dois semitons.
- Confirmar que `D9/F#` vira `E9/G#` no texto e na faixa.
- Confirmar que o diagrama acessível também anuncia `E9/G#`.
- Resetar e confirmar retorno da sequência original.
- Alterar capo e validar coerência entre o resumo do controle, texto e faixa.

### 4. Fallback legado

- Responder com fixture sem `chords`.
- Confirmar que a sequência é extraída do conteúdo.
- Incluir uma linha de letra com palavras iniciadas por `A`–`G` e confirmar ausência de falsos positivos.

### 5. Afinação não suportada

- Responder com afinação alternativa.
- Confirmar aviso de indisponibilidade.
- Confirmar que nenhum diagrama de afinação padrão é renderizado.
- Confirmar que a cifra textual permanece utilizável.

### 6. Troca de versão

- Mockar Principal e Simplificada com acordes diferentes.
- Alternar a versão pelo seletor existente.
- Confirmar que os cards anteriores desaparecem e a nova ordem é exibida.

### 7. Dark mode

- Ativar tema escuro pelo controle real.
- Confirmar atributo de tema do documento.
- Confirmar visualmente que cordas, casas, números e símbolos não desaparecem.
- Capturar screenshot somente da região de acordes para reduzir ruído.

### 8. Viewport móvel e teclado

- Usar viewport `390 × 844`.
- Confirmar que a página não ganha overflow horizontal global.
- Confirmar que a faixa pode rolar horizontalmente.
- Abrir o picker, navegar por teclado, selecionar uma forma e fechar com `Escape`.
- Confirmar que o foco retorna ao botão de origem.

### 9. Offline

- Abrir a fixture uma vez para acionar o salvamento atual.
- Bloquear a rota da API ou responder falha de rede.
- Recarregar a mesma URL.
- Confirmar badge `Offline`, faixa e diagramas.

## E2E com API real

Executar como verificação separada, fora da suíte determinística padrão:

1. Iniciar `npm run dev:api`.
2. Iniciar `npm run dev:web`.
3. Abrir uma cifra real de violão.
4. Confirmar que `data.chords` é entregue e a faixa aparece.

O teste real não deve bloquear CI por instabilidade da fonte externa; a aceitação automatizada obrigatória usa fixtures locais.

## Comandos

```bash
# instalação inicial do browser, uma vez no ambiente
npx playwright install chromium

# suíte determinística
npm run test:e2e -w @cifra-hub/web

# depuração interativa
npm run test:e2e:ui -w @cifra-hub/web
```

## Evidências esperadas

- Execução verde da suíte em Chromium.
- Screenshot do dark mode anexado ao relatório Playwright.
- Trace e screenshot retidos automaticamente em falhas.
- Registro manual do smoke com API real na entrega do ticket.

