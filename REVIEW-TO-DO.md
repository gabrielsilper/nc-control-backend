## Crítico

- Definir política explícita de autorização por perfil.
  O token já carrega `profile`, então vale decidir quais perfis podem criar, editar, atribuir e encerrar NCs.

## Importante

- Melhorar o tratamento de erro global.
  Mapear erros de constraint do banco para `400` ou `409` e remover `stack` e detalhes internos da resposta `500`.

- Reduzir a composição manual de dependências dentro da rota.
  Extrair a criação de controller/service/repository para uma factory ou composição própria do módulo.

## Melhoria

- Adicionar paginação em `findAll`.
  Hoje a listagem retorna tudo de uma vez, o que tende a escalar mal.

- Adicionar filtros e ordenação na listagem.
  Sugestões: `status`, `severity`, `type`, `assignedToId`, `createdById`, `department`, texto de busca e ordenação por data.

- Padronizar validações de request.
  Além de `body` e `params`, criar middlewares reutilizáveis para `query`.

- Revisar o contrato de resposta do módulo.
  Se a listagem ganhar paginação, retornar `data` e `meta` em vez de um array simples.
