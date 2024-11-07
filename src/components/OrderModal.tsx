import React from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X, MapPin, Phone, User, Share2 } from 'lucide-react';
import type { Pedido } from '../types';

interface OrderModalProps {
  pedido: Pedido;
  onClose: () => void;
}

export function OrderModal({ pedido, onClose }: OrderModalProps) {
  const produtos = useStore((state) => state.produtos);
  const extras = useStore((state) => state.extras);
  const clientes = useStore((state) => state.clientes);
  const cliente = clientes.find((c) => c.id === pedido.clienteId);

  const handleShare = async () => {
    const url = `${window.location.origin}/pedido/${pedido.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Acompanhar Pedido',
          text: 'Acompanhe o status do seu pedido em tempo real!',
          url,
        });
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          navigator.clipboard.writeText(url);
          alert('Link copiado para a área de transferência!');
        }
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
        <div className="inline-block w-full max-w-3xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Pedido #{pedido.id.slice(0, 8)}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {format(
                  typeof pedido.createdAt === 'string'
                    ? new Date(pedido.createdAt)
                    : pedido.createdAt,
                  "dd 'de' MMMM 'às' HH:mm",
                  { locale: ptBR }
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                title="Compartilhar pedido"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center w-10 h-10 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Cliente Info */}
            {cliente && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                  <User size={20} />
                  <h3>Informações do Cliente</h3>
                </div>
                <p className="text-gray-900 font-medium">{cliente.nome}</p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <Phone size={16} />
                    {cliente.telefone}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={16} />
                    {cliente.endereco}, {cliente.numero}
                    {cliente.complemento && ` - ${cliente.complemento}`}
                    <br />
                    {cliente.bairro} - {cliente.cidade}/{cliente.estado}
                  </p>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-200">
                {pedido.items.map((item) => {
                  const produto = produtos.find((p) => p.id === item.produtoId);
                  if (!produto) return null;

                  const itemTotal = produto.preco * item.quantidade;
                  const extrasTotal = item.extras?.reduce((acc, extra) => {
                    const extraInfo = extras.find((e) => e.id === extra.extraId);
                    return acc + (extraInfo?.preco || 0) * extra.quantidade;
                  }, 0) || 0;

                  return (
                    <div key={item.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {item.quantidade}x {produto.nome}
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">
                              {produto.descricao}
                            </p>
                            {item.extras && item.extras.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm font-medium text-gray-700">
                                  Adicionais:
                                </p>
                                <ul className="mt-1 space-y-1">
                                  {item.extras.map((extra) => {
                                    const extraInfo = extras.find(
                                      (e) => e.id === extra.extraId
                                    );
                                    if (!extraInfo) return null;
                                    return (
                                      <li
                                        key={extra.extraId}
                                        className="text-sm text-gray-600"
                                      >
                                        {extra.quantidade}x {extraInfo.nome} (
                                        {(
                                          extraInfo.preco * extra.quantidade
                                        ).toLocaleString('pt-BR', {
                                          style: 'currency',
                                          currency: 'BRL',
                                        })}
                                        )
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {(itemTotal + extrasTotal).toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {produto.preco.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}{' '}
                            cada
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gray-50 p-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Total</p>
                  <p>
                    {pedido.total.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}