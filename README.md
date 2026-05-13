# NC Control — API Backend

API REST para gestão de Não Conformidades (NCs) em ambiente industrial. Construída com **Node.js + TypeScript**, **Express 5**, **TypeORM** e **PostgreSQL**.

---

## Início Rápido

> A seed popula automaticamente o banco com usuários e NCs de exemplo na primeira inicialização — basta subir e logar.

### Passo 1 — Configure o ambiente

```bash
cp .env.example .env
```

### Passo 2 — Suba o banco de dados

```bash
docker compose up postgres-server -d
```

Aguarde o container ficar saudável:

```bash
docker ps
```

O container `postgres-server` deve aparecer com status `healthy`.

### Passo 3 — Instale as dependências

```bash
npm install
```

### Passo 4 — Inicie a API

```bash
npm run dev
```

O script `predev` executa a seed automaticamente antes de iniciar o servidor. Aguarde a saída:

```
Initialized database connection successfully.
Server is running on port 3000
```

### Passo 5 — Faça login

A seed cria os seguintes usuários prontos para uso:

| Nome | Email | Senha | Perfil |
|------|-------|-------|--------|
| Ana Martins | `ana.martins@nc-control.local` | `12345678` | GESTOR |
| Bruno Costa | `bruno.costa@nc-control.local` | `12345678` | RESPONSAVEL |
| Diego Ferreira | `diego.ferreira@nc-control.local` | `12345678` | RESPONSAVEL |
| Carla Souza | `carla.souza@nc-control.local` | `12345678` | OPERADOR |

> A seed também insere 10 NCs de exemplo (NC-2026-0001 a NC-2026-0010) com histórico e ação corretiva. É idempotente: re-executar não duplica dados.

Faça login no Postman:

| Campo | Valor |
|-------|-------|
| Método | `POST` |
| URL | `http://localhost:3000/api/v1/auth/login` |
| Body | `raw` → `JSON` |

```json
{
  "email": "ana.martins@nc-control.local",
  "password": "12345678"
}
```

Resposta `200 OK`:

```json
{
  "tokens": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Passo 6 — Use o token nas rotas protegidas

No Postman: aba **Authorization** → tipo **Bearer Token** → cole o `accessToken`.

O token expira em **15 minutos**. Quando isso acontecer, use `/api/v1/auth/refresh`.

---

## Tecnologias

- Node.js 20 + TypeScript
- Express 5
- TypeORM + PostgreSQL 16
- JWT (access token 15min + refresh token 7d)
- Bcrypt — hash de senhas
- Zod — validação de entrada
- Biome — lint e formatação
- Docker + Docker Compose

---

## Pré-requisitos

- [Node.js 20+](https://nodejs.org/)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado e **rodando**

---

## Variáveis de Ambiente

Copie o arquivo de exemplo e ajuste conforme necessário:

```bash
cp .env.example .env
```

Conteúdo do `.env.example`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=admin
DB_PASS=admin@2026
DB_NAME=nc-control-db

PGADMIN_PORT=8080
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin@2026

JWT_ACCESS_SECRET=your_jwt_access_secret_key
JWT_ACCESS_EXPIRATION=15m

FRONTEND_URL='http://localhost:4200'

EXPIRES_DAYS=7

APP_PORT=3000
```

> Em produção, substitua `JWT_ACCESS_SECRET` por uma string longa e aleatória.

---

## Como rodar — Desenvolvimento Local

### 1. Suba o banco de dados

```bash
docker compose up postgres-server -d
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Inicie a API

```bash
npm run dev
```

O `predev` executa a seed automaticamente. A API estará disponível em **`http://localhost:3000`**.

---

## pgAdmin — Interface Web para o banco

```bash
docker compose up pg-admin-web -d
```

Acesse **`http://localhost:8080`** e faça login com as credenciais definidas em `.env` (`PGADMIN_DEFAULT_EMAIL` / `PGADMIN_DEFAULT_PASSWORD`).

---

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia em modo dev com hot reload (seed automática via `predev`) |
| `npm run seed:non-conformities` | Executa a seed manualmente |
| `npm run biome:check` | Lint e formatação com Biome |

---

## Endpoints completos

Base URL: `http://localhost:3000/api/v1`

### Health Check

```
GET http://localhost:3000/api/v1/live
```

Resposta: `Non Conformity Control v1 is live!`

---

