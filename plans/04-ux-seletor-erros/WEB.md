# WEB — Plano 04

## Escopo

| Camada | Arquivos |
|--------|----------|
| pages | `song/ui/song-page.tsx` |
| features | `fetch-chord/chord-repository.ts`, `select-version/` |
| shared | `shared/api/http-client.ts` (se necessário) |

## Checklist

- [ ] Mapear `error.code` da API para mensagens em português
- [ ] Desabilitar/ocultar versões sem parser (até plano 02 concluir)
- [ ] Indicador visual "em breve" vs disponível (opcional visual, obrigatório funcional)

## Critérios por instrumento

| Instrumento | Habilitar quando |
|-------------|------------------|
| cifra principal/simplificada | ✅ |
| lyrics | Plano 02 |
| bass | Plano 02 |
| drums, harmonica | ✅ (formato E\|) |
| keyboard | Plano 03 |
