# Plano 05: melhorias de produto e limitações

## Contexto

Funcionalidades e limitações que **não são bugs de parser**, mas afetam a experiência do usuário ou a robustez do app.

## Limitações atuais

| Limitação | Descrição |
|-----------|-----------|
| Sem transposição | Tom exibido fixo; usuário não pode mudar capo/tom |
| Sem auto-scroll | Não rola a cifra automaticamente durante execução |
| Offline reativo | Só salva ao abrir a música **online**; sem download em lote |
| Scraping SSR | Dados vêm do HTML Next.js; mudança no CC pode quebrar o parser |
| Sem login CC | Não integra conta, favoritos ou contribuições do site |
| Sem impressão/PDF | Visualização apenas em tela (`<pre>`) |
| Sem diagramas de acorde | Só texto; sem shapes de dedilhado |
| Busca limitada | Solr público; sem filtros por artista, tom, dificuldade |
| Uma música por vez | Sem playlist ou setlist |

## Fase 5a — Transposição

- [ ] UI para subir/descer semitons
- [ ] Aplicar transposição no conteúdo exibido (acordes em `<b>` e linhas de cifra)
- [ ] Não alterar versão salva offline (ou salvar tom preferido separado)
- [ ] Considerar biblioteca de parsing de acordes (ex.: regex + tabela de notas)

## Fase 5b — Auto-scroll

- [ ] Controle play/pause de rolagem
- [ ] Velocidade ajustável
- [ ] Pausar ao interagir com a página

## Fase 5c — Offline avançado

- [ ] Download explícito ("Salvar para offline") vs. auto-save silencioso
- [ ] Download em lote da biblioteca de busca
- [ ] Indicador de espaço / quantidade de cifras salvas
- [ ] Migração IndexedDB se schema mudar (hoje `DB_VERSION = 1`)

## Fase 5d — Robustez do scraping

- [ ] Testes de integração contra páginas reais do CC (CI opcional, pode ser frágil)
- [ ] Fallback quando `priorityVersions` mudar de formato
- [ ] Log/monitoramento quando parser retorna null em HTML 200
- [ ] Documentar dependência do formato `self.__next_f.push`

## Fase 5e — Apresentação

- [ ] Modo tela cheia / apresentação
- [ ] Tamanho de fonte ajustável
- [ ] Tema claro (hoje provavelmente só escuro)
- [ ] Impressão com formatação

## Fase 5f — Busca e navegação

- [ ] Filtros: só artista, só música
- [ ] Histórico de buscas recentes
- [ ] Deep link com versão/instrumento na busca

## Prioridade sugerida

1. **Transposição** — pedido frequente em apps de cifra
2. **Offline explícito** — clareza para o usuário
3. **Auto-scroll** — útil em performance
4. **Robustez scraping** — manutenção contínua
5. Demais conforme demanda

## Fora de escopo (por ora)

- Login / sync com conta Cifra Club
- Contribuir/editar cifras
- Player de áudio integrado (YouTube link já existe em `ChordMeta`)
- App mobile nativo

## Relação com outros planos

- Parsers ([02](./02-parser-letra-e-tablaturas.md), [03](./03-teclado.md)) devem estar estáveis antes de investir pesado em transposição sobre tablaturas
- UX de erros ([04](./04-ux-seletor-erros.md)) tem prioridade mais alta que features deste plano