### Autenticação

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/login` | Não | Login |
| POST | `/auth/refresh` | Não | Renovar access token |
| POST | `/auth/logout` | Não | Encerrar sessão atual |
| POST | `/auth/logout/all` | Sim | Encerrar todas as sessões |
| GET | `/auth/me` | Sim | Dados do usuário autenticado |

#### Login

```
POST http://localhost:3000/api/v1/auth/login
```

```json
{
  "email": "ana.martins@nc-control.local",
  "password": "12345678"
}
```

#### Refresh Token

Quando o `accessToken` expirar (15min):

```
POST http://localhost:3000/api/v1/auth/refresh
```

```json
{
  "refreshToken": "eyJ..."
}
```

#### Logout

```
POST http://localhost:3000/api/v1/auth/logout
```

```json
{
  "refreshToken": "eyJ..."
}
```

---

### Usuários

Todos os endpoints requerem autenticação.

| Método | Rota | Perfil mínimo | Descrição |
|--------|------|---------------|-----------|
| POST | `/users` | GESTOR | Criar usuário |
| GET | `/users` | GESTOR | Listar usuários |
| GET | `/users/:id` | Self ou GESTOR | Buscar por ID |
| PUT | `/users/:id` | Self ou GESTOR | Atualizar dados |
| DELETE | `/users/:id` | GESTOR | Remover |

#### Criar usuário

```
POST http://localhost:3000/api/v1/users
Authorization: Bearer <accessToken>
```

```json
{
  "name": "Maria Oliveira",
  "email": "maria.oliveira@nc-control.local",
  "password": "Senha@2026",
  "profile": 0
}
```

**Regras:**
- `name` — 3 a 50 caracteres, apenas letras e espaços
- `password` — 8 a 25 caracteres, deve ter letra maiúscula, minúscula, número e caractere especial
- `email` — endereço de e-mail válido
- `profile` — `0` OPERADOR | `1` RESPONSAVEL | `2` GESTOR

---

### Não Conformidades

Todos os endpoints requerem autenticação.

| Método | Rota | Perfil mínimo | Descrição |
|--------|------|---------------|-----------|
| POST | `/non-conformities` | Qualquer | Registrar NC |
| GET | `/non-conformities` | Qualquer | Listar com filtros |
| GET | `/non-conformities/my-queue` | RESPONSAVEL | Fila atribuída ao usuário |
| GET | `/non-conformities/counts` | GESTOR | Contagens para o dashboard |
| GET | `/non-conformities/ranking` | GESTOR | Ranking de NCs por tipo |
| GET | `/non-conformities/:id` | Qualquer | Buscar por ID |
| GET | `/non-conformities/:id/history` | Qualquer | Histórico de eventos da NC |
| PUT | `/non-conformities/:id` | RESPONSAVEL | Atualizar NC |
| PATCH | `/non-conformities/:id/status/:status` | RESPONSAVEL | Atualizar status |
| PATCH | `/non-conformities/:id/assign` | GESTOR | Atribuir responsável |
| PATCH | `/non-conformities/:id/due-date/:date` | GESTOR | Definir prazo |
| POST | `/non-conformities/:ncId/corrective-actions` | RESPONSAVEL | Criar ação corretiva |
| GET | `/non-conformities/:ncId/corrective-actions` | Qualquer | Listar ações corretivas |
| PATCH | `/non-conformities/:ncId/corrective-actions/:caId` | RESPONSAVEL | Atualizar ação corretiva |

#### Criar NC

```
POST http://localhost:3000/api/v1/non-conformities
Authorization: Bearer <accessToken>
```

```json
{
  "title": "Produto fora de tolerância na linha 03",
  "description": "Amostra apresentou variação acima do limite definido no plano de controle.",
  "type": 0,
  "severity": 2,
  "processLine": "Usinagem linha 03",
  "department": "Produção"
}
```

#### Listar NCs com filtros

```
GET http://localhost:3000/api/v1/non-conformities?status=0&severity=2
Authorization: Bearer <accessToken>
```

---

## Enums — Valores aceitos pela API

Todos os campos de enum usam **valores numéricos**.

| Campo | Valores |
|-------|---------|
| `profile` | `0` OPERADOR · `1` RESPONSAVEL · `2` GESTOR |
| `type` (NC) | `0` PRODUTO · `1` PROCESSO · `2` MATERIAL · `3` SEGURANCA · `4` OUTRO |
| `severity` | `0` BAIXA · `1` MEDIA · `2` ALTA · `3` CRITICA |
| `status` (NC) | `0` ABERTA · `1` EM_TRATAMENTO · `2` AGUARDANDO_VERIFICACAO · `3` ENCERRADA · `4` CANCELADA |

#### Transições de status permitidas

```
ABERTA (0)
  └─► EM_TRATAMENTO (1)
        ├─► AGUARDANDO_VERIFICACAO (2)
        │     ├─► ENCERRADA (3)
        │     └─► EM_TRATAMENTO (1)
        └─► CANCELADA (4)
```

---

## Estrutura do Projeto

```
src/
├── config/         # Variáveis de ambiente e JWT
├── controllers/    # Handlers HTTP
├── database/       # Conexão TypeORM (appDataSource)
├── entities/       # Entidades do banco
├── enums/          # Perfis, status, tipos, severidade
├── errors/         # Classes de erro customizadas
├── interfaces/     # Contratos de serviços
├── mappers/        # Conversão entidade → DTO
├── middlewares/    # Validação de body, params, query, auth
├── repositories/   # Acesso ao banco por entidade
├── routes/         # Definição das rotas
├── schemas/        # Schemas Zod de validação
├── scripts/        # seed-non-conformities.ts
├── services/       # Lógica de negócio
├── types/          # Extensões de tipos (express.d.ts)
├── utils/          # Bcrypt helper
└── server.ts       # Entry point
```
