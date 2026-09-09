# Implement Plan (Cifra Hub)

Runbook de entrega completa de um plano numerado (`{NN}-{slug}`). Cobre o ciclo **plano → branch → implementação → lacunas → code review → testes → handoff**.

Adaptado do skill `implement-feature-ticket` do JourneyCore para o monorepo **Cifra Hub** (`apps/api` + `apps/web`).

## Quando usar

Acione este skill quando o usuário pedir:

- "implemente o plano 02", "vamos para o 02", "implement plan 02"
- Entrega completa de um item em `plans/{NN}-{slug}/`

**Não inclui** commit, PR ou merge automaticamente — pare no handoff e aguarde pedido explícito (exceto se instruções de Cloud Agent exigirem commit/push na iteração).

## Estrutura de planos

```
plans/
  STATUS.md                          # índice e status global
  _template/                         # modelo para novos planos
    README.md
    API.md
    WEB.md
    MANUAL.md
  {NN}-{slug}/
    README.md                        # sempre — contexto, critérios de aceite, fora do escopo
    API.md                           # se houver mudanças em apps/api
    WEB.md                           # se houver mudanças em apps/web (FSD)
    MANUAL.md                        # se a feature tem UI testável manualmente
```

### Regras de documentação

| Arquivo | Quando criar |
|---------|--------------|
| `README.md` | Sempre |
| `API.md` | Parser, rotas Hono, tipos em `apps/api` |
| `WEB.md` | Pages, widgets, features, entities em `apps/web` |
| `MANUAL.md` | Fluxos UI, smoke manual, casos curl |

**Nunca** misturar API + WEB num único arquivo de implementação.

Critérios de aceite no `README.md`:

- Apenas itens **obrigatórios** ou seção **Fora do escopo**
- Sem itens "opcionais" soltos — mova para Fora do escopo ou ticket futuro
- `MANUAL.md` deve listar URLs, comandos curl exatos e passos de verificação no browser

## Visão geral das fases

| Fase | Nome | Gate |
|------|------|------|
| 0 | Contexto e baseline | Baseline registrado |
| 1 | Enriquecer plano | README + API/WEB/MANUAL agent-ready |
| 2 | Branch | Branch criada a partir de `main` |
| 3 | Implementar | Código no escopo do plano |
| 4 | Loop de lacunas | Zero critérios `- [ ]` obrigatórios |
| 5 | Code review (Bugbot) | Bugbot executado, zero críticos |
| 6 | Testes | Matriz verde ou falhas documentadas |
| 7 | Handoff | Relatório estruturado, sem commit até pedido |

---

## Fase 0 — Contexto e baseline

1. Ler `plans/{NN}-{slug}/README.md` e arquivos complementares (`API.md`, `WEB.md`, `MANUAL.md`)
2. Consultar `plans/STATUS.md` — dependências e ordem sugerida
3. Identificar arquivos prováveis no escopo (ver mapa abaixo)
4. Rodar baseline **antes** de codar:

```bash
npm run typecheck
npm run lint
npm run build
```

5. Se API envolvida, registrar smoke baseline (API em `:3001`):

```bash
curl -s http://localhost:3001/api/health
```

**Gate:** baseline registrado (`passed` / `failed` / `skipped` + motivo).

---

## Fase 1 — Enriquecer o plano

Transformar o plano em algo **agent-ready** se ainda estiver raso.

### README.md (obrigatório)

```markdown
# Plano {NN}: {título}

**Status:** Planejado | Em progresso | Implementado
**Dependências:** {NN-anterior} ou nenhuma

## Contexto
...

## Critérios de aceite
- [ ] ...

## Fora do escopo
- ...

## Arquivos de implementação
- API.md
- WEB.md
- MANUAL.md
```

### API.md (quando aplicável)

- Endpoints afetados (`apps/api/src/features/`)
- Parser (`apps/api/src/entities/chord/lib/parser.ts`)
- Tipos (`apps/api/src/entities/*/model/types.ts`)
- Checklist `- [ ]` por tarefa
- Comandos curl de verificação

### WEB.md (quando aplicável)

- Camadas FSD: `pages/`, `widgets/`, `features/`, `entities/`, `shared/`
- Rotas e query params (`?instrument=`, `?version=`)
- Offline / IndexedDB se relevante
- Checklist `- [ ]` por tarefa

### MANUAL.md (quando aplicável)

- Pré-requisitos: `npm run dev:api` (:3001), `npm run dev:web` (:5173)
- Smoke: URLs e o que validar visualmente
- Casos de teste com artista/música reais do Cifra Club
- Comandos curl com output esperado (trecho)

**Referência de qualidade:** `plans/01-versoes-e-instrumentos/` (implementado).

---

## Fase 2 — Branch

```bash
git checkout main
git pull origin main
git checkout -b cursor/plan-{NN}-{slug}-8862
```

- Nome da branch espelha a pasta do plano + sufixo do Cloud Agent
- Para trabalho local sem Cloud Agent: `cursor/plan-{NN}-{slug}-8862` ou `{NN}-{slug}`

---

## Fase 3 — Implementar por camada

Ordem padrão:

1. **API** — tipos, parser, handlers, rotas Hono
2. **WEB** — entities → features → widgets → pages (FSD + Bulletproof)
3. **MANUAL** — validar fluxos descritos; atualizar `MANUAL.md` se cenários mudarem

