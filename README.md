# CRUD-APS

Este é um projeto de CRUD (Create, Read, Update, Delete) desenvolvido com React, Node.js, Express e MySQL. Ele foi configurado para ser facilmente executado usando Docker, proporcionando um ambiente de desenvolvimento isolado e fácil de configurar.

## Tecnologias usadas

- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express
- **Banco de dados**: MySQL
- **Docker**: Para orquestrar o ambiente de desenvolvimento (containers)
  
## Requisitos

Antes de rodar o projeto, você precisará ter o seguinte instalado em sua máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Como rodar o projeto localmente

### 1. Clone este repositório

Clone este repositório para sua máquina local:
```bash
git clone <url_do_repositório>
cd <diretório_do_projeto>
```
## 2. Monte o projeto usando Docker Compose

Rode esse código no seu terminal quando já estiver na pasta root/raíz do projeto.

```bash
docker-compose up --build
```
## 3. Parar o projeto

Se quiser parar os serviços do projeto, basta utilizar o seguinte comando no terminal:

```bash
docker-compose down
```
