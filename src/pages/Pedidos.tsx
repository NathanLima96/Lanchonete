import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus } from 'lucide-react';

const statusColors = {
  Pendente: 'bg-yellow-100 text-yellow-800',
  'Em Preparo': 'bg-blue-100 text-blue-800',
  Pronto: 'bg-green-100 text-green-800',
  Entregue: 'bg-gray-100 text-gray-800',
};

export function Pedidos() {
  const pedidos = useStore((state) => state.pedidos);
  const produtos = useStore((state) => state.produtos);
  const clientes = useStore((state) => state.clientes);
  const updatePedidoStatus = useStore((state) => state.updatePedidoStatus);

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

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pedidos.map((pedido) => {
                const cliente = clientes.find((c) => c.id === pedido.clienteId);
                return (
                  <tr key={pedido.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{pedido.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente?.nome || 'Cliente não encontrado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.tipo === 'Mesa'
                        ? `Mesa ${pedido.mesa}`
                        : 'Delivery'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <ul>
                        {pedido.items.map((item) => {
                          const produto = produtos.find(
                            (p) => p.id === item.produtoId
                          );
                          return (
                            <li key={item.id}>
                              {item.quantidade}x {produto?.nome}
                            </li>
                          );
                        })}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pedido.total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={pedido.status}
                        onChange={(e) =>
                          updatePedidoStatus(
                            pedido.id,
                            e.target.value as typeof pedido.status
                          )
                        }
                        className={`text-sm font-medium px-3 py-1 rounded-full ${
                          statusColors[pedido.status]
                        }`}
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Em Preparo">Em Preparo</option>
                        <option value="Pronto">Pronto</option>
                        <option value="Entregue">Entregue</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(
                        typeof pedido.createdAt === 'string'
                          ? new Date(pedido.createdAt)
                          : pedido.createdAt,
                        "dd/MM/yyyy 'às' HH:mm",
                        { locale: ptBR }
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}