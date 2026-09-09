# WEB — Plano 06 (self-hosted sem API na nuvem)

## Limitação fundamental

SPA estática no browser **não pode** buscar `https://www.cifraclub.com.br/...` de forma confiável — **CORS** bloqueia a resposta.

Por isso `apps/api` existe hoje: roda em `localhost` e o Vite faz proxy de `/api`.

## Opções para web self-hosted

### Opção A — Manter API só local (status quo estendido)

| Prós | Contras |
|------|---------|
| Web funciona hoje | Usuário precisa rodar Node localmente |
| Zero nuvem | Não é "um clique" para usuário final |

```bash
npm run dev:api && npm run dev:web
```

**Uso:** desenvolvimento e power users. Não é deploy estático puro.

---

### Opção B — Desktop wrapper (Electron / Tauri)

| Prós | Contras |
|------|---------|
| Um instalável na máquina do usuário | Pacote maior; manutenção extra |
| Fetch CC sem CORS (main process ou native) | Não é "site no browser" |
| Parser em shared | Build por SO |

Fluxo:

```
apps/desktop → usa @cifra-hub/shared → fetch CC no main process
              → UI React (reutiliza apps/web ou fork)
```

**Melhor candidato** a "web self-hosted" sem nuvem para usuário final.

---

### Opção C — PWA offline-only

| Prós | Contras |
|------|---------|
| Deploy estático (GitHub Pages, etc.) | Sem busca ao vivo no CC |
| Parser no client para cifras já cacheadas | Experiência muito limitada |

Só viável como complemento à biblioteca offline, não como app completo.

---

### Opção D — Extensão de browser

Fetch em `background.js` com permissões de host `cifraclub.com.br`.

Fora do escopo inicial; mencionar como alternativa futura.

## Recomendação

| Target | Caminho |
|--------|---------|
| Dev / você mesmo | Opção A (`apps/api` local) — **atual** |
| Usuário final sem nuvem | Opção B (desktop) ou **mobile (RN)** |
| Site estático público | Opção C (só offline) — fraco |

## Checklist Fase 6f (quando executar)

- [ ] Decidir B (desktop) vs manter A apenas
- [ ] Se B: scaffold `apps/desktop` com Tauri ou Electron
- [ ] Reutilizar `apps/web` build dentro do shell desktop
- [ ] Documentar instalação para usuário final (sem `npm run dev:api`)

## O que NÃO fazer

- Deploy de `apps/api` em servidor público (contradiz self-hosted sem hospedagem sua)
- Prometer "web puro" com busca ao vivo sem wrapper ou API local
