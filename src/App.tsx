import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Pedidos } from './pages/Pedidos';
import { NovoPedido } from './pages/NovoPedido';
import { Clientes } from './pages/Clientes';
import { Produtos } from './pages/Produtos';
import { Extras } from './pages/Extras';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/pedidos/novo" element={<NovoPedido />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="/extras" element={<Extras />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;