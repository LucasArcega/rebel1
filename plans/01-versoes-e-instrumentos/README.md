# Plano 01: versões da cifra (Principal / Simplificada)

**Status:** Implementado
**Dependências:** nenhuma

## Contexto

O Cifra Club expõe versões da mesma música via `priorityVersions` no SSR. Cada versão tem `instrument.slug` e `label.slug`, que definem a URL.

## Critérios de aceite

- [x] API retorna `labelSlug` e monta URL correta para Simplificada
- [x] Query `?version=simplificada` funciona no endpoint de cifra
- [x] Frontend navega com `?version=` no seletor
- [x] Offline salva Principal e Simplificada separadamente
- [x] Badge mostra versão ativa quando não é Principal

## Fora do escopo

- Letra, baixo, teclado → planos 02–04
- Transposição → plano 05

## Arquivos de implementação

- [API.md](./API.md)
- [WEB.md](./WEB.md)
- [MANUAL.md](./MANUAL.md)

## Referência CC

```
/coldplay/the-scientist/              → Principal   (versionId 1351255)
/coldplay/the-scientist/simplificada/ → Simplificada (versionId 8799)
```
