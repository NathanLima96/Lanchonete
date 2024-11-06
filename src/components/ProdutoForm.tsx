import React from 'react';
import { useStore } from '../store/useStore';
import { Produto } from '../types';
import { Save, X, Image as ImageIcon } from 'lucide-react';

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
    permiteExtras: produtoParaEditar?.permiteExtras || false,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
        <div className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {produtoParaEditar ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Nome do produto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                required
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                placeholder="Descrição detalhada do produto"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preço
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">R$</span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.preco}
                    onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  required
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as Produto['categoria'] }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="Lanches">Lanches</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Sobremesas">Sobremesas</option>
                  <option value="Acompanhamentos">Acompanhamentos</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ImageIcon size={18} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  required
                  value={formData.imagem}
                  onChange={(e) => setFormData(prev => ({ ...prev, imagem: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="permiteExtras"
                checked={formData.permiteExtras}
                onChange={(e) => setFormData(prev => ({ ...prev, permiteExtras: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="permiteExtras" className="ml-2 block text-sm text-gray-900">
                Permite adicionais
              </label>
            </div>

            {formData.imagem && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={formData.imagem}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Imagem+não+encontrada';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mb-2 sm:mb-0"
              >
                <Save size={18} className="mr-2" />
                {produtoParaEditar ? 'Salvar Alterações' : 'Cadastrar Produto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}