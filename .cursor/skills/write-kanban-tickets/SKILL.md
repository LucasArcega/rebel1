---
name: write-kanban-tickets
description: Escreve tickets de atividades para quadros Kanban seguindo boas práticas de motivação, critérios de aceite e user stories. Use quando criar ou revisar tickets no ClickUp, Azure DevOps, Jira ou em documentação de planos.
---

# Escrever Tickets Kanban

Instruções para redigir tickets claros, acionáveis e verificáveis. Baseado no JourneyCore / Kodus / Atlassian.

## Estrutura obrigatória

### 1. Motivação (Por quê)

1–2 frases: objetivo, problema e como o recurso será usado. Sem implementação.

### 2. Critérios de aceite

Lista pass/fail, focada no “quê”, específica. Formato `- [ ]`.

### 3. Contexto técnico (quando relevante)

Endpoints, tipos ou camadas FSD — só o essencial.

## Template

```markdown
## Por quê
[1-2 frases: objetivo, problema, uso]

## Critérios de aceite
- [ ] Critério 1
- [ ] Critério 2

## Contexto técnico (se necessário)
[Rotas, parser, slices FSD — só o essencial]
```

## User story

Para feature de usuário final:

> **Como** [tipo de usuário], **eu quero** [capacidade] **para que** [benefício].

## Regras de ouro

1. Título curto e autoexplicativo.
2. Descrição autocontida — sem links órfãos.
3. Critérios = fronteira do escopo.
4. Sem "opcional" nos critérios — ver `.cursor/rules/plans-no-optional.mdc`.
5. Sem verbosidade.

## Exemplos

### Bom

```markdown
## Por quê
O auto-scroll hoje usa velocidade em ms e não acompanha o tempo da música. O músico precisa de BPM para a cifra avançar a cada batida.

## Critérios de aceite
- [ ] GET /api/bpm?artist=&song= devolve bpm ou 404
- [ ] Abrir a cifra pré-preenche o BPM quando a API encontrar
- [ ] Tap tempo com 3+ toques sobrescreve o valor buscado

## Contexto técnico
Proxy GetSongBPM em apps/api; hook em features/auto-scroll-chord.
```

### Ruim

```markdown
## Resumo
Implementar auto-scroll.

## Documentos
Ver API.md e WEB.md.
```

Idioma: **pt-BR** em título, por quê e critérios.
