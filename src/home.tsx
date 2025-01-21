import React from 'react';
import { Button, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Color from './ToggleColor';


const Home: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <VStack spacing={4} align={'center'} marginTop={'0.5'} p={{base: 'sm', md: 'md'}}>
      <Color/>
      <Button colorScheme="green" onClick={() => navigate('/addClient')} size={{ base: 'sm', md: 'md' }}>Adicionar</Button>
      <Button colorScheme="purple" onClick={() => navigate('/listClient')} size={{ base: 'sm', md: 'md' }}>Listar</Button>
      <Button colorScheme="yellow" onClick={() => navigate('/updateClient')} size={{ base: 'sm', md: 'md' }}>Atualizar</Button>
      <Button colorScheme="red" onClick={() => navigate('/deleteClient')} size={{ base: 'sm', md: 'md' }}>Deletar</Button>
    </VStack>
  );
};

export default Home;
