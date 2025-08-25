'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    // Testovacie dáta pre platobnú bránu
    const mockOrders: Order[] = [
      {
        id: 'TEST-001',
        customerName: 'Test Zákazník 1',
        customerEmail: 'test1@example.com',
        total: 29.99,
        status: 'Spracováva sa',
        date: '2024-08-24',
        items: [
          { name: 'Tričko s potlačou', quantity: 1, price: 29.99 }
        ]
      },
      {
        id: 'TEST-002',
        customerName: 'Test Zákazník 2',
        customerEmail: 'test2@example.com',
        total: 45.50,
        status: 'Odoslané',
        date: '2024-08-24',
        items: [
          { name: 'Hrnček s potlačou', quantity: 1, price: 32.50 },
          { name: 'Nálepka', quantity: 13, price: 0.01 }
        ]
      },
      {
        id: 'TEST-003',
        customerName: 'Test Zákazník 3',
        customerEmail: 'test3@example.com',
        total: 12.99,
        status: 'Doručené',
        date: '2024-08-23',
        items: [
          { name: 'Nálepka', quantity: 1299, price: 0.01 }
        ]
      },
      {
        id: 'TEST-004',
        customerName: 'Test Zákazník 4',
        customerEmail: 'test4@example.com',
        total: 67.25,
        status: 'Spracováva sa',
        date: '2024-08-23',
        items: [
          { name: 'Tričko s potlačou', quantity: 2, price: 29.99 },
          { name: 'Hrnček s potlačou', quantity: 1, price: 32.50 },
          { name: 'Nálepka', quantity: 476, price: 0.01 }
        ]
      },
      {
        id: 'TEST-005',
        customerName: 'Test Zákazník 5',
        customerEmail: 'test5@example.com',
        total: 89.99,
        status: 'Odoslané',
        date: '2024-08-22',
        items: [
          { name: 'Tričko s potlačou', quantity: 3, price: 29.99 }
        ]
      }
    ];

    setOrders(mockOrders);
    setIsLoading(false);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Doručené': return 'bg-green-100 text-green-800';
      case 'Odoslané': return 'bg-blue-100 text-blue-800';
      case 'Spracováva sa': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="orders">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítavam objednávky...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="orders">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Správa objednávok</h1>
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">Všetky statusy</option>
              <option value="Spracováva sa">Spracováva sa</option>
              <option value="Odoslané">Odoslané</option>
              <option value="Doručené">Doručené</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID objednávky
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            // Zobraziť detaily objednávky
                            alert(`Detaily objednávky ${order.id}:\n${order.items.map(item => `${item.name} x${item.quantity} - ${item.price}€`).join('\n')}`);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Zobraziť
                        </button>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="Spracováva sa">Spracováva sa</option>
                          <option value="Odoslané">Odoslané</option>
                          <option value="Doručené">Doručené</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Súhrn</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
              <div className="text-sm text-gray-500">Celkové objednávky</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'Spracováva sa').length}
              </div>
              <div className="text-sm text-gray-500">Spracovávajú sa</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'Odoslané').length}
              </div>
              <div className="text-sm text-gray-500">Odoslané</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'Doručené').length}
              </div>
              <div className="text-sm text-gray-500">Doručené</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
