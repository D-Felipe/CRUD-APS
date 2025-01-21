import {FaSun, FaMoon} from 'react-icons/fa';
import {Button} from '@chakra-ui/react';
import {useColorMode} from '@chakra-ui/react';
function Color(){
  const {colorMode, toggleColorMode} = useColorMode()
  return (
      <Button onClick={toggleColorMode} mb={4} leftIcon={colorMode === 'light' ? <FaMoon />:<FaSun />}>
        Modo {colorMode === 'light' ? 'Escuro' : 'Claro'}
      </Button>
  )
}

export default Color;