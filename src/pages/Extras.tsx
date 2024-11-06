import React from 'react';
import { useStore } from '../store/useStore';
import { ExtraForm } from '../components/ExtraForm';
import { Plus, Pencil, Trash2, Coffee } from 'lucide-react';
import type { Extra } from '../types';

export function Extras() {
  const extras = useStore((state) => state.extras);
  const removeExtra = useStore((state) => state.removeExtra);
  const [showForm, setShowForm] = React.useState(false);
  const [extraParaEditar, setExtraParaEditar] = React.useState<Extra | undefined>();

  const handleEdit = (extra: Extra) => {
    setExtraParaEditar(extra);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este adicional?')) {
      removeExtra(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setExtraParaEditar(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Adicionais</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Novo Adicional
        </button>
      </div>

      {extras.length === 0 ? (
        <div className="text-center py-12">
          <Coffee size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum adicional cadastrado
          </h3>
          <p className="text-gray-500">
            Comece adicionando adicionais para seus produtos.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {extras.map((extra) => (
                  <tr key={extra.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {extra.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {extra.preco.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          extra.disponivel
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {extra.disponivel ? 'Disponível' : 'Indisponível'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(extra)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(extra.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <ExtraForm
          onClose={handleCloseForm}
          extraParaEditar={extraParaEditar}
        />
      )}
    </div>
  );
}