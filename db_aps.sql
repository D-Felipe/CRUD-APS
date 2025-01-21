CREATE DATABASE db_aps;

USE db_aps;

CREATE TABLE clients(
    CNPJ VARCHAR(14),
    NOME VARCHAR(100),
    NOMEFANTASIA VARCHAR(100),
    CEP VARCHAR(10),
    LOGRADOURO VARCHAR(100),
    BAIRRO VARCHAR(100),
    CIDADE VARCHAR(100),
    UF VARCHAR(2),
    COMPLEMENTO VARCHAR(100),
    EMAIL VARCHAR(100),
    TELEFONE VARCHAR(15)
);