import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Cliente, Pedido, Produto, Extra, User, Lanchonete } from '../types';
import initialData from '../data/initial-data.json';

interface Store {
  user: User | null;
  lanchonete: Lanchonete | null;
  clientes: Cliente[];
  produtos: Produto[];
  pedidos: Pedido[];
  extras: Extra[];
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setLanchonete: (lanchonete: Lanchonete) => void;
  addCliente: (cliente: Cliente) => void;
  updateCliente: (cliente: Cliente) => void;
  removeCliente: (id: string) => void;
  addProduto: (produto: Produto) => void;
  updateProduto: (produto: Produto) => void;
  removeProduto: (id: string) => void;
  addPedido: (pedido: Pedido) => void;
  updatePedidoStatus: (id: string, status: Pedido['status']) => void;
  addExtra: (extra: Extra) => void;
  updateExtra: (extra: Extra) => void;
  removeExtra: (id: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      lanchonete: null,
      clientes: [],
      produtos: initialData.produtos,
      pedidos: [],
      extras: initialData.extras,
      login: (email: string, password: string) => {
        if (email === 'admin@admin.com' && password === 'admin') {
          set({ user: { email, password } });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
      setLanchonete: (lanchonete) => set({ lanchonete }),
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
      addExtra: (extra) =>
        set((state) => ({
          extras: [...state.extras, extra],
        })),
      updateExtra: (extra) =>
        set((state) => ({
          extras: state.extras.map((e) =>
            e.id === extra.id ? extra : e
          ),
        })),
      removeExtra: (id) =>
        set((state) => ({
          extras: state.extras.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'lanchonete-storage',
    }
  )
);