import React, { useEffect, useState } from 'react';
import { VStack,Stack, Box, Text, Button, Flex } from '@chakra-ui/react';
import axios from 'axios';
import Color from './ToggleColor';


const cleanCNPJ = (CNPJ: string) => {
  return CNPJ.replace(/[^\d]+/g, ''); 
};


const copyCNPJ = (text: string): void => {
  navigator.clipboard.writeText(text)
    .then(() => {
      alert('O texto foi copiado');
    })
    .catch((error) => {
      console.error('O texto falhou em ser copiado: ', error);
    });
};

const ListClients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [selectedClientDetails, setSelectedClientDetails] = useState<any | null>(null);
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  const [hoveredCNPJ, setHoveredCNPJ] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/clients'); 
        setClients(response.data); 
      } catch (error) {
        console.error('Erro ao buscar os clientes.', error);
        alert('Falha ao buscar os clientes');
      }
    };

    fetchClients(); 
  }, []);

  
  const handleClientSelect = async (CNPJ: string) => {
    try {
      const cleanedCNPJ = cleanCNPJ(CNPJ); 
      await delay(2000); 

      
      const response = await axios.get(`http://localhost:5000/clients/${cleanedCNPJ}`);
      setSelectedClientDetails(response.data); 
    } catch (error) {
      console.error('Erro ao buscar informações do cliente.:', error);
      alert('Falha ao conseguir informações do cliente');
    }
  };

  
  const handleBackToList = () => {
    setSelectedClientDetails(null); 
  };

  if (selectedClientDetails) {
  
    return (
      <VStack spacing={4}>
        <Color />
        <Text fontSize="xl" fontWeight="bold" padding={1}>Detalhes do Cliente</Text>
        <Box p={4} borderWidth={1} borderRadius="md">
          <Text><strong>Razão Social:</strong> {selectedClientDetails.NOME || 'N/A'}</Text>
          <Text><strong>Nome Fantasia:</strong> {selectedClientDetails.NOMEFANTASIA || 'N/A'}</Text>

          <Text fontWeight="bold" mt={4}>Endereço:</Text>
          <Text><strong>CEP:</strong> {selectedClientDetails.CEP || 'N/A'}</Text>
          <Text><strong>Logradouro:</strong> {`${selectedClientDetails.LOGRADOURO || 'N/A'}`}</Text>
          <Text><strong>Complemento:</strong> {selectedClientDetails.COMPLEMENTO || 'N/A'}</Text>
          <Text><strong>Bairro:</strong> {selectedClientDetails.BAIRRO || 'N/A'}</Text>
          <Text><strong>Cidade:</strong> {selectedClientDetails.CIDADE || 'N/A'}</Text>
          <Text><strong>Estado:</strong> {selectedClientDetails.UF || 'N/A'}</Text>

          <Text fontWeight="bold" mt={4}>Contato:</Text>
          <Text><strong>Email:</strong> {selectedClientDetails.EMAIL || 'N/A'}</Text>
          <Text><strong>Telefone:</strong> {selectedClientDetails.TELEFONE || 'N/A'}</Text>

          <Button colorScheme="blue" onClick={handleBackToList}>Voltar para a lista</Button>
        </Box>
      </VStack>
    );
  }

  return (
    <div>
      <div>
        <VStack>
        <Color />
        <Text fontSize="xl" fontWeight="bold" padding={1} mb={6}>Lista de Clientes</Text>
        </VStack>
      </div>
      <Stack spacing={4} direction={{base: 'column', md: 'row'}} gap={"10"}>
        
        <Flex wrap="wrap" gap={100}>
        {clients.map((client) => (
          <Flex key={client.CNPJ}>
          <Box p={5} borderWidth={1} borderRadius="md">
            <Flex>
            <Button size='sm' colorScheme={hoveredCNPJ === client.CNPJ ? 'yellow' : 'yellow'} onMouseEnter={() => setHoveredCNPJ(client.CNPJ)} onClick={() => copyCNPJ(client.CNPJ)} mb={3}>
              <Text> {hoveredCNPJ === client.CNPJ ? 'Copiar CNPJ' : `CNPJ: ${client.CNPJ}`}</Text>
            </Button>
            </Flex>
              <Flex>
              <Button colorScheme="teal" size="sm" onClick={() => handleClientSelect(client.CNPJ)}>
                Exibir Dados
              </Button>
              </Flex>
          </Box>
          </Flex>
          
        ))}
        </Flex>
      </Stack>
    </div>
  );
};

export default ListClients;