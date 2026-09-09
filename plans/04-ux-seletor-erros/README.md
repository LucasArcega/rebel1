# Plano 04: UX — seletor e erros

**Status:** Planejado
**Dependências:** 02 (parser), 03 (teclado, parcial)

## Contexto

O `VersionSelector` lista entradas de `priorityVersions`, mas várias quebram (letra, baixo) ou não existem no CC (teclado). O usuário vê erro genérico.

## Critérios de aceite

- [ ] API retorna `error.code` distinguindo `PARSE_FAILED` vs `NOT_FOUND_ON_CC`
- [ ] Frontend mostra mensagens específicas por tipo de erro
- [ ] Itens não suportados desabilitados ou ocultos no seletor
- [ ] Offline com cache continua funcionando

## Fora do escopo

- Filtros avançados na busca
- Escolha de versão no card de resultado da busca

## Arquivos de implementação

- [API.md](./API.md)
- [WEB.md](./WEB.md)
- [MANUAL.md](./MANUAL.md)
