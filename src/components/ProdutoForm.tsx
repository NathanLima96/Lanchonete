import React from 'react';
import { useStore } from '../store/useStore';
import { Produto } from '../types';
import { Save, X } from 'lucide-react';

interface ProdutoFormProps {
  onClose: () => void;
  produtoParaEditar?: Produto;
}

export function ProdutoForm({ onClose, produtoParaEditar }: ProdutoFormProps) {
  const addProduto = useStore((state) => state.addProduto);
  const updateProduto = useStore((state) => state.updateProduto);
  
  const [formData, setFormData] = React.useState({
    nome: produtoParaEditar?.nome || '',
    descricao: produtoParaEditar?.descricao || '',
    preco: produtoParaEditar?.preco || 0,
    categoria: produtoParaEditar?.categoria || 'Lanches',
    imagem: produtoParaEditar?.imagem || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const produto: Produto = {
      id: produtoParaEditar?.id || crypto.randomUUID(),
      ...formData,
    };

    if (produtoParaEditar) {
      updateProduto(produto);
    } else {
      addProduto(produto);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {produtoParaEditar ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, nome: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                required
                value={formData.descricao}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, descricao: e.target.value }))
                }
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Preço
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.preco}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    preco: parseFloat(e.target.value),
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                required
                value={formData.categoria}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoria: e.target.value as Produto['categoria'],
                  }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Lanches">Lanches</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Sobremesas">Sobremesas</option>
                <option value="Acompanhamentos">Acompanhamentos</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL da Imagem
              </label>
              <input
                type="url"
                required
                value={formData.imagem}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, imagem: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
              >
                <Save size={16} className="mr-2" />
                {produtoParaEditar ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}