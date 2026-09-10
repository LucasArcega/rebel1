# BACKEND — Plano 08: domínio de acordes e digitações

## Escopo

Este plano não cria endpoint novo. “Backend” representa o domínio portátil em `packages/shared` e a evolução compatível do contrato `ChordSong` consumido por `apps/api`, `apps/web` e `apps/mobile`.

## Estrutura sugerida

```text
packages/shared/src/
  harmony/
    chord-symbol.ts
    chord-formula.ts
    chord-symbol.test.ts
  fingering/
    types.ts
    fingering-key.ts
    validate-fingering.ts
    find-fingerings.ts
    dictionary/
      guitar-standard.ts
    fingering.test.ts
  chord/
    parser.ts
    parser.test.ts
    types.ts
```

Exportar a API pública necessária em `packages/shared/src/index.ts`. `apps/api/src/entities/chord/*` continua apenas reexportando `@cifra-hub/shared`.

## Contratos

### Símbolo musical

```typescript
export interface ParsedChordSymbol {
  raw: string;
  normalized: string;
  root: NoteName;
  quality: ChordQuality;
  extensions: number[];
  alterations: ChordAlteration[];
  additions: number[];
  omissions: number[];
  bass: NoteName | null;
}

export interface ChordOccurrence {
  symbol: string;
  normalizedSymbol: string;
  order: number;
}
```

`normalized` deve ser estável para lookup e persistência, mas não substituir o texto apresentado ao usuário.

### Digitação

```typescript
export type StringFret = number | 'x';

export interface Barre {
  fret: number;
  fromString: number;
  toString: number;
  finger: 1 | 2 | 3 | 4;
}

export interface ChordFingering {
  id: string;
  symbol: string;
  instrument: 'guitar';
  tuning: readonly ['E', 'A', 'D', 'G', 'B', 'E'];
  frets: readonly StringFret[];
  fingers: readonly (0 | 1 | 2 | 3 | 4)[];
  baseFret: number;
  barres: readonly Barre[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: readonly FingeringTag[];
  omittedIntervals?: readonly number[];
}
```

Regras invariantes:

- `frets` e `fingers` têm exatamente seis posições, da sexta para a primeira corda.
- `x` exige dedo `0`; corda solta usa casa `0` e dedo `0`.
- Casas pressionadas são positivas e compatíveis com `baseFret`.
- Pestanas referenciam cordas e casas existentes na digitação.
- IDs são estáveis e não dependem da ordem do array.
- O catálogo não contém duas entradas com o mesmo ID.
- Valores numéricos em `frets` são casas absolutas. `baseFret` informa a primeira casa desenhada e não altera o cálculo de pitch.
- `ChordOccurrence.order` é o índice zero-based no array deduplicado, não o offset textual.

### Evolução de `ChordSong`

```typescript
export interface ChordSong {
  // campos existentes
  content: string;
  chords?: ChordOccurrence[];
}
```

O campo permanece opcional durante este plano. Isso mantém compatibilidade estrutural com respostas antigas e registros já gravados no IndexedDB.

## Parser de símbolos

### Gramática mínima obrigatória

```text
root        := A..G + (# | b)?
quality     := m | min | maj | M | dim | aug | + | ° | ø?
extension   := 2 | 5 | 6 | 7 | 9 | 11 | 13 | maj7 | m7 | m9 | m11
suspension  := sus2 | sus4
addition    := add2 | add4 | add9 | add11
alteration  := b5 | #5 | b9 | #9 | #11 | b13
omission    := no3 | no5
bass        := / + root
```

O parser deve aceitar parênteses usuais nas alterações, por exemplo `C7(b9)`, e rejeitar símbolos incompletos sem lançar exceção. Aliases devem convergir para uma representação canônica (`min` → `m`, `M7` → `maj7`), preservando `raw`.

Na notação curta, `C2` é alias de `Cadd2` e converge para a mesma chave normalizada.

## Fórmulas e validação musical

- Converter raiz e fórmula em pitch classes `0..11`.
- Definir, por família, intervalos obrigatórios e omissíveis.
- Permitir omissão explícita da quinta justa em acordes estendidos.
- Não permitir omissão silenciosa de terça, sétima ou extensão característica quando elas definirem a qualidade.
- Para slash chords, comparar o pitch class da nota mais grave que soa com `bass`.
- Tratar equivalência enarmônica apenas no cálculo; preservar a grafia na apresentação.

## Extração no parser da cifra

