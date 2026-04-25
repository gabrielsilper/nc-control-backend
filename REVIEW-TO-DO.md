# REVIEW TO-DO — Backend

Itens identificados durante a revisão do frontend contra o PRD
(documento "Tema – 3: Não Conformidades"). Esta lista serve para alinhar o
backend com o que o PRD exige. Nenhum ponto abaixo foi alterado; só
documentado.

---

## 2. Transição automática de status ao atribuir responsável (US02)

**O que existe hoje:** `PATCH /non-conformities/:id/assign/:userId` só
preenche `assignedTo`. O status fica em `ABERTA`.

**O que o PRD pede:** critério de aceite de US02: "Após atribuição com prazo,
o status muda para `em_tratamento` automaticamente".

**Por quê:** consistência do ciclo de vida — NC atribuída não pode ficar
como "aberta sem responsável".

**Ação sugerida:** no service `assign`, se `status === ABERTA` e já existir
`dueDate`, transicionar para `EM_TRATAMENTO`. Alternativa: exigir
`dueDate` no payload do assign e fazer tudo numa call só.

---

## 3. Permitir desassociar responsável (unassign)

**O que existe hoje:** a rota `/assign/:userId` exige um UUID no path; não
há como remover a atribuição.

**O que o PRD pede:** indiretamente — o gestor pode reatribuir; na prática
deve ser possível limpar.

**Ação sugerida:** aceitar `null` ou criar `DELETE /non-conformities/:id/assign`.

---

## 4. Ordenação por `dueDate` na listagem ("minha fila" — US07/RF11)

**O que existe hoje:** `GET /non-conformities` ordena apenas por
`openedAt` (hardcoded em `nonConformityService.findAll`).

**O que o PRD pede:** US07 — "NCs atribuídas a mim, ordenadas por prazo mais
próximo". RF11: "ordenadas por prazo". Critério de aceite: "NCs com prazo
vencido aparecem em destaque no topo".

**Por quê:** a tela "Minha Fila" depende disso para ser útil. Hoje o
frontend teria que ordenar no cliente — quebra com paginação.

**Ação sugerida:** aceitar um campo `orderBy` na query
(ex: `orderBy=dueDate`) ou criar rota dedicada `GET
/non-conformities/my-queue` que já ordena por `dueDate ASC NULLS LAST` e
coloca vencidas no topo.

---

## 5. Listagem pública de usuários ativos (para selects)

**O que existe hoje:** `GET /users` só permite `Profile.GESTOR`.

**O que o PRD pede:** Critério de aceite US02 — "Apenas usuários ativos
aparecem no select de responsável". A tela de detalhe da NC, acessada por
qualquer papel, precisa listar responsáveis possíveis.

**Ação sugerida:**
- Adicionar `active: boolean` em `User` (migrações + seed).
- Criar rota `GET /users/assignees` (ou `?role=RESPONSAVEL&active=true`)
  acessível a qualquer usuário autenticado, devolvendo apenas `id` e `name`.

---

## 6. Campo `active` no usuário

**O que existe hoje:** entidade `User` não tem flag de ativo/inativo; o
endpoint `DELETE /users/:id` provavelmente hard-delete.

**O que o PRD pede:** critério de US02 implica soft-delete (manter
histórico de NCs criadas por usuário desativado).

**Ação sugerida:** adicionar `active: boolean default true` em `User` e
converter `DELETE /users/:id` em soft-delete (set `active = false`).

---

## 8. CRUD completo de ações corretivas (US09/US10 — trio)

**O que existe hoje:**
- `POST /non-conformities/:ncId/corrective-actions` (criar)
- `GET  /non-conformities/:ncId/corrective-actions` (listar)

**O que o PRD pede:** US10 — "marcar minha ação como concluída e registrar
a evidência". Critério: "Concluir exige preenchimento do campo evidência".

**Ação sugerida:**
- `PATCH /corrective-actions/:id` — atualiza `status`, `evidence`,
  `finishedAt` (automático se `status = CONCLUIDA`).
- `DELETE /corrective-actions/:id`.
- Validar no service que `status = CONCLUIDA` só é aceita se `evidence`
  estiver preenchido.

---

## 9. Filtro `expired` como boolean

**O que existe hoje:** `findNonConformitiesQuerySchema` aceita
`expired=0|1` e converte para boolean.

**O que o PRD pede:** padrão REST é `?expired=true|false`.

**Ação sugerida:** aceitar `true`/`false` (via `z.coerce.boolean()` com
refinamento) — é backwards-compatible se mantiver aceitando 0/1.

---

## 10. Endpoint de histórico (RF14 — trio)

**O que existe hoje:** não existe.

**O que o PRD pede:** tabela `historico_nc(id, nc_id, usuario_id,
status_anterior, status_novo, observacao, timestamp)`. Exibir na tela de
detalhe da NC.

**Ação sugerida (trio):** nova entidade + gatilho no `updateStatus` para
inserir linha a cada mudança. Endpoint `GET /non-conformities/:id/history`.

---

## 12. Mapeamento de erros de constraint → 400/409

**O que existe hoje:** erros de constraint (unique violation de `number`,
FK inválida em `assignedTo`) sobem como 500 pelo error handler.

**O que o CLAUDE.md pede:** mapear para 400/409.

**Ação sugerida:** no `error-handler.middleware`, inspecionar
`QueryFailedError` e converter códigos postgres (23505 → 409, 23503 →
400).

---

## 13. Endpoint de dashboard para perfis não-GESTOR (RF09/RF10)

**O que existe hoje:** `GET /non-conformities/counts` e
`/non-conformities/ranking` exigem `Profile.GESTOR`.

**O que o PRD pede:** o dashboard é descrito como uma das telas principais;
o sistema redireciona todo usuário autenticado para `/app/dashboard`
(ver `app.routes.ts`). Hoje, `OPERADOR` e `RESPONSAVEL` entram no app e o
dashboard simplesmente quebra com 403.

**Ação sugerida:** ou liberar os endpoints de dashboard para qualquer
usuário autenticado, ou o frontend precisa rotear `RESPONSAVEL` direto
para `/app/my-queue`. De preferência as duas coisas.

---

## 14. Contagem `openNonConformities` no dashboard (US05)

**O que existe hoje:** `getDashboardCounts` conta apenas status =
`ABERTA`.

**O que o PRD pede:** US05 — "quantas NCs estão abertas". No contexto de
qualidade, "aberta" = qualquer NC não encerrada e não cancelada, ou seja,
`ABERTA + EM_TRATAMENTO + AGUARDANDO_VERIFICACAO`.

**Ação sugerida:** trocar a condição para `status NOT IN (ENCERRADA,
CANCELADA)`. Se quiser manter a semântica atual, renomear a chave para
`newlyOpenNonConformities` e adicionar outra.

---

## 15. Transição `AGUARDANDO_VERIFICACAO → CANCELADA` ausente

**O que existe hoje:** em `allowedTransitions`, `AGUARDANDO_VERIFICACAO`
só pode ir para `ENCERRADA` ou `EM_TRATAMENTO`.

**O que o PRD pede:** a tabela de ciclo de vida mostra `em_tratamento ->
cancelada`. Ok hoje. Mas o PRD também deixa implícito que o gestor pode
cancelar em qualquer momento antes do encerramento — cogitar permitir
`AGUARDANDO_VERIFICACAO -> CANCELADA` por perfil GESTOR.

**Ação sugerida:** revisar com o time se cancelamento deve ser sempre
permitido para gestor.

---

