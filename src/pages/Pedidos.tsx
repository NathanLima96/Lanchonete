import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { format, isToday, isYesterday, subDays, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus, ShoppingBag } from 'lucide-react';
import { OrderModal } from '../components/OrderModal';
import { OrderFilters, type OrderFilters as Filters } from '../components/OrderFilters';
import type { Pedido } from '../types';

const statusColors = {
  Pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Em Preparo': 'bg-blue-100 text-blue-800 border-blue-200',
  Pronto: 'bg-green-100 text-green-800 border-green-200',
  Entregue: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusIcons = {
  Pendente: '⏳',
  'Em Preparo': '👨‍🍳',
  Pronto: '✅',
  Entregue: '🚚',
};

export function Pedidos() {
  const pedidos = useStore((state) => state.pedidos);
  const produtos = useStore((state) => state.produtos);
  const clientes = useStore((state) => state.clientes);
  const updatePedidoStatus = useStore((state) => state.updatePedidoStatus);
  const [selectedPedido, setSelectedPedido] = React.useState<Pedido | null>(null);
  const [filters, setFilters] = React.useState<Filters>({
    search: '',
    status: '',
    type: '',
    dateRange: '',
  });

  const filteredPedidos = React.useMemo(() => {
    return [...pedidos]
      .sort((a, b) => {
        const dateB = new Date(b.createdAt);
        const dateA = new Date(a.createdAt);
        return dateB.getTime() - dateA.getTime();
      })
      .filter((pedido) => {
        const cliente = clientes.find((c) => c.id === pedido.clienteId);
        const pedidoItems = pedido.items.map((item) => {
          const produto = produtos.find((p) => p.id === item.produtoId);
          return produto?.nome || '';
        });

        const searchTerm = filters.search.toLowerCase();
        const matchesSearch =
          !filters.search ||
          pedido.id.toLowerCase().includes(searchTerm) ||
          cliente?.nome.toLowerCase().includes(searchTerm) ||
          pedidoItems.some((item) => item.toLowerCase().includes(searchTerm));

        const matchesStatus = !filters.status || pedido.status === filters.status;
        const matchesType = !filters.type || pedido.tipo === filters.type;

        const pedidoDate = new Date(pedido.createdAt);
        let matchesDate = true;

        if (filters.dateRange === 'today') {
          matchesDate = isToday(pedidoDate);
        } else if (filters.dateRange === 'yesterday') {
          matchesDate = isYesterday(pedidoDate);
        } else if (filters.dateRange === 'week') {
          matchesDate = isAfter(pedidoDate, subDays(new Date(), 7));
        } else if (filters.dateRange === 'month') {
          matchesDate = isAfter(pedidoDate, subDays(new Date(), 30));
        }

        return matchesSearch && matchesStatus && matchesType && matchesDate;
      });
  }, [pedidos, filters, clientes, produtos]);

  if (pedidos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
          <Link
            to="/pedidos/novo"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <Plus className="mr-2" size={20} />
            Novo Pedido
          </Link>
        </div>

        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum pedido ainda</h3>
          <p className="mt-1 text-sm text-gray-500">Comece criando um novo pedido.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>
        <Link
          to="/pedidos/novo"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="mr-2" size={20} />
          Novo Pedido
        </Link>
      </div>

      <OrderFilters onFilterChange={setFilters} />

      {filteredPedidos.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum pedido encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">Tente ajustar os filtros de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPedidos.map((pedido) => {
            const cliente = clientes.find((c) => c.id === pedido.clienteId);
            const totalItems = pedido.items.reduce((acc, item) => acc + item.quantidade, 0);
            
            return (
              <div
                key={pedido.id}
                onClick={() => setSelectedPedido(pedido)}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Pedido #{pedido.id.slice(0, 8)}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            statusColors[pedido.status]
                          }`}
                        >
                          {statusIcons[pedido.status]} {pedido.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {format(
                          typeof pedido.createdAt === 'string'
                            ? new Date(pedido.createdAt)
                            : pedido.createdAt,
                          "dd/MM/yyyy 'às' HH:mm",
                          { locale: ptBR }
                        )}
                      </p>
                    </div>
                    <select
                      value={pedido.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        updatePedidoStatus(pedido.id, e.target.value as typeof pedido.status);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                        statusColors[pedido.status]
                      }`}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Em Preparo">Em Preparo</option>
                      <option value="Pronto">Pronto</option>
                      <option value="Entregue">Entregue</option>
                    </select>
                  </div>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cliente</p>
                      <p className="mt-1 text-sm text-gray-900">{cliente?.nome || 'Cliente não encontrado'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipo</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {pedido.tipo === 'Mesa' ? `Mesa ${pedido.mesa}` : 'Delivery'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total</p>
                      <p className="mt-1 text-sm font-semibold text-gray-900">
                        {pedido.total.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-500 mb-2">Items ({totalItems})</p>
                    <div className="flex flex-wrap gap-2">
                      {pedido.items.map((item) => {
                        const produto = produtos.find((p) => p.id === item.produtoId);
                        if (!produto) return null;
                        return (
                          <span
                            key={item.id}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {item.quantidade}x {produto.nome}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPedido && (
        <OrderModal
          pedido={selectedPedido}
          onClose={() => setSelectedPedido(null)}
        />
      )}
    </div>
  );
}