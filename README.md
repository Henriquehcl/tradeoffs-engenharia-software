# Desafio Técnico Fullstack

> **"Se uma mesa possui três pernas chamadas qualidade, preço baixo e velocidade, ela seria capenga."**

Aplicação SPA que demonstra o triângulo de tradeoffs da engenharia de software, com um fluxo de humor progressivo e integração com uma API de piadas geek.

---

## Arquitetura

```
project-root/
├── backend/          # NestJS + Prisma + PostgreSQL
├── frontend/         # Vue.js 3 + Pinia + Vuetify
├── docker-compose.yml
└── README.md
```

### Fluxo de dados

```
Browser (Vue SPA)
  └─► Nginx (:3000)
        └─► NestJS Backend (:3001)
              ├─► PostgreSQL (:5432)
              └─► geek-jokes API (externo)
```

---

## Tecnologias

| Camada      | Tecnologia                                          |
|-------------|-----------------------------------------------------|
| Frontend    | Vue.js 3, Pinia, Vuetify 3, Vue Router, Axios       |
| Backend     | NestJS, Prisma ORM, Passport-JWT, bcrypt, Swagger   |
| Banco       | PostgreSQL 16                                       |
| Testes      | Jest (unitário + integração)                        |
| Infra       | Docker, Docker Compose, Nginx                       |

---

## Como rodar

### Pré-requisitos

- Docker + Docker Compose instalados

### Executar

```bash
docker-compose up --build
```

Acesse: **http://localhost:3000**

| Recurso       | URL                              |
|---------------|----------------------------------|
| Aplicação     | http://localhost:3000            |
| Swagger/Docs  | http://localhost:3001/api/docs   |
| Backend API   | http://localhost:3001/api        |

### Credenciais do usuário inicial

| Campo | Valor                                                                              |
|-------|------------------------------------------------------------------------------------|
| Email | cliente@incuca.com.br                                                              |
| Senha | user@2026    |

---

## Fluxo da aplicação

```
/login
  └─► /inicial  :|   (clique)
        └─► /triste  :(   (clique → busca piada)
              └─► /poker-face  :-|   (piada em modal, timer 4s)
                    └─► /feliz  :)   (pode fechar modal)
                          └─► /inicial
```

---

## Rotas da API

### Autenticação
| Método | Rota               | Descrição                     |
|--------|--------------------|-------------------------------|
| POST   | /api/auth/login    | Login, retorna JWT            |
| GET    | /api/auth/profile  | Perfil do usuário autenticado |

### Tradeoffs (protegido por JWT)
| Método | Rota                | Descrição               |
|--------|---------------------|-------------------------|
| POST   | /api/tradeoffs      | Criar tradeoff          |
| GET    | /api/tradeoffs      | Listar tradeoffs        |
| GET    | /api/tradeoffs/:id  | Obter por ID            |
| PATCH  | /api/tradeoffs/:id  | Atualizar parcialmente  |
| DELETE | /api/tradeoffs/:id  | Remover                 |

### Piadas (protegido por JWT)
| Método | Rota         | Descrição                          |
|--------|--------------|------------------------------------|
| GET    | /api/jokes   | Piada geek via API externa         |

---

## Estimativa de horas

### 1. Implementação dos requisitos

| Tarefa                                  | Horas |
|-----------------------------------------|-------|
| Setup Docker + infraestrutura           | 2h    |
| Backend NestJS + Prisma + JWT           | 6h    |
| Integração API de piadas                | 1h    |
| Frontend Vue + Pinia + Vuetify          | 8h    |
| Fluxo de humor (roteamento + animações) | 3h    |
| Testes unitários e de integração        | 4h    |
| Documentação (Swagger + README)         | 1h    |
| **Total**                               | **25h** |

### 2. Possíveis evoluções

| Evolução                                        | Horas estimadas |
|-------------------------------------------------|-----------------|
| Dashboard de gerenciamento de tradeoffs         | 8h              |
| Autenticação OAuth (Google/GitHub)              | 4h              |
| Histórico de sessões e replay do humor          | 6h              |
| Testes E2E com Playwright/Cypress               | 5h              |
| Deploy em produção (CI/CD + nuvem)              | 6h              |
| Internacionalização (i18n)                      | 3h              |

---

## Justificativa das tecnologias

**Vue.js 3 + Composition API**: Framework progressivo, excelente DX com `<script setup>`, reatividade eficiente e ecossistema maduro.

**Pinia**: Store oficial do Vue 3. API simples e intuitiva, totalmente tipada, sem boilerplate desnecessário.

**Vuetify 3**: Biblioteca de UI baseada em Material Design, rico conjunto de componentes prontos, acelerou muito o desenvolvimento do frontend.

**NestJS**: Framework opinionado para Node.js com arquitetura modular inspirada no Angular. Excelente suporte a TypeScript, injeção de dependências e Swagger nativo.

**Prisma**: ORM moderno com migrations, type-safety automática e schema declarativo. Muito produtivo com PostgreSQL.

**PostgreSQL**: Banco relacional robusto, excelente suporte a UUID e restrições de integridade.

**Docker Compose**: Permite rodar todo o ambiente com um único comando, garantindo reprodutibilidade.
