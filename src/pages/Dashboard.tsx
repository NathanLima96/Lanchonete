import React from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrendingUp, DollarSign, ShoppingBag, Clock } from 'lucide-react';

export function Dashboard() {
  const pedidos = useStore((state) => state.pedidos);

  const hoje = new Date();
  const pedidosHoje = pedidos.filter(
    (pedido) => format(pedido.createdAt, 'yyyy-MM-dd') === format(hoje, 'yyyy-MM-dd')
  );

  const faturamentoHoje = pedidosHoje.reduce((acc, pedido) => acc + pedido.total, 0);
  const faturamentoMes = pedidos.reduce((acc, pedido) => acc + pedido.total, 0);

  const stats = [
    {
      name: 'Faturamento Hoje',
      value: faturamentoHoje.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      icon: DollarSign,
    },
    {
      name: 'Faturamento Mensal',
      value: faturamentoMes.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }),
      icon: TrendingUp,
    },
    {
      name: 'Pedidos Hoje',
      value: pedidosHoje.length,
      icon: ShoppingBag,
    },
    {
      name: 'Pedidos em Preparo',
      value: pedidos.filter((p) => p.status === 'Em Preparo').length,
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">
          {format(hoje, "EEEE, d 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white overflow-hidden rounded-lg shadow"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd className="text-lg font-semibold text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}