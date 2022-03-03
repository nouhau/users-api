# Nouhau Users API

#### API de usuários da Nohau

### Este projeto usa
- Node
- Typescript
- Jest
- Postgres
- TypeORM

### Como rodar o projeto

1 - Clone os repositórios

- mapping-api
- user-api

2 - Instale o Docker

---
    https://www.docker.com/products/docker-desktop
---


3 - Instale todas as dependências

---
    yarn install
---

4 - Levante o container docker

---
    cd mapping-api
    docker-compose up -d
---

5 - Execute o projeto

---
    yarn service run:dev
---

6 - Acesse a rota principal

<http://localhost:5000/>

7 - Aplique os padrões de código

---
    yarn lint:fix
---

### Testando o projeto

#### Testes unitários

---
    yarn test:unit
---

#### Testes de integração

---
    yarn test:integration
---
