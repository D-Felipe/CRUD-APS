import React, { useState } from 'react';
import { Button, Input, VStack, Box } from '@chakra-ui/react';
import axios from 'axios';

const cleanCNPJ = (CNPJ: string) => {
  return CNPJ.replace(/[^\d]+/g, ''); 
};

const formatCNPJ = (CNPJ: string) => {
  const cleaned = cleanCNPJ(CNPJ);
  if (cleaned.length === 14) {
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5'
    );
  }
  return CNPJ; 
};

const UpdateClient: React.FC = () => {
  const [CNPJ, setCNPJ] = useState('');
  const [clientData, setClientData] = useState<any | null>(null);
  const [isValidCNPJ, setIsValidCNPJ] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCNPJValidation = async () => {
    const cleanedCNPJ = cleanCNPJ(CNPJ);

    if (cleanedCNPJ.length !== 14) {
      setError('CNPJ inválido.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/validateCNPJ/${cleanedCNPJ}`);
      if (response.data.valid) {
        setIsValidCNPJ(true);
        fetchClientData(cleanedCNPJ); 
      } else {
        setIsValidCNPJ(false);
        setError('CNPJ inválido.');
      }
    } catch (err) {
      setIsValidCNPJ(false);
      setError('Erro ao validar o CNPJ.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClientData = async (CNPJ: string) => {
    try {
      const response = await axios.get('http://localhost:5000/clients/'); 
      const client = response.data.find((client: any) => cleanCNPJ(client.CNPJ) === CNPJ); 

      if (client) {
        setClientData(client); 
      } else {
        setError('Cliente não encontrado.');
      }
    } catch (err) {
      setError('Erro ao buscar dados do cliente.');
    }
  };

  const handleUpdateClient = async () => {
    try {
      const updatedData = {
        ...clientData,
      };
      await axios.put(`http://localhost:5000/clients/update/${CNPJ}`, updatedData);
      alert('Cliente atualizado com sucesso!');
    } catch (err) {
      alert('Erro ao atualizar cliente.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClientData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Box padding={4}>
      <VStack spacing={4} align="stretch">
        <Input
          placeholder="11.111.111/1111-11"
          value={formatCNPJ(CNPJ)}
          onChange={(e) => setCNPJ(e.target.value)}
        />
        <Button
          colorScheme="blue"
          onClick={handleCNPJValidation}
          isLoading={loading}
        >
          Confirmar CNPJ
        </Button>
        
        {error && <Box color="red.500">{error}</Box>}

        {isValidCNPJ && clientData && (
          <>
            <VStack spacing={4} align="stretch">
              <Input
                name="NOME"
                value={clientData.NOME}
                onChange={handleInputChange}
                placeholder="Razão Social"
              />
              <Input
                name="NOMEFANTASIA"
                value={clientData.NOMEFANTASIA}
                onChange={handleInputChange}
                placeholder="Nome Fantasia"
              />
              <Input
                name="CEP"
                value={clientData.CEP}
                onChange={handleInputChange}
                placeholder="CEP"
              />
              <Input
                name="LOGRADOURO"
                value={clientData.LOGRADOURO}
                onChange={handleInputChange}
                placeholder="Logradouro"
              />
              <Input
                name="BAIRRO"
                value={clientData.BAIRRO}
                onChange={handleInputChange}
                placeholder="Bairro"
              />
              <Input
                name="CIDADE"
                value={clientData.CIDADE}
                onChange={handleInputChange}
                placeholder="Cidade"
              />
              <Input
                name="UF"
                value={clientData.UF}
                onChange={handleInputChange}
                placeholder="UF"
              />
              <Input
                name="COMPLEMENTO"
                value={clientData.COMPLEMENTO}
                onChange={handleInputChange}
                placeholder="Complemento"
              />
              <Input
                name="EMAIL"
                value={clientData.EMAIL}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <Input
                name="TELEFONE"
                value={clientData.TELEFONE}
                onChange={handleInputChange}
                placeholder="Telefone"
              />
            </VStack>
            <Button colorScheme="green" onClick={handleUpdateClient}>
              Atualizar Cliente
            </Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default UpdateClient;