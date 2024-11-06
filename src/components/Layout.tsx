import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Pizza, Menu, Coffee } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Pedidos', href: '/pedidos', icon: ShoppingBag },
  { name: 'Clientes', href: '/clientes', icon: Users },
  { name: 'Produtos', href: '/produtos', icon: Pizza },
  { name: 'Adicionais', href: '/extras', icon: Coffee },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
            <div className="p-4">
              <h1 className="text-2xl font-bold text-gray-900">Lanchonete</h1>
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