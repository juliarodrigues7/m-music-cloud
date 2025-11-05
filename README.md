# M&Music Cloud – Deployment com Azure e Docker Compose

M&Music Cloud é um projeto desenvolvido para demonstrar o uso de Infraestrutura como Serviço (IaaS) na Microsoft Azure, com deploy automatizado via Docker Compose.  
A aplicação utiliza containers Node.js e PostgreSQL, seguindo boas práticas de segurança, persistência e desempenho.

---

## Visão Geral

O objetivo é provisionar uma máquina virtual Linux (Ubuntu) na Azure, configurar o Docker Engine e o Docker Compose, e realizar o deploy automatizado de uma aplicação web com banco de dados.  
O ambiente garante:
- Uso de imagens leves (alpine)
- Execução com usuário não-root
- Persistência de dados entre reinicializações
- Monitoramento de recursos via Azure Monitor

---

## Arquitetura

Azure VM (Ubuntu)

├── Docker Engine

│ ├── mm-web (Node.js - porta 8080)

│ └── mm-db (PostgreSQL - volume persistente)

├── docker-compose.yml

└── docker network (mmusic_default)


---

## Tecnologias Utilizadas

| Camada | Tecnologia | Descrição |
|--------|-------------|-----------|
| Infraestrutura | Microsoft Azure | Hospedagem escalável de VM Linux |
| Containerização | Docker / Docker Compose | Orquestração dos serviços |
| Backend | Node.js 22-alpine | API mínima HTTP |
| Banco de Dados | PostgreSQL 16-alpine | Armazenamento relacional |
| Segurança | Usuário não-root / HTTPS / NSG | Controle de acesso e isolamento |
| DevOps | GitHub | Versionamento e deploy automatizado |

---

## Estrutura do Projeto

/opt/mmusic

├── app/

|└── web/

│ ├── Dockerfile

│ ├── package.json

│ └── server.js

├── docker-compose.yml

└── volumes/

└── db_data/ (persistência)


---

## Passos para Deploy na VM

### 1. Dentro da VM

cd /opt/mmusic
docker compose build
docker compose up -d
docker compose ps

## Saida esperada:

NAME    |     COMMAND    |  STATE    |  PORTS

mm-db   |  "postgres"    |    Up     |  5432/tcp

mm-web  |  "npm start"   |    Up     |  0.0.0.0:8080->8080/tcp

## Teste o endpoint: 
curl http://localhost:8080
Resultado esperado:
{"ok":true,"app":"M&Music","msg":"Hello from Alpine non-root!"}

### Teste de Persistência (PostgreSQL)
docker exec -it mm-db psql -U mmusic -d mmusicdb -c \
"create table if not exists ping(id serial primary key, ts timestamptz default now()); insert into ping default values;"

docker exec -it mm-db psql -U mmusic -d mmusicdb -c "select count(*) from ping;"

## Reinicie os containers e teste novamente:
docker compose down
docker compose up -d
docker exec -it mm-db psql -U mmusic -d mmusicdb -c "select count(*) from ping;"
Segurança e Rede

## Durante o deploy:

Mantenha apenas a porta 22 (SSH) aberta.

Após subir a aplicação, crie uma regra no NSG para a porta 8080/TCP.

Teste o acesso externo:

http://<IP_PUBLICO>:8080

## Projeto Challenge FIAP 
Ambiente: Linux (Ubuntu) – Microsoft Azure

Ferramentas: Docker, Docker Compose, PostgreSQL, Node.js