1. Em `extractLyricChordContent`, capturar o texto de cada `<b>...</b>` preservando o HTML atual em `content`.
2. Validar cada candidato com `parseChordSymbol`.
3. Normalizar e deduplicar mantendo a primeira ordem de ocorrência.
4. Retornar `chords` junto de `content`.
5. Para conteúdo sem marcação semântica, expor `extractChordOccurrences(content)` como fallback conservador por linha e densidade de tokens.
6. Não extrair acordes para `lyrics` nem para tablatura pura quando não houver evidência harmônica.

O parser interno deve distinguir `lyric-chords`, `lyrics` e `tablature`. Apenas o primeiro popula `ChordSong.chords`; isso evita inferir acordes de palavras em versões de letra ou tab pura.

Evitar manter duas regexes divergentes: transposição, detecção e fallback devem consumir o mesmo parser/tokenizador compartilhado.

## Dicionário

O catálogo inicial deve combinar:

- formas abertas curadas;
- templates móveis com pestana;
- entradas específicas para extensões e inversões da matriz de aceite;
- ordenação explícita por prioridade de apresentação.

`findFingerings(symbol, tuning)` deve:

1. Parsear e normalizar o símbolo.
2. Consultar entradas exatas.
3. Resolver aliases enarmônicos compatíveis.
4. Materializar templates móveis válidos.
5. Validar o resultado contra a fórmula.
6. Ordenar por prioridade, dificuldade, extensão da mão e posição.
7. Retornar array vazio quando não houver forma confiável.

`tuning` aceita `null` como afinação padrão e normaliza variantes textuais equivalentes a `E A D G B E`; uma afinação alternativa explícita retorna lista vazia.

Não criar neste ticket um solver que enumere arbitrariamente todas as casas do braço.

## Transposição

- Mover `transposeChord`, tokenização e preferência de acidentes para o domínio compartilhado.
- Transpor raiz e baixo invertido.
- Reutilizar os tokens reconhecidos para substituir apenas acordes reais no conteúdo.
- Expor função capaz de transpor `ChordOccurrence[]` sem reprocessar a letra inteira.
- Manter o comportamento público atual de `computeTransposeSemitones(manual, capo)`.

## Checklist

- [x] Adicionar tipos de harmonia e digitação ao pacote compartilhado.
- [x] Implementar parser, normalizador e fórmula musical.
- [x] Implementar extração ordenada e compatível no parser de cifra.
- [x] Evoluir `ChordSong` com campo opcional.
- [x] Criar e validar o catálogo inicial.
- [x] Centralizar a transposição no pacote compartilhado.
- [x] Reexportar apenas a API pública necessária.
- [x] Confirmar que API e mobile compilam sem alteração de endpoint.

## Testes unitários obrigatórios

### Parser

- [x] `Am`, `Bb`, `F#m`, `Cmaj7`, `G7`, `Csus4`, `Cadd9`.
- [x] `C9`, `Bm11`, `D9/F#`, `C7(b9)`.
- [x] Aliases equivalentes produzem a mesma chave normalizada.
- [x] Entradas inválidas retornam resultado nulo, sem exceção.
- [x] Palavras e cabeçalhos de seção não são classificados como acordes.

### Extração

- [x] Captura a sequência `Am Bm11 C C9 D D9/F# E` a partir de `<b>`.
- [x] Remove duplicatas preservando a primeira ocorrência.
- [x] Mantém `content` textual atual sem regressão.
- [x] Fallback reconhece acordes em registro legado e ignora letra comum.

### Digitações

- [x] Toda entrada respeita seis cordas e IDs únicos.
- [x] Todas as notas produzidas pertencem à fórmula, salvo metadado explícito permitido.
- [x] Notas essenciais estão presentes.
- [x] `D9/F#` tem `F#` como menor nota sonora.
- [x] Pestanas, dedos e casas são internamente consistentes.
- [x] Ordenação de variações é determinística.
- [ ] Formas de `5`, `2`/`add2`, `6`, `9`, `add9`, `sus2` e `m9` são materializadas e validadas em diferentes raízes.

### Transposição

- [x] Raiz, acidentes, extensões e baixo invertido são preservados corretamente.
- [x] `D9/F#` transposto em `+2` resulta em `E9/G#`.
- [x] Transpor ocorrências não altera sua ordem.

## Verificação

```bash
npm test -w @cifra-hub/shared
npm run typecheck
npm run build
```

Não há verificação `curl` nova: o endpoint existente deve continuar retornando `200`, agora podendo incluir `data.chords`.

