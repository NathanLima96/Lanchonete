import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { Pedido } from '../types';

interface OrderFiltersProps {
  onFilterChange: (filters: OrderFilters) => void;
}

export interface OrderFilters {
  search: string;
  status: string;
  type: string;
  dateRange: string;
}

export function OrderFilters({ onFilterChange }: OrderFiltersProps) {
  const [filters, setFilters] = React.useState<OrderFilters>({
    search: '',
    status: '',
    type: '',
    dateRange: '',
  });

  const handleChange = (key: keyof OrderFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="flex items-center gap-2">
        <Filter size={20} className="text-gray-400" />
        <h2 className="text-sm font-medium text-gray-700">Filtros</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar pedidos..."
              value={filters.search}
              onChange={(e) => handleChange('search', e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        <div>
          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Preparo">Em Preparo</option>
            <option value="Pronto">Pronto</option>
            <option value="Entregue">Entregue</option>
          </select>
        </div>

        <div>
          <select
            value={filters.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Tipo</option>
            <option value="Mesa">Mesa</option>
            <option value="Delivery">Delivery</option>
          </select>
        </div>

        <div>
          <select
            value={filters.dateRange}
            onChange={(e) => handleChange('dateRange', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Período</option>
            <option value="today">Hoje</option>
            <option value="yesterday">Ontem</option>
            <option value="week">Últimos 7 dias</option>
            <option value="month">Último mês</option>
          </select>
        </div>
      </div>
    </div>
  );
}