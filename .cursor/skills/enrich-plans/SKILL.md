---
name: enrich-plans
description: Análise e enriquecimento compacto de planos Cifra Hub em `plans/{NN}-{slug}/`, sem implementar código. Use quando o usuário pedir para analisar, revisar, completar, enriquecer, preparar ou deixar agent-ready os plans de um ticket; quando pedir uma versão compacta do fluxo `implement-plan` focada em planejamento; ou quando disser "enriqueça o plano", "analise os plans", "prepare o PLAYWRIGHT.md", "valide o escopo do plano" ou variações semelhantes.
---

# Enrich Plans

Runbook compacto para analisar e enriquecer planos numerados. Parar no handoff de planejamento: não criar branch, não implementar código, não commitar, não abrir PR.

Adaptado do JourneyCore para o monorepo **Cifra Hub** (`apps/api` + `apps/web` + `packages/shared`).

## Escopo

Fazer:
- Localizar o plano em `plans/{NN}-{slug}/` ou identificar os disponíveis quando o usuário não informar número.
- Ler `README.md`, `API.md`, `WEB.md`, `MANUAL.md`, `PLAYWRIGHT.md` quando existirem, além de `plans/STATUS.md`.
- Avaliar se os critérios de aceite são obrigatórios, verificáveis e livres de itens opcionais.
- Enriquecer ou criar arquivos necessários para deixar o plano agent-ready.
- Separar API, web e Playwright em arquivos próprios.
- Registrar dependências, fora do escopo, comandos de validação e riscos.
- Entregar resumo do que mudou e das perguntas restantes.

Não fazer:
- Criar ou trocar branch.
- Alterar código de produto, testes ou fixtures fora de `plans/`, salvo pedido explícito.
- Marcar plano como `Implementado`.
- Atualizar `plans/STATUS.md` como concluído.
- Rodar suítes pesadas por padrão.
- Criar commit, PR, merge ou fechar ticket.

## Fluxo

1. Identificar o alvo
   - Se o usuário informou `{NN}` ou `{NN}-{slug}`, resolver a pasta em `plans/`.
   - Se houver ambiguidade, perguntar de forma curta antes de editar.
   - Só criar `plans/{NN}-{slug}/` quando número e slug forem claros.

2. Ler contexto mínimo
   - Arquivos existentes do plano + `plans/STATUS.md`.
   - Espelhar formato de planos implementados (preferir `plans/01-versoes-e-instrumentos/`).
   - Conferir `.cursor/rules/` e `AGENTS.md`.

3. Diagnosticar lacunas
   - Classificar: API, web, Playwright, docs ou combinação.
   - Mapear critérios vagos, dependências não declaradas e conflitos com STATUS.
   - Extras vão para **Fora do escopo**; não viram critério sem aceite.
   - UI testável exige `PLAYWRIGHT.md` (smoke, dark quando houver tema, E2E/`@real` quando o fluxo depende da API).

4. Enriquecer arquivos
   - `README.md`: índice, branch, status, prioridade, dependências, contexto, critérios, validação, fora do escopo.
   - `API.md`: rotas Hono, parser, tipos, env, curls, testes.
   - `WEB.md`: FSD (`pages` → `widgets` → `features` → `entities` → `shared`), rotas, query params, offline.
   - `PLAYWRIGHT.md`: fixtures em `apps/web/e2e/`, mocks, specs smoke/dark/E2E, comandos.
   - `MANUAL.md`: URLs `:5173` / curls `:3001` e o que validar no browser.
   - Nunca misturar API e web num único `PLAN.md`.

5. Checagem final
   - Todo arquivo citado no README existe.
   - Critérios verificáveis.
   - Sem "opcional", "se der tempo" ou "nice-to-have" no escopo obrigatório.
   - `PLAYWRIGHT.md` presente se a UI for testável.

## README.md

```markdown
# Plano {NN}: {Título}

**Branch:** `{NN}-{slug}`
**Status:** Planejado
**Prioridade:** {n} ({grupo})
**Dependências:** {NN-anterior} ou nenhuma

## Contexto

## Critérios de aceite

## Arquivos de implementação

- [API.md](API.md), se houver API
- [WEB.md](WEB.md), se houver web
- [PLAYWRIGHT.md](PLAYWRIGHT.md), se houver UI testável
- [MANUAL.md](MANUAL.md), se houver smoke manual

## Validação esperada

## Fora do escopo
```

## Handoff

```markdown
### Planos enriquecidos

- `plans/{slug}/README.md`: ...
- `plans/{slug}/API.md`: ...
- `plans/{slug}/WEB.md`: ...
- `plans/{slug}/PLAYWRIGHT.md`: ...
- `plans/{slug}/MANUAL.md`: ...

### Decisões de escopo

- ...

### Pendências / perguntas

- ...

### Não executado

- Branch/código/testes/commit/PR não executados por escopo desta skill.
```
