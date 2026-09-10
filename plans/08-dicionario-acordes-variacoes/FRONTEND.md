# FRONTEND — Plano 08: diagramas e variações

## Escopo FSD

| Camada | Responsabilidade sugerida |
|--------|---------------------------|
| `entities/chord-diagram` | Renderer SVG puro e tipos de apresentação |
| `features/select-chord-fingering` | Abrir seletor, escolher e persistir variação |
| `widgets/song-chord-strip` | Compor a faixa de acordes da música |
| `widgets/chord-viewer` | Integrar faixa, transposição, capo e versão ativa |
| `shared/lib` | Storage local da preferência, caso não pertença à feature |
| `app/styles` | Tokens e regras globais estritamente necessárias |

Cada slice deve expor sua API por `index.ts`. A lógica musical permanece em `@cifra-hub/shared`; componentes React não recalculam fórmulas ou validam notas.

## Componentes

### `ChordDiagram`

Responsável somente por transformar uma `ChordFingering` válida em SVG.

```typescript
interface ChordDiagramProps {
  symbol: string;
  fingering: ChordFingering;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
}
```

Requisitos:

- `viewBox` estável e dimensões responsivas.
- Nut destacado quando `baseFret === 1`; caso contrário, número da casa inicial.
- Casas e cordas com contraste suficiente nos dois temas.
- Círculos numerados para dedos e traço arredondado para pestana.
- `×` e `○` alinhados acima das cordas.
- `role="img"`, `<title>` e descrição textual derivada das seis cordas.
- Nenhuma dependência de canvas ou imagem remota.

### `SongChordStrip`

```typescript
interface SongChordStripProps {
  chords: ChordOccurrence[];
  tuning: string | null;
  disabledReason?: string;
}
```

- Renderizar acordes únicos na ordem recebida.
- Exibir a primeira digitação ordenada ou a preferência salva.
- Usar lista horizontal sem setas artificiais quando o scroll nativo for suficiente.
- Mostrar estado vazio somente quando existe conteúdo harmônico, mas nenhuma forma suportada.
- Não renderizar para letra, tablatura pura ou afinação alternativa.

### `FingeringPicker`

- Abrir a partir de um acorde da faixa.
- Exibir todas as variações confiáveis com posição, dificuldade e tags traduzidas.
- Marcar a seleção atual.
- Suportar navegação por tabulação, setas dentro da grade e `Escape`.
- Restaurar foco ao botão que abriu o seletor.
- Usar modal central em desktop e drawer inferior em viewport móvel, mantendo a mesma semântica de diálogo.

## Persistência

Preferências são locais e independentes do registro offline da cifra.

```typescript
interface FingeringPreference {
  instrument: 'guitar';
  tuningKey: 'E-A-D-G-B-E';
  normalizedSymbol: string;
  fingeringId: string;
}

// chave sugerida
// chord-fingering/guitar/E-A-D-G-B-E/{normalizedSymbol}
```

Ao carregar uma preferência cujo ID não existe mais, removê-la e usar a primeira forma válida. Não incrementar `DB_VERSION`; `localStorage` é suficiente para o volume previsto.

## Integração com `ChordViewer`

1. Obter acordes de `chord.chords` ou executar fallback sobre `chord.content`.
2. Aplicar `effectiveSemitones` às ocorrências estruturadas.
3. Passar os símbolos resultantes ao dicionário.
4. Renderizar a faixa depois do seletor de versão e antes de `.chord-tools`.
5. Reinicializar seleção aberta quando a música ou versão mudar.
6. Renderizar um preview não intrusivo ao passar o mouse ou focar acordes reconhecidos no corpo da cifra, usando a mesma afinação e símbolo transposto da faixa.

Não extrair acordes de `displayContent` em todo render se `ChordSong.chords` estiver disponível. Memorizar resultados por conteúdo, afinação e semitons.

## Transposição e capo

- O texto e os diagramas devem consumir a mesma transposição efetiva.
- A faixa mostra o nome do acorde efetivamente tocado.
- Alterar capo não deve apagar a preferência de uma forma previamente escolhida para o símbolo correspondente.
- Preferências são indexadas pelo símbolo normalizado após transposição, evitando associar a forma de `Am` a `A#m`.
- Ao resetar transposição e capo, a lista original reaparece sem refetch da cifra.

## Estados de UI

| Estado | Comportamento |
|--------|---------------|
| Carregando cifra | Mantém o spinner atual; não monta faixa parcial |
| Sem acordes | Não renderiza o widget |
| Afinação padrão ou ausente | Renderiza o dicionário de violão |
| Afinação alternativa explícita | Exibe aviso compacto “Diagramas indisponíveis para esta afinação” |
| Acorde sem forma | Card preserva o símbolo e informa “Diagrama indisponível” |
| Uma variação | Clique pode abrir detalhes, sem anunciar plural |
| Várias variações | Exibe affordance e total de formas |
| Preferência inválida | Remove preferência e volta à primeira forma |

## Responsividade

- Faixa com `overflow-x: auto` e cards sem encolhimento; scroll snap não faz parte dos critérios deste plano.
- Alvos de toque com no mínimo `44 × 44px`.
- Picker não pode ultrapassar a altura útil; conteúdo interno rola.
- Nenhum overflow horizontal deve ser introduzido na página ou no `<pre>` existente.
- Diagramas permanecem legíveis a partir de 72 px de largura.

## Tema e impressão

- Usar `currentColor` ou variáveis existentes (`--text`, `--muted`, `--border`, `--surface-2`, `--accent`).
- Não fixar branco/preto salvo no stylesheet de impressão.
- No print, exibir a faixa de diagramas antes da cifra e ocultar controles de seleção/modal.
- Evitar quebra de página dentro de um card de diagrama.

## Checklist

- [x] Criar `entities/chord-diagram` com SVG e testes de renderização pertinentes.
- [x] Criar `features/select-chord-fingering` e storage resiliente.
- [x] Criar `widgets/song-chord-strip`.
- [x] Integrar no `ChordViewer` sem acoplar o widget ao fetch.
- [x] Integrar transposição e capo por dados estruturados.
- [x] Cobrir estados vazio, sem suporte e preferência inválida.
- [x] Aplicar responsividade, dark mode, acessibilidade e impressão.
- [x] Adicionar configuração e scripts Playwright descritos em `PLAYWRIGHT.md`.

## Testes de componente/unidade

- [x] SVG com cordas abertas, abafadas e pressionadas.
- [x] Pestana única e casa inicial maior que 1.
- [x] Descrição acessível do diagrama.
- [x] Deduplicação e ordem da faixa.
- [x] Recuperação e invalidação da preferência local.
- [x] Troca de transposição/capo substitui símbolos e formas.
- [x] Afinação alternativa não apresenta forma de afinação padrão.

## Verificação

```bash
npm run typecheck -w @cifra-hub/web
npm run build -w @cifra-hub/web
npm run test:e2e -w @cifra-hub/web
```
