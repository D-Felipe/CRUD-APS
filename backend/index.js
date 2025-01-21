const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
const { z } = require('zod'); 

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());


const dbConfig = {
    host: process.env.MYSQL_HOST || 'mysql',
    user: process.env.MYSQL_USER || 'admin',
    password: process.env.MYSQL_PASSWORD || 'db_aps2904',
    database: process.env.MYSQL_DB || 'db_aps',
    port: process.env.MYSQL_PORT || 3306,
    connectTimeout: 10000
  };
  
let db;
  
  const connectToDatabase = () => {
    db = mysql.createConnection(dbConfig);
  
    db.connect((err) => {
      if (err) {
        console.error('Erro ao conectar à base de dados.', err.message);
        console.log('Tentando novamente em 5 segundos...');
        setTimeout(connectToDatabase, 5000); 
      } else {
        console.log('A base de dados foi conectada com sucesso.');
      }
    });
  };
  
  // Tenta conectar ao banco de dados
  connectToDatabase();
  

const CNPJSchema = z.string().regex(/^\d{14}$/, "O CNPJ deve ter 14 dígitos.");


const ClientSchema = z.object({
    CNPJ: CNPJSchema,
    NOME: z.string().default(''),
    NOMEFANTASIA: z.string().default(''),
    CEP: z.string().min(8, "O CEP deve ter ao menos 8 dígitos.").max(8, "O CEP não pode passar de 8 dígitos."),
    LOGRADOURO: z.string().default(''),
    BAIRRO: z.string().default(''),
    CIDADE: z.string().default(''),
    UF: z.string().length(2, "O Estado deve ter 2 dígitos."),
    COMPLEMENTO: z.string().default(''),
    EMAIL: z.string().default(),
    TELEFONE: z.string().optional()
});

app.get('/validateCNPJ/:CNPJ', async (req, res) => {
    const { CNPJ } = req.params;

    try {
        const cleanedCNPJ = CNPJ.replace(/[^\d]+/g, ''); 

        console.log(`Validating CNPJ: ${cleanedCNPJ}`); 

        // Validate CNPJ using Zod
        CNPJSchema.parse(cleanedCNPJ); 

        // Make the request to the external CNPJ API
        const response = await axios.get(`https://publica.cnpj.ws/cnpj/${cleanedCNPJ}`);
        
        console.log('CNPJ Validation Response:', response.data); 

        const estabelecimento = response.data.estabelecimento;

        if (estabelecimento.situacao_cadastral === 'Ativa' || 'Baixada') {
            res.status(200).json({ valid: true, data: response.data });
        } else {
            console.log(`A validação do CNPJ falhou ${response.data.message}`);
            res.status(400).json({ valid: false, message: 'CNPJ inválido' });
        }
    } catch (error) {
        if (error.response.status === 429){
            return res.status(429).json({message: 'Muitas requisições. Tente novamente mais tarde.'});
        }
        if (error.response.status === 500){
            return res.status(500).json({message: 'Erro na conexão com a API. Tente novamente mais tarde.'})
        }
        console.error('Erro ao validar CNPJ:', error.message);
        res.status(500).json({message: 'Falha ao validar CNPJ', error: error.message});
    }

});


app.post('/clients/add', async (req, res) => {
    const clientData = req.body;

    try {
       
        ClientSchema.parse(clientData);

        
        try {
            const cnpjValidationResponse = await axios.get(`http://localhost:5000/validateCNPJ/${clientData.CNPJ}`);
        
            if (!cnpjValidationResponse.data.valid) {
                return res.status(400).send('O CNPJ é inválido.');
            }
        } catch (error) {
            console.error('Failed to validate CNPJ:', error.message);
            return res.status(500).send('Falha ao validar o CNPJ.');
        }

        const query = 'INSERT INTO clients(CNPJ, NOME, NOMEFANTASIA, CEP, LOGRADOURO, BAIRRO, CIDADE, UF, COMPLEMENTO, EMAIL, TELEFONE) VALUES (?,?,?,?,?,?,?,?,?,?,?)';

        db.query(query, [
            clientData.CNPJ, 
            clientData.NOME, 
            clientData.NOMEFANTASIA, 
            clientData.CEP, 
            clientData.LOGRADOURO, 
            clientData.BAIRRO, 
            clientData.CIDADE, 
            clientData.UF, 
            clientData.COMPLEMENTO, 
            clientData.EMAIL, 
            clientData.TELEFONE
        ], (err, queryres) => {
            if (err) {
                console.error('Erro na base de dados:', err);
                res.status(500).send('Erro ao adicionar cliente.');
                return;
            }

            res.status(200).json(clientData);
        });
    } catch (error) {
        console.error('Erro de validação:', error.errors); 
        res.status(400).json({ message: 'Dados inválidos.', errors: error.errors });
    }
    
});


