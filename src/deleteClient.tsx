import React, { useState } from 'react';
import { Button, Input, VStack } from '@chakra-ui/react';
import axios from 'axios';
import Color from './ToggleColor';
const DeleteClient: React.FC = () => {
  const [CNPJ, setCNPJ] = useState('');


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
  
  const handleDelete = async () => {
    try {
      const cleanedCNPJ = CNPJ.replace(/[^\d]+/g, '');
      await axios.delete(`http://localhost:5000/clients/${cleanedCNPJ}`);
      alert('O cliente foi deletado sucesso');
    } catch (error) {
      console.error('Erro ao apagar cliente:', error);
      alert('Falha ao apagar cliente. ');
    }
  };

  return (
    <div>
      <VStack>
        <Color />
      </VStack>
    <VStack spacing={4}>
      <Input
        value={formatCNPJ(CNPJ)}
        onChange={(e) => setCNPJ(e.target.value)}
        placeholder="11.111.111/1111-11"/>
        
      <Button colorScheme="red" onClick={handleDelete}>Deletar</Button>
    </VStack>
    </div>
  );
};

export default DeleteClient;
