import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Minus, Plus, ShoppingCart, User, Plus as PlusIcon, Store, Truck } from 'lucide-react';
import type { ItemPedido, ItemExtra } from '../types';
import { ClienteForm } from '../components/ClienteForm';
import { ExtrasSelector } from '../components/ExtrasSelector';

export function NovoPedido() {
  const navigate = useNavigate();
  const produtos = useStore((state) => state.produtos);
  const clientes = useStore((state) => state.clientes);
  const extras = useStore((state) => state.extras);
  const addPedido = useStore((state) => state.addPedido);
  const [items, setItems] = React.useState<ItemPedido[]>([]);
  const [tipo, setTipo] = React.useState<'Mesa' | 'Delivery'>('Mesa');
  const [mesa, setMesa] = React.useState<number>(1);
  const [clienteId, setClienteId] = React.useState<string>('');
  const [showClienteForm, setShowClienteForm] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);

  const total = items.reduce((acc, item) => {
    const produto = produtos.find((p) => p.id === item.produtoId);
    const itemExtrasTotal = item.extras?.reduce((extrasAcc, extra) => {
      const extraInfo = extras.find((e) => e.id === extra.extraId);
      return extrasAcc + (extraInfo?.preco || 0) * extra.quantidade;
    }, 0) || 0;
    return acc + ((produto?.preco || 0) * item.quantidade) + itemExtrasTotal;
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
      const newItem = {
        id: crypto.randomUUID(),
        produtoId,
        quantidade: 1,
        extras: [],
      };
      setItems([...items, newItem]);
      
      const produto = produtos.find((p) => p.id === produtoId);
      if (produto?.permiteExtras) {
        setSelectedProductId(produtoId);
      }
    }
  };

  const handleRemoveItem = (produtoId: string) => {
    const existingItem = items.find((item) => item.produtoId === produtoId);
    if (existingItem?.quantidade === 1) {
      setItems(items.filter((item) => item.produtoId !== produtoId));
      if (selectedProductId === produtoId) {
        setSelectedProductId(null);
      }
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

  const handleExtrasChange = (produtoId: string, extras: ItemExtra[]) => {
    setItems(
      items.map((item) =>
        item.produtoId === produtoId
          ? { ...item, extras }
          : item
      )
    );
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

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          <PlusIcon className="mr-2" size={20} />
          Cadastrar Cliente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Novo Pedido</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setTipo('Mesa')}
              className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                tipo === 'Mesa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Store size={20} className="mr-2" />
              Mesa
            </button>
            <button
              onClick={() => setTipo('Delivery')}
              className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                tipo === 'Delivery'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Truck size={20} className="mr-2" />
              Delivery
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Cliente
            </label>
            <div className="flex gap-2">
              <select
                value={clienteId}
                onChange={(e) => setClienteId(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <PlusIcon size={20} />
              </button>
            </div>
          </div>

          {tipo === 'Mesa' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Número da Mesa
              </label>
              <input
                type="number"
                min="1"
                value={mesa}
                onChange={(e) => setMesa(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProdutos.map((produto) => {
            const item = items.find((item) => item.produtoId === produto.id);
            const showExtras = selectedProductId === produto.id && produto.permiteExtras;

            const itemExtrasTotal = item?.extras?.reduce((acc, extra) => {
              const extraInfo = extras.find((e) => e.id === extra.extraId);
              return acc + (extraInfo?.preco || 0) * extra.quantidade;
            }, 0) || 0;

            return (
              <div
                key={produto.id}
                className="group relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={produto.imagem}
                    alt={produto.nome}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {produto.nome}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                        {produto.descricao}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {produto.categoria}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-lg font-semibold text-gray-900">
                      {produto.preco.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                    {itemExtrasTotal > 0 && (
                      <p className="text-sm text-gray-500">
                        + {itemExtrasTotal.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })} em adicionais
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => handleRemoveItem(produto.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        item
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!item}
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-lg font-medium text-gray-900 w-10 text-center">
                      {item?.quantidade || 0}
                    </span>
                    <button
                      onClick={() => handleAddItem(produto.id)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  {showExtras && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <ExtrasSelector
                        selectedExtras={item?.extras || []}
                        onChange={(extras) => handleExtrasChange(produto.id, extras)}
                      />
                    </div>
                  )}

                  {produto.permiteExtras && item && !showExtras && (
                    <button
                      onClick={() => setSelectedProductId(produto.id)}
                      className="mt-4 w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      Adicionar extras
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:left-64">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
            className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
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