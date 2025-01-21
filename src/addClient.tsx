import React, { useState, useEffect } from 'react';
import { Button, Input, VStack, FormControl, FormLabel } from '@chakra-ui/react';
import axios from 'axios';
import Color from './ToggleColor';

const AddClient: React.FC = () => {
  
  const [CNPJ, setCNPJ] = useState('');
  const [nome, setNome] = useState('');
  const [nomeFantasia, setFantasia] = useState('');
  const [cep, setCEP] = useState('');
  const [logr, setLogr] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [complemento, setComple] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');

  const [clients, setClients] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); 

 
  const cleanCNPJ = (CNPJ: string) => {
    return CNPJ.replace(/[^\d]+/g, ''); 
  };

  
  const cleanCEP = (cep: string) => {
    return cep.replace(/\D/g, ''); 
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

  
  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clients');
      setClients(response.data); 
    } catch (error) {
      console.error('Error fetching clients:', error);
      alert('Failed to fetch clients');
    }
  };

  useEffect(() => {
    fetchClients(); 
  }, []);

 
  const handleCNPJBlur = async () => {
    const cleanedCNPJ = cleanCNPJ(CNPJ);

    if (cleanedCNPJ.length !== 14) {
      alert('CNPJ inválido. Certifique-se de que o CNPJ tem 14 dígitos.');
      return;
    }

    try {
      const response = await axios.get(`https://publica.cnpj.ws/cnpj/${cleanedCNPJ}`);

      if (response.data) {
        const clientData = response.data;

        
        setNome(clientData.razao_social || '');
        setFantasia(clientData.estabelecimento.nome_fantasia || '');
        setCEP(clientData.estabelecimento.cep || '');
        setLogr(clientData.estabelecimento.logradouro || '');
        setBairro(clientData.estabelecimento.bairro || '');
        setCidade(clientData.estabelecimento.cidade?.nome || '');
        setUf(clientData.estabelecimento.estado?.sigla || '');
        setComple(clientData.estabelecimento.complemento || '');
        setEmail(clientData.estabelecimento.email || '');
        setTelefone(clientData.estabelecimento.ddd1 + clientData.estabelecimento.telefone1 || '');
      }
    } catch (error) {
      console.error('Erro ao buscar informações do cliente:', error);
      alert('Falha ao conseguir informações do cliente.');
    }
  };

  
  const validateCEP = async (cep: string) => {
    const cleanedCEP = cleanCEP(cep);

    if (cleanedCEP.length !== 8) {
      alert('CEP inválido. Certifique-se de que o CEP tem 8 dígitos.');
      return false;
    }

    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cleanedCEP}/json/`);

      if (response.data.erro) {
        alert('CEP inválido.');
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro ao validar CEP:', error);
      alert('Erro ao validar o CEP');
      return false;
    }
  };

  
  const handleSubmit = async () => {
    if (isSubmitting) return; 
    setIsSubmitting(true);

    const cleanedCNPJ = cleanCNPJ(CNPJ);

    
    const existingClient = clients.find(client => client.CNPJ === cleanedCNPJ);
    if (existingClient) {
      alert('Este CNPJ já existe no sistema.');
      setIsSubmitting(false);
      return;
    }

    
    const isCEPValid = await validateCEP(cep);
    if (!isCEPValid) {
      setIsSubmitting(false);
      return; 
    }

    try {
      
      await axios.post('http://localhost:5000/clients/add', {
        CNPJ: cleanedCNPJ,
        NOME: nome,
        NOMEFANTASIA: nomeFantasia,
        CEP: cep,
        LOGRADOURO: logr,
        BAIRRO: bairro,
        CIDADE: cidade,
        UF: uf,
        COMPLEMENTO: complemento,
        EMAIL: email,
        TELEFONE: telefone
      });

      alert('Cliente adicionado com sucesso');
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      alert('Erro ao adicionar cliente');
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div>
      <VStack spacing={4}>
        <Color />
        
        <FormControl isRequired>
          <FormLabel>CNPJ</FormLabel>
          <Input 
            value={formatCNPJ(CNPJ)} 
            onChange={(e) => setCNPJ(e.target.value)} 
            onBlur={handleCNPJBlur} 
            placeholder="11.111.111/1111-11" 
          />
        </FormControl>

        <FormControl>
          <FormLabel>Razão Social</FormLabel>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Razão Social" />
        </FormControl>

        <FormControl>
          <FormLabel>Nome Fantasia</FormLabel>
          <Input value={nomeFantasia} onChange={(e) => setFantasia(e.target.value)} placeholder="Nome Fantasia" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>CEP</FormLabel>
          <Input value={cep} onChange={(e) => setCEP(e.target.value)} placeholder="CEP" />
        </FormControl>

        <FormControl>
          <FormLabel>Logradouro</FormLabel>
          <Input value={logr} onChange={(e) => setLogr(e.target.value)} placeholder="Logradouro" />
        </FormControl>

        <FormControl>
          <FormLabel>Bairro</FormLabel>
          <Input value={bairro} onChange={(e) => setBairro(e.target.value)} placeholder="Bairro" />
        </FormControl>

        <FormControl>
          <FormLabel>Cidade</FormLabel>
          <Input value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" />
        </FormControl>

        <FormControl>
          <FormLabel>UF</FormLabel>
          <Input value={uf} onChange={(e) => setUf(e.target.value)} placeholder="UF" />
        </FormControl>

        <FormControl>
          <FormLabel>Complemento</FormLabel>
          <Input value={complemento} onChange={(e) => setComple(e.target.value)} placeholder="Complemento" />
        </FormControl>

        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        </FormControl>

        <FormControl>
          <FormLabel>Telefone</FormLabel>
          <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="Telefone" />
        </FormControl>

        <Button 
          colorScheme="teal" 
          onClick={handleSubmit} 
          isLoading={isSubmitting}
        >
          Enviar
        </Button>
      </VStack>
    </div>
  );
};

export default AddClient;
