import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, CheckCircle2, Package, Truck, ArrowLeft } from 'lucide-react';

const statusSteps = [
  { status: 'Pendente', icon: Clock, description: 'Aguardando confirmação' },
  { status: 'Em Preparo', icon: Package, description: 'Pedido em preparação' },
  { status: 'Pronto', icon: CheckCircle2, description: 'Pronto para entrega' },
  { status: 'Entregue', icon: Truck, description: 'Pedido entregue' },
];

export function OrderTracking() {
  const { id } = useParams();
  const pedidos = useStore((state) => state.pedidos);
  const produtos = useStore((state) => state.produtos);
  const extras = useStore((state) => state.extras);
  const clientes = useStore((state) => state.clientes);
  const lanchonete = useStore((state) => state.lanchonete);

  const pedido = pedidos.find((p) => p.id === id);
  const cliente = pedido ? clientes.find((c) => c.id === pedido.clienteId) : null;

  if (!pedido) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido não encontrado</h1>
          <p className="text-gray-600 mb-6">O pedido que você está procurando não existe.</p>
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((step) => step.status === pedido.status);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="text-center">
            {lanchonete?.logo && (
              <img
                src={lanchonete.logo}
                alt={lanchonete.nome}
                className="h-16 w-auto mx-auto mb-4 rounded-full shadow-lg bg-white p-2"
              />
            )}
            <h1 className="text-3xl font-bold">{lanchonete?.nome}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Pedido #{pedido.id}
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
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                    ${
                      pedido.status === 'Pendente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : pedido.status === 'Em Preparo'
                        ? 'bg-blue-100 text-blue-800'
                        : pedido.status === 'Pronto'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }
                  `}
                >
                  {pedido.status}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-100">
                <div
                  style={{ width: `${(currentStepIndex + 1) * (100 / statusSteps.length)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                />
              </div>
              <div className="flex justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = index <= currentStepIndex;
                  return (
                    <div
                      key={step.status}
                      className={`flex flex-col items-center ${
                        index === 0 ? 'items-start' : index === statusSteps.length - 1 ? 'items-end' : ''
                      }`}
                    >
                      <div
                        className={`rounded-full p-2 ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <p
                        className={`mt-2 text-sm font-medium ${
                          isActive ? 'text-blue-600' : 'text-gray-400'
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes do Pedido</h3>
            <div className="space-y-4">
              {pedido.items.map((item) => {
                const produto = produtos.find((p) => p.id === item.produtoId);
                if (!produto) return null;

                const itemExtrasTotal = item.extras?.reduce((acc, extra) => {
                  const extraInfo = extras.find((e) => e.id === extra.extraId);
                  return acc + (extraInfo?.preco || 0) * extra.quantidade;
                }, 0) || 0;

                return (
                  <div key={item.id} className="flex items-start gap-4">
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium text-gray-900">
                          {item.quantidade}x {produto.nome}
                        </h4>
                        <p className="font-medium text-gray-900">
                          {((produto.preco * item.quantidade) + itemExtrasTotal).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}
                        </p>
                      </div>
                      {item.extras && item.extras.length > 0 && (
                        <div className="mt-1">
                          <p className="text-sm text-gray-600">Adicionais:</p>
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
                                  {extra.quantidade}x {extraInfo.nome}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className="pt-4 border-t border-gray-200">
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
      </main>
    </div>
  );
}