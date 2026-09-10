# Plano 08: dicionário de acordes e variações

**Branch:** `codex/08-dicionario-acordes-variacoes-impl`
**Status:** Em revisão
**Prioridade:** 2 (experiência do músico)  
**Dependências:** 01–02 (versões e parser), 05 (transposição, capo e offline)

## Contexto

O Cifra Hub exibe hoje a cifra como texto monoespaçado. O parser preserva as tags `<b>` usadas pela UI, mas os acordes continuam existindo apenas como trechos textuais, sem identidade musical própria. Isso impede mostrar a forma de tocar, oferecer variações ou associar uma preferência de digitação a cada acorde.

Este plano adiciona um dicionário próprio de digitações para violão, sem copiar imagens ou depender dos diagramas do Cifra Club em tempo de execução. A solução deve viver prioritariamente em `packages/shared`, para que parser, web e futuro cliente mobile compartilhem símbolos, tipos e dados.

### Situação alvo

```text
Cifra Club
   ↓
parser compartilhado
   ├── conteúdo textual
   └── acordes estruturados e ordenados
          ↓
     dicionário de digitações
          ↓
     faixa de diagramas SVG + seletor de variações
```

## Escopo

- Violão de seis cordas em afinação padrão `E A D G B E`.
- Parser estruturado de símbolos de acordes e inversões.
- Extração dos acordes a partir das tags `<b>` antes da remoção do HTML, com fallback textual para cifras offline legadas.
- Dicionário versionado de digitações curadas e formas móveis.
- Diagrama SVG acessível, responsivo e imprimível.
- Faixa com acordes únicos na ordem da música e seletor de variações.
- Integração com transposição, capo, tema e armazenamento offline existentes.
- Testes unitários no pacote compartilhado e testes Playwright da experiência web.

## Decisões de domínio

- A entidade nova se chama `ChordFingering`; `ChordSong` continua representando a cifra/música.
- `ChordSong.chords` é opcional para manter compatibilidade com registros IndexedDB antigos.
- O símbolo original é preservado para exibição; uma chave normalizada é usada na busca do dicionário.
- Acordes enarmônicos podem compartilhar a mesma digitação, mas mantêm a grafia exibida (`C#` ou `Db`).
- Em acordes invertidos, a nota após `/` deve ser a nota mais grave da digitação.
- Formas sem cobertura não recebem um desenho aproximado: a UI informa “Diagrama indisponível”.
- Diagramas aparecem apenas em versões com conteúdo harmônico compatível; letra e tablatura pura não exibem a faixa.
- O conteúdo HTML atual, inclusive tags `<b>`, permanece compatível; a extração estruturada é adicional.
- `ChordOccurrence.order` é um ordinal zero-based depois da deduplicação pela primeira ocorrência.
- Casas em `ChordFingering.frets` são absolutas; `baseFret` controla apenas a janela visual do SVG.
- Afinação ausente é padrão; strings explícitas só são aceitas após normalização para `E A D G B E`.

## Critérios de aceite

### Símbolos e extração

- [x] O domínio reconhece raiz, acidente, qualidade, extensões, alterações, adições e baixo invertido.
- [x] São cobertos ao menos: maior, menor, `5`, `6`, `7`, `maj7`, `m7`, `dim`, `aug`, `sus2`, `sus4`, `add9`, `9`, `m9`, `11`, `m11` e `13`.
- [x] `D9/F#` é interpretado com raiz `D`, extensão `9` e baixo `F#`.
- [x] O parser retorna acordes únicos na ordem da primeira ocorrência, sem confundir palavras da letra com acordes.
- [x] Registros offline sem `ChordSong.chords` usam extração textual como fallback, sem migração destrutiva do IndexedDB.

### Dicionário e diagramas

