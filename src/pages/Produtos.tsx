import React from 'react';
import { useStore } from '../store/useStore';
import { Pizza, Plus, Pencil, Trash2 } from 'lucide-react';
import { ProdutoForm } from '../components/ProdutoForm';
import type { Produto } from '../types';

export function Produtos() {
  const produtos = useStore((state) => state.produtos);
  const removeProduto = useStore((state) => state.removeProduto);
  const [showForm, setShowForm] = React.useState(false);
  const [produtoParaEditar, setProdutoParaEditar] = React.useState<Produto | undefined>();

  const handleEdit = (produto: Produto) => {
    setProdutoParaEditar(produto);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      removeProduto(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setProdutoParaEditar(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Novo Produto
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <img
              src={produto.imagem}
              alt={produto.nome}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {produto.nome}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {produto.categoria}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{produto.descricao}</p>
              <p className="mt-2 text-lg font-semibold text-gray-900">
                {produto.preco.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                })}
              </p>
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEdit(produto)}
                  className="p-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(produto.id)}
                  className="p-2 rounded-md bg-red-50 text-red-700 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {produtos.length === 0 && (
        <div className="text-center py-12">
          <Pizza size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum produto cadastrado
          </h3>
          <p className="text-gray-500">
            Comece adicionando produtos ao cardápio.
          </p>
        </div>
      )}

      {showForm && (
        <ProdutoForm
          onClose={handleCloseForm}
          produtoParaEditar={produtoParaEditar}
        />
      )}
    </div>
  );
}