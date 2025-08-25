"use client";

import React, { useState, useEffect } from 'react';
import { getDictionary } from '@/lib/getDictionary';
import { Locale } from '@/context/LocaleContext';
import PageTransition from '@/components/PageTransition';

interface AdminPageProps {
  params: {
    lang: Locale;
  };
}

interface DashboardStats {
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  recentActivity: Array<{
    id: string;
    type: 'order' | 'user' | 'product';
    action: string;
    timestamp: string;
    details: string;
  }>;
  securityAlerts: Array<{
    id: string;
    type: 'warning' | 'error' | 'info';
    message: string;
    timestamp: string;
  }>;
}

export default function AdminPage({ params: { lang } }: AdminPageProps) {
  const [dictionary, setDictionary] = useState<any>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    recentActivity: [],
    securityAlerts: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Načtení dictionary
  useEffect(() => {
    const loadDictionary = async () => {
      try {
        const dict = await getDictionary(lang);
        setDictionary(dict);
      } catch (error) {
        console.warn('Failed to load dictionary:', error);
      }
    };
    loadDictionary();
  }, [lang]);

  // Načtení dashboard dat
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // TODO: Implementovat načítanie dát z Directus
        // Pre teraz použijeme mock data
        const mockStats: DashboardStats = {
          totalOrders: 42,
          totalUsers: 156,
          totalProducts: 89,
          recentActivity: [
            {
              id: '1',
              type: 'order',
              action: 'Nová objednávka',
              timestamp: new Date().toISOString(),
              details: 'Objednávka #1234 - 89.99 €'
            },
            {
              id: '2',
              type: 'user',
              action: 'Nový užívateľ',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              details: 'john.doe@example.com'
            },
            {
              id: '3',
              type: 'product',
              action: 'Produkt aktualizovaný',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              details: 'Tričko s potlačou - cena zmenená'
            }
          ],
          securityAlerts: [
            {
              id: '1',
              type: 'warning',
              message: '5 neúspešných prihlásení z IP 192.168.1.100',
              timestamp: new Date().toISOString()
            },
            {
              id: '2',
              type: 'info',
              message: 'GDPR súhlas odvolaný - user@example.com',
              timestamp: new Date(Date.now() - 1800000).toISOString()
            }
          ]
        };
        
        setStats(mockStats);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (!dictionary || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Načítavam admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {dictionary?.admin?.title || 'Admin Panel'}
                </h1>
                <p className="text-gray-600">
                  {dictionary?.admin?.subtitle || 'Správa a monitoring aplikácie'}
                </p>
              </div>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  {dictionary?.admin?.refresh || 'Obnoviť'}
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  {dictionary?.admin?.settings || 'Nastavenia'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {dictionary?.admin?.total_orders || 'Celkové objednávky'}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {dictionary?.admin?.total_users || 'Celkoví užívatelia'}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {dictionary?.admin?.total_products || 'Celkové produkty'}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {dictionary?.admin?.recent_activity || 'Posledná aktivita'}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'order' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'user' ? 'bg-green-100 text-green-600' :
                        'bg-purple-100 text-purple-600'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {activity.type === 'order' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          )}
                          {activity.type === 'user' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          )}
                          {activity.type === 'product' && (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          )}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.details}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Alerts */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  {dictionary?.admin?.security_alerts || 'Bezpečnostné upozornenia'}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {stats.securityAlerts.map((alert) => (
                    <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                      alert.type === 'error' ? 'bg-red-50 border-red-400' :
                      'bg-blue-50 border-blue-400'
                    }`}>
                      <div className="flex">
                        <div className={`flex-shrink-0 ${
                          alert.type === 'warning' ? 'text-yellow-400' :
                          alert.type === 'error' ? 'text-red-400' :
                          'text-blue-400'
                        }`}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            {alert.type === 'warning' && (
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            )}
                            {alert.type === 'error' && (
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            )}
                            {alert.type === 'info' && (
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            )}
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-gray-700">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}


