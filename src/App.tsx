import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Button, VStack } from '@chakra-ui/react';
import Home from './home';
import AddClient from './addClient';
import ListClient from './listClient';
import UpdateClient from './updateClient';
import DeleteClient from './deleteClient';

function App() {
  return (
    <Router>
      <VStack p={4}>
        <Button as="a" href="/">Home</Button>
        <Routes>
          <Route path="/" element ={<Home />} />
          <Route path="/addClient" element ={<AddClient/>} />
          <Route path="/listClient" element={<ListClient />} />
          <Route path="/updateClient/" element={<UpdateClient/>} />
          <Route path="/deleteClient" element={<DeleteClient/>} />
        </Routes>
      </VStack>
    </Router>
  );
}

export default App;