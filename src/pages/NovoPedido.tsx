import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Minus, Plus, ShoppingCart, User, Plus as PlusIcon } from 'lucide-react';
import type { ItemPedido, Cliente } from '../types';
import { ClienteForm } from '../components/ClienteForm';

export function NovoPedido() {
  const navigate = useNavigate();
  const produtos = useStore((state) => state.produtos);
  const clientes = useStore((state) => state.clientes);
  const addPedido = useStore((state) => state.addPedido);
  const [items, setItems] = React.useState<ItemPedido[]>([]);
  const [tipo, setTipo] = React.useState<'Mesa' | 'Delivery'>('Mesa');
  const [mesa, setMesa] = React.useState<number>(1);
  const [clienteId, setClienteId] = React.useState<string>('');
  const [showClienteForm, setShowClienteForm] = React.useState(false);

  const total = items.reduce((acc, item) => {
    const produto = produtos.find((p) => p.id === item.produtoId);
    return acc + (produto?.preco || 0) * item.quantidade;
  }, 0);

  const handleAddItem = (produtoId: string) => {
    const existingItem = items.find((item) => item.produtoId === produtoId);
    if (existingItem) {
      setItems(
        items.map((item) =>
          item.produtoId === produtoId
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setItems([
        ...items,
        { id: crypto.randomUUID(), produtoId, quantidade: 1 },
      ]);
    }
  };

  const handleRemoveItem = (produtoId: string) => {
    const existingItem = items.find((item) => item.produtoId === produtoId);
    if (existingItem?.quantidade === 1) {
      setItems(items.filter((item) => item.produtoId !== produtoId));
    } else {
      setItems(
        items.map((item) =>
          item.produtoId === produtoId
            ? { ...item, quantidade: item.quantidade - 1 }
            : item
        )
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !clienteId) return;

    addPedido({
      id: crypto.randomUUID(),
      clienteId,
      items,
      total,
      status: 'Pendente',
      tipo,
      mesa: tipo === 'Mesa' ? mesa : undefined,
      createdAt: new Date(),
    });

    navigate('/pedidos');
  };

  if (clientes.length === 0) {
    return (
      <div className="text-center py-12">
        <User size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum cliente cadastrado
        </h3>
        <p className="text-gray-500 mb-4">
          É necessário cadastrar um cliente antes de criar um pedido.
        </p>
        <button
          onClick={() => setShowClienteForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="mr-2" size={20} />
          Cadastrar Cliente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Novo Pedido</h1>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente
          </label>
          <div className="flex gap-2">
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecione um cliente</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome} - {cliente.telefone}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowClienteForm(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              <PlusIcon size={20} />
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setTipo('Mesa')}
            className={`px-4 py-2 rounded-md ${
              tipo === 'Mesa'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Mesa
          </button>
          <button
            onClick={() => setTipo('Delivery')}
            className={`px-4 py-2 rounded-md ${
              tipo === 'Delivery'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            Delivery
          </button>
        </div>

        {tipo === 'Mesa' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número da Mesa
            </label>
            <input
              type="number"
              min="1"
              value={mesa}
              onChange={(e) => setMesa(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {produtos.map((produto) => {
          const item = items.find((item) => item.produtoId === produto.id);
          return (
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
                <h3 className="text-lg font-medium text-gray-900">
                  {produto.nome}
                </h3>
                <p className="text-sm text-gray-500">{produto.descricao}</p>
                <p className="mt-2 text-lg font-semibold text-gray-900">
                  {produto.preco.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleRemoveItem(produto.id)}
                    className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                    disabled={!item}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-lg font-medium text-gray-900">
                    {item?.quantidade || 0}
                  </span>
                  <button
                    onClick={() => handleAddItem(produto.id)}
                    className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:left-64">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total do Pedido</p>
            <p className="text-2xl font-bold text-gray-900">
              {total.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={items.length === 0 || !clienteId}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <ShoppingCart className="mr-2" />
            Finalizar Pedido
          </button>
        </div>
      </div>

      {showClienteForm && (
        <ClienteForm onClose={() => setShowClienteForm(false)} />
      )}
    </div>
  );
}