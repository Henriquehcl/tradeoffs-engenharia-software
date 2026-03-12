# 🏗️ Desafio Técnico Fullstack

> **"Se uma mesa possui três pernas chamadas qualidade, preço baixo e velocidade, ela seria capenga."**

Sistema fullstack profissional para gerenciamento de **tradeoffs de engenharia de software**, implementando o conceito clássico do triângulo de restrições: é impossível otimizar qualidade, custo baixo e velocidade simultaneamente.

---

## 📋 Índice

- [Descrição](#-descrição)
- [Arquitetura](#-arquitetura-do-sistema)
- [Stack Tecnológica](#-stack-tecnológica)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Como Rodar](#-como-rodar-o-projeto)
- [Autenticação](#-fluxo-de-autenticação)
- [API Documentation](#-api-documentation)
- [Testes](#-testes)
- [CI/CD](#-cicd)
- [Docker](#-docker)
- [Estimativa de Esforço](#-estimativa-de-esforço)
- [Evolução do Produto](#-evolução-do-produto)

---

## 📖 Descrição

O **Tradeoff Manager** é uma aplicação fullstack que permite registrar e analisar diferentes cenários de tradeoff em projetos de engenharia. Cada registro possui três scores (0-100) representando:

- **Qualidade** — Quão bem feito é o resultado
- **Preço Baixo** — Quão barato é o projeto  
- **Velocidade** — Quão rápido é entregue

A premissa é que a soma dos três scores idealmente não ultrapassa 200 pontos, refletindo a impossibilidade de maximizar tudo simultaneamente (a "mesa capenga").

### Funcionalidades

- ✅ Autenticação JWT (login + registro)
- ✅ Persistência de sessão (localStorage)
- ✅ CRUD completo de tradeoffs
- ✅ Paginação, busca e filtros
- ✅ Dashboard com métricas
- ✅ Visualização de scores com barras de progresso
- ✅ Diagnóstico automático de viabilidade
- ✅ Design dark theme premium
- ✅ Documentação Swagger (OpenAPI)
- ✅ Testes unitários e de integração
- ✅ Docker Compose (1 comando para rodar)
- ✅ CI/CD com GitHub Actions

---

## 🏛️ Arquitetura do Sistema

### Visão Geral

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│  PostgreSQL   │
│  React/Vite  │     │   NestJS     │     │              │
│  (nginx:80)  │     │  (:3001)     │     │  (:5432)     │
└─────────────┘     └─────────────┘     └──────────────┘
     :3000              :3001                :5432
```

### Fluxo de Requisições

1. **Browser** acessa `http://localhost:3000`
2. **Nginx** serve arquivos estáticos do React
3. Requisições `/api/*` são redirecionadas via **proxy reverso** para o backend
4. **NestJS** processa a requisição através de:
   - Middleware de logging
   - Guard de autenticação (JWT)
   - Validação de DTOs
   - Service (lógica de negócio)
   - Prisma ORM (acesso ao banco)
5. **PostgreSQL** persiste os dados
6. Resposta volta pelo mesmo caminho, passando pelo **TransformInterceptor** para padronização

### Camadas do Backend

| Camada | Responsabilidade |
|--------|-----------------|
| **Controller** | Recebe requisições HTTP, valida DTOs, delega para services |
| **Service** | Lógica de negócio, regras, transformações |
| **Prisma/Repository** | Acesso ao banco de dados |
| **Guard** | Autenticação e autorização |
| **Interceptor** | Logging, transformação de respostas |
| **Filter** | Tratamento global de exceções |
| **DTO** | Validação e tipagem de dados de entrada/saída |

---

## 🛠️ Stack Tecnológica

### Backend
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| Node.js | 20 | Runtime JavaScript |
| NestJS | 10 | Framework backend |
| TypeScript | 5.3 | Tipagem estática |
| Prisma | 5.8 | ORM para PostgreSQL |
| Passport + JWT | - | Autenticação |
| bcrypt | 5.1 | Hash de senhas |
| Swagger | 7.2 | Documentação API |
| Winston | 3.11 | Logs estruturados |

### Frontend
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| React | 18 | UI Library |
| Vite | 5 | Build tool |
| TypeScript | 5.3 | Tipagem estática |
| React Router | 6 | Roteamento SPA |
| Axios | 1.6 | Cliente HTTP |
| React Hot Toast | 2.4 | Notificações |

### Infraestrutura
| Tecnologia | Propósito |
|-----------|-----------|
| Docker | Containerização |
| Docker Compose | Orquestração |
| nginx | Servidor web + reverse proxy |
| GitHub Actions | CI/CD |
| ESLint + Prettier | Qualidade de código |
| Husky | Git hooks |
| Jest | Testes |

---

## 📁 Estrutura de Pastas

```
desafio-tecnico/
├── backend/
│   ├── prisma/
│   │   ├── migrations/          # Migrações do banco
│   │   ├── schema.prisma        # Schema do banco de dados
│   │   └── seed.ts              # Dados iniciais
│   ├── src/
│   │   ├── common/
│   │   │   ├── filters/         # Filtro global de exceções
│   │   │   ├── guards/          # JwtAuthGuard
│   │   │   └── interceptors/    # Logging + Transform
│   │   ├── config/              # Configurações
│   │   ├── database/            # PrismaService
│   │   ├── modules/
│   │   │   ├── auth/            # Login, registro, JWT
│   │   │   ├── users/           # Gerenciamento de usuários
│   │   │   └── tradeoffs/       # CRUD da entidade principal
│   │   ├── app.module.ts        # Módulo raiz
│   │   └── main.ts              # Entry point + Swagger
│   ├── test/                    # Testes E2E
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── context/             # AuthContext
│   │   ├── hooks/               # useAuth
│   │   ├── pages/               # Login + Dashboard
│   │   ├── services/            # API client (Axios)
│   │   ├── App.tsx              # Componente raiz + rotas
│   │   ├── main.tsx             # Entry point
│   │   └── index.css            # Design system
│   ├── nginx.conf               # Config nginx produção
│   ├── Dockerfile
│   └── package.json
├── .github/workflows/ci.yml     # Pipeline CI/CD
├── .husky/pre-commit            # Git hook
├── docker-compose.yml           # Orquestração Docker
└── README.md                    # Este arquivo
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/install/)

### Execução com Docker (recomendado)

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd desafio-tecnico

# Subir todos os serviços
docker-compose up --build
```

Após subir:
- 🌐 **Aplicação**: http://localhost:3000
- 📚 **Swagger**: http://localhost:3001/api/docs
- 👤 **Usuário teste**: admin@desafio.com / senha123

### Execução Local (desenvolvimento)

```bash
# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

---

## 🔐 Fluxo de Autenticação

```
┌────────┐    POST /auth/register    ┌─────────┐    hash(senha)    ┌────────┐
│ Client │ ──────────────────────▶  │ Backend │ ──────────────▶   │   DB   │
│        │    { email, senha }       │         │    save user      │        │
│        │ ◀──────────────────────  │         │ ◀──────────────   │        │
│        │    { access_token }       │         │    user created   │        │
└────────┘                          └─────────┘                   └────────┘

1. Usuário envia email + senha
2. Backend hasheia senha com bcrypt (10 rounds)
3. Cria usuário no PostgreSQL
4. Gera token JWT com { sub: userId, email }
5. Retorna token ao cliente
6. Frontend salva token no localStorage
7. Todas as requisições incluem: Authorization: Bearer <token>
8. JwtAuthGuard valida o token em rotas protegidas
9. Se o token expirar (401), logout automático
```

### Persistência de Sessão

- Token JWT salvo em `localStorage` com chave `@desafio-tecnico:token`
- Ao recarregar a página, o `AuthContext` recupera o token do `localStorage`
- O token é automaticamente incluído em todas as requisições via Axios interceptor
- Em caso de resposta `401`, o logout é executado automaticamente

---

## 📚 API Documentation

A documentação interativa da API está disponível via **Swagger (OpenAPI)** em:

```
http://localhost:3001/api/docs
```

### Endpoints Principais

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/api/auth/register` | Registrar usuário | ❌ |
| POST | `/api/auth/login` | Login | ❌ |
| GET | `/api/auth/profile` | Perfil do usuário | ✅ |
| GET | `/api/users` | Listar usuários | ✅ |
| GET | `/api/seumamesapossuir...` | Listar tradeoffs | ✅ |
| POST | `/api/seumamesapossuir...` | Criar tradeoff | ✅ |
| GET | `/api/seumamesapossuir.../:id` | Obter tradeoff | ✅ |
| PATCH | `/api/seumamesapossuir.../:id` | Atualizar tradeoff | ✅ |
| DELETE | `/api/seumamesapossuir.../:id` | Deletar tradeoff | ✅ |

---

## 🧪 Testes

### Testes Unitários

```bash
cd backend
npm test
```

Coberturas:
- `AuthService`: registro, login, geração de token, credenciais inválidas
- `AuthController`: endpoints de registro, login, perfil
- `TradeoffsService`: CRUD completo, paginação, erros

### Testes de Integração (E2E)

```bash
cd backend
npm run test:e2e
```

Coberturas:
- Registro de usuário via API
- Rejeição de dados inválidos
- Proteção de rotas sem token
- CRUD completo com autenticação

### Coverage

```bash
cd backend
npm run test:cov
```

---

## 🔄 CI/CD

### GitHub Actions Pipeline

O pipeline é executado automaticamente a cada `push` ou `pull request` para `main`.

```
Push/PR → Install → Lint → Test → Build
```

**Jobs:**
1. **Backend**: `npm ci` → `prisma generate` → `lint` → `test` → `test:e2e` → `build`
2. **Frontend**: `npm ci` → `build`

Arquivo: `.github/workflows/ci.yml`

---

## 🐳 Docker

### Serviços

| Serviço | Imagem | Porta | Descrição |
|---------|--------|-------|-----------|
| postgres | postgres:16-alpine | 5432 | Banco de dados |
| backend | node:20-alpine (multi-stage) | 3001 | API NestJS |
| frontend | nginx:alpine (multi-stage) | 3000 | React + nginx |

### Comandos

```bash
# Subir todos os serviços
docker-compose up --build

# Subir em background
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Limpar volumes (apaga dados do banco)
docker-compose down -v
```

---

## ⏱️ Estimativa de Esforço

### 1 — Implementação dos Requisitos Obrigatórios

| Atividade | Horas | Justificativa |
|-----------|-------|---------------|
| Planejamento de arquitetura | 2h | Definição de módulos, camadas, fluxos e schemas |
| Configuração inicial | 2h | Setup NestJS, Vite, ESLint, Prettier, Prisma |
| Implementação do backend | 8h | 3 módulos (auth, users, tradeoffs) com DTOs, guards, interceptors |
| Implementação do frontend | 8h | Login, Dashboard, modal CRUD, contexto, design system |
| Autenticação JWT | 3h | Strategy, guard, bcrypt, token management |
| Persistência de sessão | 1h | LocalStorage + interceptors Axios |
| CRUD da entidade principal | 4h | Paginação, busca, filtros, validações |
| Testes automatizados | 4h | Unitários (auth, tradeoffs) + E2E |
| Documentação | 2h | README, Swagger, comentários |
| Dockerização | 3h | Dockerfiles multi-stage, compose, nginx |
| **TOTAL** | **37h** | ~5 dias úteis de trabalho |

**Lógica da estimativa:** Baseada em experiência com projetos NestJS + React similares. Considera um desenvolvedor sênior trabalhando sozinho, incluindo debugging, ajustes e revisão. Em equipe de 2-3 devs, o tempo cairia para ~3 dias úteis.

### 2 — Evolução do Produto

| Melhoria | Horas | Descrição |
|----------|-------|-----------|
| Rate limiting | 3h | Throttle por IP/usuário com @nestjs/throttler |
| Caching (Redis) | 5h | Cache de queries frequentes, invalidação |
| Observabilidade (APM) | 6h | OpenTelemetry, tracing, métricas Prometheus |
| Filas assíncronas | 8h | Bull/BullMQ para jobs em background |
| Monitoramento (Grafana) | 5h | Dashboards, alertas, health checks |
| Auditoria (logs) | 4h | Log de todas as ações de CRUD com usuário/IP |
| Métricas de negócio | 3h | Agregações, relatórios, exportação CSV |
| Segurança avançada | 6h | CSRF, helmet, rate limit, refresh tokens |
| Roles e permissões | 5h | RBAC com roles admin/user |
| Upload de arquivos | 4h | Anexos em tradeoffs (S3/MinIO) |
| Notificações real-time | 5h | WebSockets com @nestjs/websockets |
| Internacionalização | 4h | i18n com pt-BR e en-US |
| **TOTAL EVOLUÇÃO** | **58h** | ~8 dias úteis adicionais |

---

## 📄 Licença

MIT License — uso livre para fins educacionais e profissionais.
