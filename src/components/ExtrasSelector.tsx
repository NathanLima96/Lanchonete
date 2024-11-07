import React from 'react';
import { useStore } from '../store/useStore';
import { ItemExtra } from '../types';
import { Minus, Plus } from 'lucide-react';

interface ExtrasSelectorProps {
  selectedExtras: ItemExtra[];
  onChange: (extras: ItemExtra[]) => void;
}

export function ExtrasSelector({ selectedExtras, onChange }: ExtrasSelectorProps) {
  const extras = useStore((state) => state.extras.filter((e) => e.disponivel));

  const handleAddExtra = (extraId: string) => {
    const existingExtra = selectedExtras.find((e) => e.extraId === extraId);
    if (existingExtra) {
      onChange(
        selectedExtras.map((e) =>
          e.extraId === extraId
            ? { ...e, quantidade: e.quantidade + 1 }
            : e
        )
      );
    } else {
      onChange([...selectedExtras, { extraId, quantidade: 1 }]);
    }
  };

  const handleRemoveExtra = (extraId: string) => {
    const existingExtra = selectedExtras.find((e) => e.extraId === extraId);
    if (existingExtra?.quantidade === 1) {
      onChange(selectedExtras.filter((e) => e.extraId !== extraId));
    } else if (existingExtra) {
      onChange(
        selectedExtras.map((e) =>
          e.extraId === extraId
            ? { ...e, quantidade: e.quantidade - 1 }
            : e
        )
      );
    }
  };

  if (extras.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900">Adicione extras ao seu pedido</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {extras.map((extra) => {
          const selectedExtra = selectedExtras.find((e) => e.extraId === extra.id);
          return (
            <div
              key={extra.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{extra.nome}</p>
                <p className="text-sm font-semibold text-blue-600">
                  {extra.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleRemoveExtra(extra.id)}
                  className={`p-1.5 rounded-md transition-colors ${
                    selectedExtra
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!selectedExtra}
                >
                  <Minus size={16} />
                </button>
                <span className="text-sm font-medium text-gray-900 w-6 text-center">
                  {selectedExtra?.quantidade || 0}
                </span>
                <button
                  type="button"
                  onClick={() => handleAddExtra(extra.id)}
                  className="p-1.5 rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}