- [x] O modelo representa corda abafada, corda solta, casa, dedo, pestana, casa inicial, dificuldade e tags da forma.
- [x] O catálogo cobre os acordes `Am`, `Bm11`, `C`, `C9`, `D`, `D9/F#` e `E` usados como referência visual.
- [x] Famílias maior, menor, `7`, `maj7` e `m7` têm ao menos duas variações quando houver forma aberta e/ou móvel válida.
- [ ] O catálogo oferece formas transponíveis para `5`, `2`/`add2`, `6`, `9`, `add9`, `sus2` e `m9`.
- [x] Cada digitação é validada contra as notas do acorde; inversões validam também a nota mais grave.
- [x] O SVG desenha seis cordas, casas, pestana, dedos, `×`, `○` e número da casa inicial.
- [x] O diagrama possui nome acessível com símbolo, posição e descrição das cordas.

### Experiência web

- [x] A faixa mostra cada acorde uma vez, preservando a ordem em que aparece na música.
- [x] Em telas estreitas a faixa usa rolagem horizontal sem quebrar o layout da cifra.
- [ ] Passar o mouse ou focar um acorde no corpo da cifra exibe seu diagrama sem alterar o alinhamento da letra.
- [x] Selecionar um acorde abre suas variações e permite escolher a forma preferida.
- [x] A forma escolhida é persistida localmente por instrumento, afinação e símbolo normalizado.
- [x] Controles funcionam por mouse, toque e teclado; foco visível e fechamento por `Escape` são suportados.
- [x] Tema claro, tema escuro e impressão mantêm diagramas legíveis.

### Integrações

- [x] Alterar a transposição atualiza símbolos e diagramas no mesmo render.
- [x] Alterar o capo mostra as formas que o músico efetivamente deve tocar, coerentes com `effectiveSemitones`.
- [x] Alternar entre versões não reaproveita indevidamente a lista de acordes anterior.
- [x] Uma cifra salva offline continua exibindo diagramas sem solicitar a rede.
- [x] Afinação ausente é tratada como padrão; afinação explicitamente diferente exibe estado não suportado.
- [x] O build e os testes existentes continuam passando.

## Plano técnico

- [BACKEND.md](./BACKEND.md) — domínio compartilhado, parser, dicionário, contratos e testes unitários.
- [FRONTEND.md](./FRONTEND.md) — componentes FSD, estados, acessibilidade, responsividade e integração.
- [PLAYWRIGHT.md](./PLAYWRIGHT.md) — fixtures, cenários determinísticos, dark mode e E2E.

## Validação esperada

```bash
npm run test --workspace=@cifra-hub/shared
npm run typecheck
npm run build
npm run test:e2e --workspace=@cifra-hub/web
```

Além da automação, validar manualmente uma cifra online e a mesma cifra em modo offline, incluindo transposição, capo, escolha de variação, tema escuro e viewport móvel.

## Ordem sugerida de implementação

1. Modelar e testar símbolos musicais em `packages/shared`.
2. Preservar acordes estruturados no parser, mantendo compatibilidade do contrato.
3. Modelar digitações e adicionar o catálogo curado com validação automatizada.
4. Criar o renderer SVG isolado.
5. Criar faixa, seletor de variações e persistência da preferência.
6. Integrar com `ChordViewer`, transposição, capo, offline e impressão.
7. Adicionar Playwright e executar toda a validação.

## Riscos e mitigação

| Risco | Mitigação |
|------|-----------|
| Regex reconhecer palavras como acordes | Priorizar `<b>` no parser e usar parser estruturado no fallback |
| Digitação musicalmente incompleta | Validar notas essenciais por família e documentar omissões permitidas |
| Inversão com baixo incorreto | Validar a menor nota sonora contra o baixo declarado |
| Catálogo crescer demais no bundle | Dados compactos e separados por instrumento/afinação; medir no build |
| Registros offline antigos | Campo `chords` opcional e fallback sem alterar `DB_VERSION` neste plano |
| Transposição misturar sustenidos e bemóis | Preservar preferência enarmônica do tom/símbolo exibido |

## Fora do escopo

- Copiar, extrair ou redistribuir a base de diagramas do Cifra Club.
- Afinações alternativas e instrumentos diferentes de violão.
- Reprodução sonora, MIDI ou reconhecimento por microfone.
- Gerador exaustivo de todas as combinações possíveis no braço.
- Sugestão automática da sequência de formas com menor movimento entre acordes.
- Diagrama flutuante em cada ocorrência dentro do corpo da cifra.
- Sincronização com vídeo ou auto-scroll por BPM.

