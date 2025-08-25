'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    sales: number;
    revenue: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  customerStats: {
    newCustomers: number;
    returningCustomers: number;
    totalCustomers: number;
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 90d, 1y
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulujeme načítanie dát z API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: AnalyticsData = {
        totalRevenue: 15420.50,
        totalOrders: 234,
        averageOrderValue: 65.90,
        topProducts: [
          { name: 'Unisex t-shirt "In code we trust"', sales: 45, revenue: 517.50 },
          { name: 'Unisex Hoodie "200 OK"', sales: 32, revenue: 752.00 },
          { name: 'Unisex Sweatshirt "Debug"', sales: 28, revenue: 448.00 },
          { name: 'Hrnček s potlačou', sales: 25, revenue: 187.50 },
          { name: 'Nálepka "Git"', sales: 22, revenue: 66.00 }
        ],
        monthlyRevenue: [
          { month: 'Jan', revenue: 1200, orders: 18 },
          { month: 'Feb', revenue: 1350, orders: 22 },
          { month: 'Mar', revenue: 980, orders: 15 },
          { month: 'Apr', revenue: 1450, orders: 24 },
          { month: 'May', revenue: 1680, orders: 28 },
          { month: 'Jun', revenue: 1890, orders: 32 },
          { month: 'Jul', revenue: 2100, orders: 35 },
          { month: 'Aug', revenue: 15420.50, orders: 234 }
        ],
        customerStats: {
          newCustomers: 156,
          returningCustomers: 78,
          totalCustomers: 234
        }
      };
      
      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="analytics">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Načítavam analytiku...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!analyticsData) {
    return (
      <AdminLayout currentPage="analytics">
        <div className="text-center text-gray-600">Chyba pri načítaní dát</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="analytics">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Analytika</h1>
          <div className="flex space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="7d">Posledných 7 dní</option>
              <option value="30d">Posledných 30 dní</option>
              <option value="90d">Posledných 90 dní</option>
              <option value="1y">Posledný rok</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Celkový príjem</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Objednávky</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Priemerná objednávka</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.averageOrderValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Zákazníci</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.customerStats.totalCustomers}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Najpredávanejšie produkty</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                        {index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">{product.sales} predaných</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Stats */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Štatistiky zákazníkov</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Noví zákazníci</span>
                  <span className="text-sm font-medium text-gray-900">{analyticsData.customerStats.newCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vracajúci sa zákazníci</span>
                  <span className="text-sm font-medium text-gray-900">{analyticsData.customerStats.returningCustomers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Celkovo zákazníkov</span>
                  <span className="text-sm font-medium text-gray-900">{analyticsData.customerStats.totalCustomers}</span>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Miera návratnosti</span>
                    <span className="text-sm font-medium text-green-600">
                      {Math.round((analyticsData.customerStats.returningCustomers / analyticsData.customerStats.totalCustomers) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Mesačný príjem</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analyticsData.monthlyRevenue.map((month, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 text-sm text-gray-600">{month.month}</div>
                  <div className="flex-1 ml-4">
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(month.revenue / Math.max(...analyticsData.monthlyRevenue.map(m => m.revenue))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(month.revenue)}</div>
                    <div className="text-xs text-gray-500">{month.orders} objednávok</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
