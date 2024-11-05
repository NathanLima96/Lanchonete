import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cliente, Pedido, Produto } from '../types';
import initialData from '../data/initial-data.json';

interface Store {
  clientes: Cliente[];
  produtos: Produto[];
  pedidos: Pedido[];
  addCliente: (cliente: Cliente) => void;
  updateCliente: (cliente: Cliente) => void;
  removeCliente: (id: string) => void;
  addProduto: (produto: Produto) => void;
  updateProduto: (produto: Produto) => void;
  removeProduto: (id: string) => void;
  addPedido: (pedido: Pedido) => void;
  updatePedidoStatus: (id: string, status: Pedido['status']) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      clientes: [],
      produtos: initialData.produtos,
      pedidos: [],
      addCliente: (cliente) =>
        set((state) => ({
          clientes: [...state.clientes, cliente],
        })),
      updateCliente: (cliente) =>
        set((state) => ({
          clientes: state.clientes.map((c) => (c.id === cliente.id ? cliente : c)),
        })),
      removeCliente: (id) =>
        set((state) => ({
          clientes: state.clientes.filter((c) => c.id !== id),
        })),
      addProduto: (produto) =>
        set((state) => ({
          produtos: [...state.produtos, produto],
        })),
      updateProduto: (produto) =>
        set((state) => ({
          produtos: state.produtos.map((p) =>
            p.id === produto.id ? produto : p
          ),
        })),
      removeProduto: (id) =>
        set((state) => ({
          produtos: state.produtos.filter((p) => p.id !== id),
        })),
      addPedido: (pedido) =>
        set((state) => ({
          pedidos: [...state.pedidos, pedido],
        })),
      updatePedidoStatus: (id, status) =>
        set((state) => ({
          pedidos: state.pedidos.map((pedido) =>
            pedido.id === id ? { ...pedido, status } : pedido
          ),
        })),
    }),
    {
      name: 'lanchonete-storage',
    }
  )
);