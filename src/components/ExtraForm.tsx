import React from 'react';
import { useStore } from '../store/useStore';
import { Extra } from '../types';
import { Save, X } from 'lucide-react';

interface ExtraFormProps {
  onClose: () => void;
  extraParaEditar?: Extra;
}

export function ExtraForm({ onClose, extraParaEditar }: ExtraFormProps) {
  const addExtra = useStore((state) => state.addExtra);
  const updateExtra = useStore((state) => state.updateExtra);
  
  const [formData, setFormData] = React.useState({
    nome: extraParaEditar?.nome || '',
    preco: extraParaEditar?.preco || 0,
    disponivel: extraParaEditar?.disponivel ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const extra: Extra = {
      id: extraParaEditar?.id || crypto.randomUUID(),
      ...formData,
    };

    if (extraParaEditar) {
      updateExtra(extra);
    } else {
      addExtra(extra);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
        <div className="inline-block w-full max-w-md p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {extraParaEditar ? 'Editar Adicional' : 'Novo Adicional'}
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
                placeholder="Nome do adicional"
              />
            </div>

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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="disponivel"
                checked={formData.disponivel}
                onChange={(e) => setFormData(prev => ({ ...prev, disponivel: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="disponivel" className="ml-2 block text-sm text-gray-900">
                Disponível para venda
              </label>
            </div>

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
                {extraParaEditar ? 'Salvar Alterações' : 'Cadastrar Adicional'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}