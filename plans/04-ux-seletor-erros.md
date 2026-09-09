# Plano 04: UX — seletor e erros

## Contexto

O `VersionSelector` lista todas as entradas de `priorityVersions`, mas várias ainda **quebram ao clicar** porque o parser não suporta o formato (letra, baixo) ou a página não existe no CC (teclado, tab guitarra em algumas músicas).

O usuário vê apenas um erro genérico: *"Não foi possível carregar a cifra"*.

## Problemas identificados

| Problema | Impacto |
|----------|---------|
| Seletor mostra Letra/Baixo/Teclado sem funcionar | Frustração; parece bug do app |
| Erro genérico na `SongPage` | Não diferencia "não suportado" de "rede/offline" |
| Biblioteca offline linka versão/instrumento | ✅ Corrigido na Fase 1 para `version` |
| Busca sempre abre versão Principal | Esperado hoje; sem escolha de versão na busca |
| Opções no seletor misturam instrumento + label | Ex.: "Letra · Original", "Violão · Simplificada" — OK, mas confuso se quebra |

## Fase 4a — Mensagens de erro

### `SongPage` / `chord-repository`

- [ ] Diferenciar erros:
  - **404 parser** → "Este instrumento/versão ainda não é suportado"
  - **404 CC** → "Transcrição não disponível no Cifra Club"
  - **Offline sem cache** → mensagem atual
  - **Erro de rede** → "Verifique sua conexão"
- [ ] API: códigos ou `error.code` para o frontend distinguir (ex.: `PARSE_FAILED`, `NOT_FOUND_ON_CC`)

### API (`apps/api`)

- [ ] Retornar motivo quando HTML veio 200 mas parser falhou vs. quando CC retornou 404

## Fase 4b — Seletor inteligente

- [ ] Marcar versões não suportadas como desabilitadas (até parser implementado)
- [ ] Ou: ocultar instrumentos sem parser pronto (letra, baixo) até Fase 2
- [ ] Após Fase 2/3: habilitar conforme suporte real
- [ ] Indicador visual: "em breve" vs. disponível

### Critérios para habilitar item no seletor

| Instrumento | Habilitar quando |
|-------------|------------------|
| `cifra-group` + principal/simplificada | ✅ Agora |
| `lyrics` | Plano 02 Fase 2a concluída |
| `bass` | Plano 02 Fase 2b concluída |
| `drums`, `harmonica` | ✅ Se formato `E\|` (já funciona) |
| `keyboard` | Plano 03 concluído + música tem página |
| `guitar` (tab separada) | Parser OK + página existe no CC |

## Fase 4c — Busca

- [ ] (Opcional) Abrir resultado na versão mais popular vs. sempre Principal
- [ ] (Opcional) Mostrar no card da busca quais versões existem

## Testes

- [ ] Clicar em Letra antes da Fase 2 → mensagem clara (não erro genérico)
- [ ] Clicar em Baixo antes da Fase 2 → mensagem clara
- [ ] Música sem teclado no CC → mensagem "não disponível"
- [ ] Offline com cache → carrega normalmente
- [ ] Offline sem cache → mensagem de offline

## Dependências

- [02-parser-letra-e-tablaturas.md](./02-parser-letra-e-tablaturas.md) — habilitar itens do seletor
- [03-teclado.md](./03-teclado.md) — teclado no seletor
