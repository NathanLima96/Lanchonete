import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Setup } from './pages/Setup';
import { Dashboard } from './pages/Dashboard';
import { Pedidos } from './pages/Pedidos';
import { NovoPedido } from './pages/NovoPedido';
import { Clientes } from './pages/Clientes';
import { Produtos } from './pages/Produtos';
import { Extras } from './pages/Extras';
import { PublicOrder } from './pages/PublicOrder';
import { OrderTracking } from './pages/OrderTracking';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);
  const lanchonete = useStore((state) => state.lanchonete);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!lanchonete) {
    return <Navigate to="/setup" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/cardapio/:slug" element={<PublicOrder />} />
        <Route path="/pedido/:id" element={<OrderTracking />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <Layout>
                <Pedidos />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/pedidos/novo"
          element={
            <PrivateRoute>
              <Layout>
                <NovoPedido />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoute>
              <Layout>
                <Clientes />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/produtos"
          element={
            <PrivateRoute>
              <Layout>
                <Produtos />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/extras"
          element={
            <PrivateRoute>
              <Layout>
                <Extras />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;