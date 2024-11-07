import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import {
  Phone,
  MapPin,
  ShoppingCart,
  Plus,
  Minus,
  Search,
  User,
  X,
} from 'lucide-react';
import { ExtrasSelector } from '../components/ExtrasSelector';
import type { ItemPedido, Cliente } from '../types';

export function PublicOrder() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const lanchonete = useStore((state) => state.lanchonete);
  const produtos = useStore((state) => state.produtos);
  const extras = useStore((state) => state.extras);
  const addPedido = useStore((state) => state.addPedido);
  const addCliente = useStore((state) => state.addCliente);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProductId, setSelectedProductId] = React.useState<
    string | null
  >(null);
  const [items, setItems] = React.useState<ItemPedido[]>([]);
  const [showClientForm, setShowClientForm] = React.useState(false);
  const [clienteForm, setClienteForm] = React.useState({
    nome: '',
    telefone: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  });

  // Redirect if slug doesn't match
  React.useEffect(() => {
    if (
      lanchonete &&
      slug !== lanchonete.nome.toLowerCase().replace(/\s+/g, '-')
    ) {
      navigate('/404');
    }
  }, [slug, lanchonete, navigate]);

  if (!lanchonete) {
    return <div>Lanchonete não encontrada</div>;
  }

  const total = items.reduce((acc, item) => {
    const produto = produtos.find((p) => p.id === item.produtoId);
    const itemExtrasTotal =
      item.extras?.reduce((extrasAcc, extra) => {
        const extraInfo = extras.find((e) => e.id === extra.extraId);
        return extrasAcc + (extraInfo?.preco || 0) * extra.quantidade;
      }, 0) || 0;
    return acc + (produto?.preco || 0) * item.quantidade + itemExtrasTotal;
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
        item.produtoId === produtoId ? { ...item, extras } : item
      )
    );
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const cliente: Cliente = {
      id: crypto.randomUUID(),
      ...clienteForm,
    };

    addCliente(cliente);

    const orderId = crypto.randomUUID();

    const pedido = {
      id: orderId,
      clienteId: cliente.id,
      items,
      total,
      status: 'Pendente' as const,
      tipo: 'Delivery' as const,
      createdAt: new Date(),
    };

    addPedido(pedido);
    setItems([]);
    setShowClientForm(false);
    navigate(`/pedido/${orderId}`);
  };

  const filteredProdutos = produtos.filter(
    (produto) =>
      produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      produto.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorias = Array.from(new Set(produtos.map((p) => p.categoria)));

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            {lanchonete.logo && (
              <img
                src={lanchonete.logo}
                alt={lanchonete.nome}
                className="h-20 w-auto mb-4 rounded-full shadow-lg bg-white p-2"
              />
            )}
            <h1 className="text-4xl font-bold">{lanchonete.nome}</h1>
            {lanchonete.endereco && (
              <p className="mt-3 flex items-center text-blue-100">
                <MapPin className="h-5 w-5 mr-2" />
                {lanchonete.endereco}
              </p>
            )}
            {lanchonete.telefone && (
              <p className="mt-2 flex items-center text-blue-100">
                <Phone className="h-5 w-5 mr-2" />
                {lanchonete.telefone}
              </p>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
            />
          </div>
        </div>

        {/* Categories and Products */}
        <div className="space-y-12">
          {categorias.map((categoria) => {
            const categoriaProdutos = filteredProdutos.filter(
              (p) => p.categoria === categoria
            );
            if (categoriaProdutos.length === 0) return null;

            return (
              <section key={categoria}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {categoria}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoriaProdutos.map((produto) => {
                    const item = items.find(
                      (item) => item.produtoId === produto.id
                    );
                    const showExtras =
                      selectedProductId === produto.id && produto.permiteExtras;

                    const itemExtrasTotal =
                      item?.extras?.reduce((acc, extra) => {
                        const extraInfo = extras.find(
                          (e) => e.id === extra.extraId
                        );
                        return acc + (extraInfo?.preco || 0) * extra.quantidade;
                      }, 0) || 0;

                    return (
                      <div
                        key={produto.id}
                        className="group bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-200"
                      >
                        <div className="aspect-w-16 aspect-h-9">
                          <img
                            src={produto.imagem}
                            alt={produto.nome}
                            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-200"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
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
                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <p className="text-lg font-bold text-gray-900">
                                {produto.preco.toLocaleString('pt-BR', {
                                  style: 'currency',
                                  currency: 'BRL',
                                })}
                              </p>
                              {itemExtrasTotal > 0 && (
                                <p className="text-sm text-gray-500">
                                  +{' '}
                                  {itemExtrasTotal.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}{' '}
                                  em adicionais
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
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
                          </div>

                          {showExtras && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                              <ExtrasSelector
                                selectedExtras={item?.extras || []}
                                onChange={(extras) =>
                                  handleExtrasChange(produto.id, extras)
                                }
                              />
                              <button
                                onClick={() => setSelectedProductId(null)}
                                className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                <X size={16} className="mr-2" />
                                Fechar
                              </button>
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
              </section>
            );
          })}
        </div>

        {/* Cart */}
        {items.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="max-w-7xl mx-auto">
              {!showClientForm ? (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                    onClick={() => setShowClientForm(true)}
                    className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors shadow-sm"
                  >
                    <ShoppingCart className="mr-2" />
                    Finalizar Pedido
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitOrder} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nome
                      </label>
                      <input
                        type="text"
                        required
                        value={clienteForm.nome}
                        onChange={(e) =>
                          setClienteForm((prev) => ({
                            ...prev,
                            nome: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        required
                        value={clienteForm.telefone}
                        onChange={(e) =>
                          setClienteForm((prev) => ({
                            ...prev,
                            telefone: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Endereço
                      </label>
                      <input
                        type="text"
                        required
                        value={clienteForm.endereco}
                        onChange={(e) =>
                          setClienteForm((prev) => ({
                            ...prev,
                            endereco: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Número
                      </label>
                      <input
                        type="text"
                        required
                        value={clienteForm.numero}
                        onChange={(e) =>
                          setClienteForm((prev) => ({
                            ...prev,
                            numero: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Complemento
                      </label>
                      <input
                        type="text"
                        value={clienteForm.complemento}
                        onChange={(e) =>
                          setClienteForm((prev) => ({
                            ...prev,
                            complemento: e.target.value,
                          }))
                        }
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowClientForm(false)}
                      className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 shadow-sm"
                    >
                      Voltar
                    </button>
                    <button
                      type="submit"
                      className="flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Confirmar Pedido
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
