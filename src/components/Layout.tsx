import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { LayoutDashboard, ShoppingBag, Users, Pizza, Menu, Coffee, LogOut, Share2 } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/pedidos', icon: ShoppingBag },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Produtos', href: '/produtos', icon: Pizza },
  { name: 'Adicionais', href: '/extras', icon: Coffee },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const logout = useStore((state) => state.logout);
  const lanchonete = useStore((state) => state.lanchonete);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const publicUrl = lanchonete 
    ? `/cardapio/${lanchonete.nome.toLowerCase().replace(/\s+/g, '-')}` 
    : '';

  const handleShare = () => {
    const url = window.location.origin + publicUrl;
    if (navigator.share) {
      navigator.share({
        title: lanchonete?.nome,
        text: 'Faça seu pedido online!',
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado para a área de transferência!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden p-4 bg-white shadow">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex">
        <aside className={`
          ${isMobileMenuOpen ? 'block' : 'hidden'}
          lg:block lg:w-64 lg:fixed lg:inset-y-0
          bg-white border-r border-gray-200
        `}>
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">{lanchonete?.nome}</h1>
              {lanchonete?.telefone && (
                <p className="text-sm text-gray-500 mt-1">{lanchonete.telefone}</p>
              )}
              <button
                onClick={handleShare}
                className="mt-2 flex items-center text-sm text-blue-600 hover:text-blue-700"
              >
                <Share2 className="h-4 w-4 mr-1" />
                Compartilhar Cardápio
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-md
                      ${isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
              >
                <LogOut className="mr-3 h-5 w-5" />
                Sair
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 lg:pl-64">
          <div className="max-w-7xl mx-auto p-4">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}