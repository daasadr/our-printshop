'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Notification {
  id: string;
  type: 'order' | 'user' | 'system' | 'security';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  action_url?: string;
  user_id?: string;
  order_id?: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [typeFilter, setTypeFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    try {
      // Mock dáta pre notifikácie
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'order',
          title: 'Nová objednávka',
          message: 'Prijatá nová objednávka #ORD-2024-001 od zákazníka John Doe',
          is_read: false,
          created_at: '2024-08-25T15:30:00Z',
          priority: 'high',
          action_url: '/admin/orders',
          order_id: 'ORD-2024-001'
        },
        {
          id: '2',
          type: 'user',
          title: 'Nový používateľ',
          message: 'Registroval sa nový používateľ: jane.smith@example.com',
          is_read: false,
          created_at: '2024-08-25T14:15:00Z',
          priority: 'medium',
          action_url: '/admin/users',
          user_id: '3'
        },
        {
          id: '3',
          type: 'security',
          title: 'Bezpečnostné upozornenie',
          message: 'Detekovaná neobvyklá aktivita - viacero pokusov o prihlásenie',
          is_read: false,
          created_at: '2024-08-25T13:45:00Z',
          priority: 'critical',
          action_url: '/admin/security'
        },
        {
          id: '4',
          type: 'system',
          title: 'Backup dokončený',
          message: 'Automatický backup databázy bol úspešne dokončený',
          is_read: true,
          created_at: '2024-08-25T12:00:00Z',
          priority: 'low'
        },
        {
          id: '5',
          type: 'order',
          title: 'Platba potvrdená',
          message: 'Platba pre objednávku #ORD-2024-002 bola úspešne spracovaná',
          is_read: true,
          created_at: '2024-08-25T11:30:00Z',
          priority: 'medium',
          action_url: '/admin/orders',
          order_id: 'ORD-2024-002'
        },
        {
          id: '6',
          type: 'system',
          title: 'Aktualizácia systému',
          message: 'Dostupná je nová verzia admin panelu v1.2.0',
          is_read: true,
          created_at: '2024-08-25T10:00:00Z',
          priority: 'medium'
        },
        {
          id: '7',
          type: 'user',
          title: 'Zabanovaný používateľ',
          message: 'Používateľ spam@example.com bol zabanovaný kvôli porušeniu pravidiel',
          is_read: true,
          created_at: '2024-08-25T09:15:00Z',
          priority: 'high',
          action_url: '/admin/users',
          user_id: '6'
        },
        {
          id: '8',
          type: 'order',
          title: 'Objednávka odoslaná',
          message: 'Objednávka #ORD-2024-003 bola odoslaná zákazníkovi',
          is_read: true,
          created_at: '2024-08-25T08:30:00Z',
          priority: 'medium',
          action_url: '/admin/orders',
          order_id: 'ORD-2024-003'
        }
      ];
      
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.is_read) ||
                         (filter === 'read' && notification.is_read);
    const matchesType = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesFilter && matchesType;
  });

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId ? { ...notif, is_read: true } : notif
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
  };

  const handleDeleteNotification = (notificationId: string) => {
    if (confirm('Naozaj chcete vymazať túto notifikáciu?')) {
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'security':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'order': return 'bg-blue-100 text-blue-600';
      case 'user': return 'bg-green-100 text-green-600';
      case 'security': return 'bg-red-100 text-red-600';
      case 'system': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sk-SK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (isLoading) {
    return (
      <AdminLayout currentPage="notifications">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Načítavam notifikácie...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="notifications">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifikácie</h1>
            <p className="text-sm text-gray-500 mt-1">
              {unreadCount} neprečítaných z {notifications.length} celkovo
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleMarkAllAsRead}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Označiť všetko ako prečítané
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Všetky notifikácie</option>
                <option value="unread">Neprečítané</option>
                <option value="read">Prečítané</option>
              </select>
            </div>
            <div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Všetky typy</option>
                <option value="order">Objednávky</option>
                <option value="user">Používatelia</option>
                <option value="security">Bezpečnosť</option>
                <option value="system">Systém</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {
                  setFilter('all');
                  setTypeFilter('all');
                }}
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Resetovať filtre
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.47A.998.998 0 004.47 4.19L4.47 4.19zM4.19 19.53a.998.998 0 001.28 1.28L4.19 19.53zM19.53 4.19a.998.998 0 00-1.28 1.28L19.53 4.19zM19.53 19.53a.998.998 0 001.28-1.28L19.53 19.53z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Žiadne notifikácie</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === 'unread' ? 'Všetky notifikácie sú prečítané.' : 'Nie sú tu žiadne notifikácie.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border rounded-lg ${
                      notification.is_read 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-white border-blue-200 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <h3 className={`text-sm font-medium ${
                              notification.is_read ? 'text-gray-900' : 'text-blue-900'
                            }`}>
                              {notification.title}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                              {notification.priority === 'critical' ? 'Kritické' :
                               notification.priority === 'high' ? 'Vysoké' :
                               notification.priority === 'medium' ? 'Stredné' : 'Nízke'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.created_at)}
                            </span>
                            {!notification.is_read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        
                        <p className="mt-1 text-sm text-gray-600">
                          {notification.message}
                        </p>
                        
                        <div className="mt-3 flex items-center space-x-3">
                          {notification.action_url && (
                            <button
                              onClick={() => window.open(notification.action_url, '_blank')}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Zobraziť detaily
                            </button>
                          )}
                          
                          {!notification.is_read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="text-sm text-gray-600 hover:text-gray-800"
                            >
                              Označiť ako prečítané
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="text-sm text-red-600 hover:text-red-800"
                          >
                            Vymazať
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notification Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Celkovo</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Neprečítané</p>
                <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Kritické</p>
                <p className="text-2xl font-bold text-gray-900">
                  {notifications.filter(n => n.priority === 'critical' && !n.is_read).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Prečítané</p>
                <p className="text-2xl font-bold text-gray-900">{notifications.filter(n => n.is_read).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
