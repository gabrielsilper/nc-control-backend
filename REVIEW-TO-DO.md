# REVIEW-TO-DO.md para o módulo de Não Conformidades

## Crítico

- Proteger todas as rotas de não conformidade com validação de token JWT.
  Hoje apenas o `POST /non-conformities` exige token; `GET`, `PUT` e `PATCH` continuam expostos.

- Adicionar validação de `params` com Zod para todas as rotas que recebem identificadores.
  Validar `id` e `userId` como UUID e rejeitar entradas inválidas com `400`.

- Validar `date` da rota `PATCH /:id/due-date/:date`.
  Hoje o controller faz `new Date(date)` sem garantir que a data recebida é válida.

- Validar duplicidade de `number` também no `update`.
  Atualmente a verificação de número duplicado existe no `create`, mas não no `update`, o que pode resultar em erro de banco sem tratamento padronizado.

## Importante

- Melhorar o tratamento de erro global.
  Mapear erros de constraint do banco para `400` ou `409` e remover `stack` e detalhes internos da resposta `500`.

- Renomear a rota `/:id/assigne/:userId` para um padrão mais claro, como `/:id/assign/:userId`.
  Além do typo, o nome atual foge do padrão esperado para API REST.

- Renomear o arquivo `src/errors/nc-number-already-exists.error copy.ts`.
  O sufixo `copy` indica artefato acidental e quebra o padrão do projeto.

- Reduzir a composição manual de dependências dentro da rota.
  Extrair a criação de controller/service/repository para uma factory ou composição própria do módulo.

- Definir política explícita de autorização por perfil.
  O token já carrega `profile`, então vale decidir quais perfis podem criar, editar, atribuir e encerrar NCs.

## Melhoria

- Adicionar paginação em `findAll`.
  Hoje a listagem retorna tudo de uma vez, o que tende a escalar mal.

- Adicionar filtros e ordenação na listagem.
  Sugestões: `status`, `severity`, `type`, `assignedToId`, `createdById`, `department`, texto de busca e ordenação por data.

- Padronizar validações de request.
  Além de `body`, criar middlewares reutilizáveis para `params` e `query`.

- Revisar o contrato de resposta do módulo.
  Se a listagem ganhar paginação, retornar `data` e `meta` em vez de um array simples.

- Considerar padronizar também transições de status em métodos específicos.
  Exemplo: `start`, `pause`, `verify`, `cancel`, `finish`, em vez de permitir qualquer mudança via `update`.

## Testes Recomendados

- Acesso sem token e com token inválido em todas as rotas de não conformidade.

- `id`, `userId` e `date` inválidos retornando `400`.

- Criação e atualização com `number` duplicado retornando `409`.

- Atribuição para usuário inexistente retornando erro controlado.

- Transições de status válidas e inválidas.

- Listagem com paginação, filtros e ordenação quando essas melhorias forem implementadas.

## Observações

- A checagem estática com `npx tsc --noEmit` passou durante a revisão, então os principais pontos encontrados estão concentrados em segurança, contrato de API, regras de negócio e padronização.

- Este arquivo foi criado como checklist de implementação futura, sem alterar o código atual do módulo.
