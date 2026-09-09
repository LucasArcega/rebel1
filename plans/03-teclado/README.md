# Plano 03: teclado

**Status:** Planejado
**Dependências:** 02 (padrões de parser)

## Contexto

`keyboard: '/teclado'` está mapeado em `INSTRUMENT_PATHS`, mas teclado é raro no Cifra Club. Na maioria das músicas a página retorna 404.

## Critérios de aceite

- [ ] Identificar ao menos 2 músicas com `/teclado/` válido no CC
- [ ] `?instrument=keyboard` retorna conteúdo para essas músicas
- [ ] Seletor só mostra teclado quando disponível (coordenar com plano 04)

## Fora do escopo

- Descoberta via menu CC fora do SSR (ticket futuro)
- Partitura de teclado em PDF/imagem

## Arquivos de implementação

- [API.md](./API.md)
- [WEB.md](./WEB.md)
- [MANUAL.md](./MANUAL.md)
