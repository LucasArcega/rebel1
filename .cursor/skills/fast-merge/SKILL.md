---
name: fast-merge
description: >-
  Merges the current git branch into main using only git fetch, merge and
  push. No PR, no CI, no checks, no gates. Use when the user asks for
  fast-merge, merge direto, merge simples, merge sem verificação, merge sem
  gate, or to skip PR/CI and land the branch with git only. On conflicts,
  stop and show the conflicted files to the user.
---

# Fast Merge

Só o fluxo git: fetch, merge e push. Sem PR, CI, checks ou resolução automática de conflitos.

Não usar `gh pr merge`, `--admin`, `--force` nem fechar ticket.

**Alvo padrão:** `main`. Se o usuário nomear outro (`develop`, etc.), usar esse.

**Fonte:** branch atual (`HEAD`). Incluir o working tree se o usuário pedir merge de tudo — commitar o trabalho de produto antes do merge; não incluir lixo (`.pnpm-store/`, `dist/`, `node_modules/`).

## Fluxo

```bash
git fetch origin
git merge origin/<alvo>
git push origin HEAD:<alvo>
```

Exemplo para `main`:

```bash
git fetch origin
git merge origin/main
git push origin HEAD:main
```

Não fazer checkout de `main`. Não criar PR. Não esperar CI.

## Conflitos

Se `git merge` parar com conflito:

1. Não resolver.
2. Não rodar `git merge --abort`.
3. Expor o estado e parar:

```bash
git status
git diff --name-only --diff-filter=U
```

Mostrar os arquivos em conflito e, se forem poucos, os hunks. Esperar o usuário decidir.

Se `git push` for recusado, expor a saída completa e parar. Não usar `--force`.

## Depois

Informar origem, alvo, SHA que entrou no remoto e que o merge foi só git, sem PR/CI.