const formatCNPJ = (cnpj) => {

    if (cnpj.length !== 14) {
      throw new Error('O CNPJ deve ter 14 dígitos.');
    }
  

    return cnpj.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  };

app.post('/convertCNPJ', (req,res) => {
    const {CNPJ} = req.body;
    try {
        const formattedCNPJ = formatCNPJ(CNPJ);
        res.status(200).json(({formattedCNPJ}));
    }
    catch(error){
        console.error('Erro ao formatar o CNPJ.', error.message);
        res.status(400).json({message: 'Falha ao formatar o CNPJ.', error:error.message})
    }

});


app.get('/clients', (req, res) => {
    const query = 'SELECT * FROM clients';
    db.query(query, (err,results) => {
        if(err){
            console.error('Erro ao buscar clientes.', err);
            return res.status(500).json({message: 'Falha na busca de clientes.'});
        }
        else{
            res.status(200).json(results)
        }
    });
});

app.get('/clients/:cnpj', (req, res) => {
    const cnpj = req.params.cnpj;
    const query = 'SELECT * FROM clients WHERE CNPJ = ?';
    db.query(query,[cnpj], (err,results) => {
        if(err){
            console.error('Erro ao buscar informações do cliente.', err);
            return res.status(500).json({message: 'Falha ao conseguir as informações do cliente.'});
        }
        else{
            res.status(200).json(results[0])
        }
    });
});

app.delete('/clients/:cnpj', (req, res) => {
    const  cnpjDelete = req.params.cnpj;
    const query = 'DELETE FROM clients WHERE CNPJ = ?';
    db.query(query, [cnpjDelete], (err, results) => {
        if (err) {
            console.error('Erro ao deletar cliente.', err);
            return res.status(500).json({message: 'Falha ao deletar cliente.'});
        }
        if (results.affectedRows === 0){
            return res.status(404).json({message: 'O cliente não foi encontrado.'});
        }
        res.status(200).json({message: 'O cliente foi deletado com sucesso.'})
    });
});

app.put('/clients/update/:CNPJ', (req, res) => {
    const { CNPJ } = req.params; 
    const { NOME, NOMEFANTASIA, CEP, LOGRADOURO, BAIRRO, CIDADE, UF, COMPLEMENTO, EMAIL, TELEFONE } = req.body;

    const query = `
        UPDATE clients 
        SET 
            NOME = ?, 
            NOMEFANTASIA = ?, 
            CEP = ?, 
            LOGRADOURO = ?, 
            BAIRRO = ?, 
            CIDADE = ?, 
            UF = ?, 
            COMPLEMENTO = ?, 
            EMAIL = ?, 
            TELEFONE = ? 
        WHERE CNPJ = ?;
    `;
    
    db.query(query, [NOME, NOMEFANTASIA, CEP, LOGRADOURO, BAIRRO, CIDADE, UF, COMPLEMENTO, EMAIL, TELEFONE, CNPJ], (err, result) => {
        if (err) {
            console.error('Erro na base de dados.', err);
            return res.status(500).send('Erro ao atualizar cliente');
        }

        if (result.affectedRows === 0) {
            
            return res.status(404).send('Cliente não encontrado');
        }

       
        res.status(200).json({ CNPJ, NOME, NOMEFANTASIA, CEP, LOGRADOURO, BAIRRO, CIDADE, UF, COMPLEMENTO, EMAIL, TELEFONE });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
