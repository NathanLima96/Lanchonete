import React from 'react';
import { useStore } from '../store/useStore';
import { ClienteForm } from '../components/ClienteForm';
import { Plus, Pencil, Trash2, User } from 'lucide-react';
import type { Cliente } from '../types';

export function Clientes() {
  const clientes = useStore((state) => state.clientes);
  const removeCliente = useStore((state) => state.removeCliente);
  const [showForm, setShowForm] = React.useState(false);
  const [clienteParaEditar, setClienteParaEditar] = React.useState<Cliente | undefined>();

  const handleEdit = (cliente: Cliente) => {
    setClienteParaEditar(cliente);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      removeCliente(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setClienteParaEditar(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Novo Cliente
        </button>
      </div>

      {clientes.length === 0 ? (
        <div className="text-center py-12">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum cliente cadastrado
          </h3>
          <p className="text-gray-500">
            Comece adicionando um novo cliente ao sistema.
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
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Endereço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {clientes.map((cliente) => (
                  <tr key={cliente.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.nome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cliente.telefone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {cliente.endereco && (
                        <>
                          {cliente.endereco}, {cliente.numero}
                          {cliente.complemento && ` - ${cliente.complemento}`}
                          <br />
                          {cliente.bairro} - {cliente.cidade}/{cliente.estado}
                          <br />
                          CEP: {cliente.cep}
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
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
        <ClienteForm
          onClose={handleCloseForm}
          clienteParaEditar={clienteParaEditar}
        />
      )}
    </div>
  );
}