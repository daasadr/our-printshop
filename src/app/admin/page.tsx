'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface AdminStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentOrders: Array<{
    id: string;
    customerName: string;
    total: number;
    status: string;
    date: string;
  }>;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);

  // Jednoduchá autentifikácia - heslo z env
  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

  useEffect(() => {
    // Skontrolujeme či je už prihlásený
    const authStatus = localStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadDashboardData();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulujeme loading
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
      loadDashboardData();
    } else {
      alert('Nesprávne heslo!');
    }
    setIsLoading(false);
  };

  const loadDashboardData = async () => {
    try {
      // Načítame reálny počet produktov z API
      console.log('Admin Dashboard - Loading real data...');
      const productsResponse = await fetch('/api/products?limit=1000');
      const productsData = await productsResponse.json();
      
      // Filtrujeme len základné produkty (bez variantov)
      const baseProducts = productsData.filter((product: any) => !product.product_id);
      const totalProducts = baseProducts.length;
      
      console.log('Admin Dashboard - Total products:', totalProducts);
      
      // Testovacie dáta pre platobnú bránu (ostatné sú mock)
      const mockStats: AdminStats = {
        totalOrders: 23,
        totalUsers: 15,
        totalProducts: totalProducts, // Reálny počet produktov
        recentOrders: [
          {
            id: 'TEST-001',
            customerName: 'Test Zákazník 1',
            total: 29.99,
            status: 'Spracováva sa',
            date: '2024-08-24'
          },
          {
            id: 'TEST-002',
            customerName: 'Test Zákazník 2',
            total: 45.50,
            status: 'Odoslané',
            date: '2024-08-24'
          },
          {
            id: 'TEST-003',
            customerName: 'Test Zákazník 3',
            total: 12.99,
            status: 'Doručené',
            date: '2024-08-23'
          },
          {
            id: 'TEST-004',
            customerName: 'Test Zákazník 4',
            total: 67.25,
            status: 'Spracováva sa',
            date: '2024-08-23'
          }
        ]
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Admin Dashboard - Error loading data:', error);
      // Fallback na mock dáta ak API zlyhá
      const mockStats: AdminStats = {
        totalOrders: 23,
        totalUsers: 15,
        totalProducts: 40, // Fallback hodnota
        recentOrders: [
          {
            id: 'TEST-001',
            customerName: 'Test Zákazník 1',
            total: 29.99,
            status: 'Spracováva sa',
            date: '2024-08-24'
          },
          {
            id: 'TEST-002',
            customerName: 'Test Zákazník 2',
            total: 45.50,
            status: 'Odoslané',
            date: '2024-08-24'
          },
          {
            id: 'TEST-003',
            customerName: 'Test Zákazník 3',
            total: 12.99,
            status: 'Doručené',
            date: '2024-08-23'
          },
          {
            id: 'TEST-004',
            customerName: 'Test Zákazník 4',
            total: 67.25,
            status: 'Spracováva sa',
            date: '2024-08-23'
          }
        ]
      };
      setStats(mockStats);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Admin Panel</h2>
            <p className="mt-2 text-gray-600">Prihláste sa pre prístup</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Heslo
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
                placeholder="Zadajte heslo"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Prihlasujem...' : 'Prihlásiť'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout currentPage="dashboard">
      {stats ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Celkové objednávky</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Registrovaní používatelia</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Produkty</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalProducts}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Posledné objednávky
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Zákazník
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Suma
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dátum
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.total} €
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'Doručené' ? 'bg-green-100 text-green-800' :
                            order.status === 'Odoslané' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Gateway Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-blue-900">Platobná brána - Testovacie dáta</h3>
                <p className="text-blue-700 mt-1">
                  Aktuálne zobrazujeme testovacie objednávky pre vývoj platobnej brány. 
                  Všetky dáta sú simulované pre testovanie Stripe integrácie.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Rýchle akcie
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => window.location.href = '/admin/products'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Pridať produkt
                </button>
                <button 
                  onClick={() => window.location.href = '/admin/orders'}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Zobraziť všetky objednávky
                </button>
                <button 
                  onClick={() => window.location.href = '/admin/settings'}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Nastavenia
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítavam dáta...</p>
        </div>
      )}
    </AdminLayout>
  );
}