### Mapa do repositório

| Área | Caminho |
|------|---------|
| API entry | `apps/api/src/index.ts` |
| Chord parser | `apps/api/src/entities/chord/lib/parser.ts` |
| Rotas cifra | `apps/api/src/features/get-chord/` |
| Busca Solr | `apps/api/src/features/search-chords/` |
| Web app | `apps/web/src/app/` |
| FSD layers | `pages/`, `widgets/`, `features/`, `entities/`, `shared/` |
| Offline DB | `apps/web/src/shared/lib/offline-db.ts` |
| Planos | `plans/` |

**Regra:** alterar apenas arquivos do escopo do plano.

---

## Fase 4 — Loop de lacunas

Repetir até zerar pendências:

1. Comparar critérios do `README.md` + checklists de `API.md` / `WEB.md` vs código e testes
2. Listar lacunas
3. Implementar cada uma
4. Voltar ao passo 1

**Gate:** nenhum critério `- [ ]` obrigatório pendente.

---

## Fase 5 — Code review (Bugbot)

1. Invocar **exatamente um** subagent `bugbot` sobre as mudanças da branch
2. Corrigir achados críticos e relevantes
3. Se o diff crescer muito após correções, re-rodar Bugbot **uma vez**

**Gate:** Bugbot executado + zero achados críticos em aberto.

**Proibido** substituir Bugbot por "revisão mental".

Prompt sugerido:

```
Full Repository Path: /workspace
Diff: branch changes
Change Description: Plano {NN}-{slug}: {resumo}
```

---

## Fase 6 — Testes (matriz obrigatória)

| Suite | Comando | Obrigatório |
|-------|---------|-------------|
| Typecheck | `npm run typecheck` | Sim |
| Lint | `npm run lint` | Sim |
| Build | `npm run build` | Sim |
| API smoke | curl nos endpoints do `MANUAL.md` / `API.md` | Se API tocada |
| UI manual | Browser conforme `MANUAL.md` | Se WEB tocada |

### Pré-requisitos locais

```bash
npm run dev:api   # :3001
npm run dev:web   # :5173
```

### API smoke (exemplos)

```bash
curl -s "http://localhost:3001/api/artists/coldplay/songs/the-scientist" | jq '.data.versionId'
curl -s "http://localhost:3001/api/search?q=coldplay" | jq '.data | length'
```

### UI manual

- Usar skill `browser-use` ou `walkthrough-artifacts` para evidência visual
- Validar seletor de versões, offline, busca conforme o plano

**Gate para marcar Implementado:**

- Typecheck + build + smoke/API do plano verdes
- Atualizar `plans/STATUS.md` e `README.md` com `Status: Implementado`
- Se falhar por ambiente (API off, rede CC) → **não** marcar como implementado; documentar na handoff

---

## Fase 7 — Handoff (ponto de parada)

Entregar relatório estruturado:

```markdown
## Handoff — Plano {NN}-{slug}

### Implementado
- API: ...
- WEB: ...
- MANUAL: ...

### Testes
| Comando | Resultado |
|---------|-----------|
| npm run typecheck | passed |
| ... | ... |

### Pendências / fora do escopo
- ...

### Branch
`cursor/plan-{NN}-{slug}-8862` — **sem commit** até pedido explícito
```

Aguardar pedido para:

| Ação | Quando |
|------|--------|
| `commit` | Mensagem: `feat({NN}): {descrição}` |
| `pr` | Via ferramenta ManagePullRequest |
| merge | Só se usuário pedir |

---

## Regras anti-atalho

| # | Obrigatório | Proibido |
|---|-------------|----------|
| 1 | Rodar Bugbot e corrigir críticos | Só "revisão mental" |
| 2 | typecheck + build + smoke/API + manual UI | Pular testes |
| 3 | Atualizar `plans/STATUS.md` quando verde | Marcar Implementado sem STATUS |
| 4 | Handoff com tabela do que rodou | Handoff genérico "tudo ok" |
| 5 | MANUAL.md se feature tem UI | Marcar UI "ok" sem abrir browser |

---

## Índice de planos atuais

Consulte `plans/STATUS.md` para lista atualizada.

| NN | Slug | Foco |
|----|------|------|
| 01 | versoes-e-instrumentos | Principal / Simplificada ✅ |
| 02 | parser-letra-e-tablaturas | Letra, baixo, tablaturas |
| 03 | teclado | Teclado (raro no CC) |
| 04 | ux-seletor-erros | Seletor e mensagens de erro |
| 05 | melhorias-produto | Transposição, offline, UX |
| 06 | self-hosted | Parser no cliente, RN, sem API na nuvem (futuro) |

> **Arquitetura:** `apps/api` é BFF **local** (dev). Plano 06 cobre migração para self-hosted sem hospedar backend. Ver `plans/06-self-hosted/`.

---

## Skills relacionadas

| Skill | Quando |
|-------|--------|
| `implement-plan` (este) | Entrega completa de plano numerado |
| `walkthrough-artifacts` | Evidência visual após testes manuais |
| `browser-use` | Automação de testes no browser |
| Bugbot subagent | Fase 5 (obrigatório) |
