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
  permiteExtras?: boolean;
}

export interface Extra {
  id: string;
  nome: string;
  preco: number;
  disponivel: boolean;
}

export interface ItemExtra {
  extraId: string;
  quantidade: number;
}

export interface ItemPedido {
  id: string;
  produtoId: string;
  quantidade: number;
  extras?: ItemExtra[];
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

export interface User {
  email: string;
  password: string;
}

export interface Lanchonete {
  nome: string;
  logo?: string;
  endereco?: string;
  telefone?: string;
}