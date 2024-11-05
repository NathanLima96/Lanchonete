export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: 'Lanches' | 'Bebidas' | 'Sobremesas' | 'Acompanhamentos';
  imagem: string;
}

export interface ItemPedido {
  id: string;
  produtoId: string;
  quantidade: number;
  observacoes?: string;
}

export interface Pedido {
  id: string;
  clienteId: string;
  items: ItemPedido[];
  total: number;
  status: 'Pendente' | 'Em Preparo' | 'Pronto' | 'Entregue';
  tipo: 'Mesa' | 'Delivery';
  mesa?: number;
  createdAt: Date;
}