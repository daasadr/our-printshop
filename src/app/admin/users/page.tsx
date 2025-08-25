'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'banned';
  created_at: string;
  last_login?: string;
  order_count: number;
  total_spent: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Mock dáta pre používateľov
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'admin@happywilderness.com',
          name: 'Admin User',
          role: 'admin',
          status: 'active',
          created_at: '2024-01-01T10:00:00Z',
          last_login: '2024-08-25T15:30:00Z',
          order_count: 0,
          total_spent: 0
        },
        {
          id: '2',
          email: 'john.doe@example.com',
          name: 'John Doe',
          role: 'user',
          status: 'active',
          created_at: '2024-02-15T14:20:00Z',
          last_login: '2024-08-24T09:15:00Z',
          order_count: 5,
          total_spent: 234.50
        },
        {
          id: '3',
          email: 'jane.smith@example.com',
          name: 'Jane Smith',
          role: 'user',
          status: 'active',
          created_at: '2024-03-10T11:30:00Z',
          last_login: '2024-08-23T16:45:00Z',
          order_count: 3,
          total_spent: 156.75
        },
        {
          id: '4',
          email: 'bob.wilson@example.com',
          name: 'Bob Wilson',
          role: 'user',
          status: 'inactive',
          created_at: '2024-04-05T08:15:00Z',
          last_login: '2024-07-15T12:30:00Z',
          order_count: 1,
          total_spent: 45.99
        },
        {
          id: '5',
          email: 'alice.brown@example.com',
          name: 'Alice Brown',
          role: 'moderator',
          status: 'active',
          created_at: '2024-05-20T13:45:00Z',
          last_login: '2024-08-25T10:20:00Z',
          order_count: 2,
          total_spent: 89.25
        },
        {
          id: '6',
          email: 'spam@example.com',
          name: 'Spam User',
          role: 'user',
          status: 'banned',
          created_at: '2024-06-01T09:00:00Z',
          last_login: '2024-08-20T14:00:00Z',
          order_count: 0,
          total_spent: 0
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
  };

  const handleSaveUser = async (userData: User) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userData.id ? { ...userData, last_login: user.last_login } : user
      ));
      
      setSelectedUser(null);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Naozaj chcete vymazať tohto používateľa?')) {
      try {
        setUsers(prev => prev.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-yellow-100 text-yellow-800';
      case 'banned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="users">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Načítavam používateľov...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Správa používateľov</h1>
          <div className="text-sm text-gray-500">
            {filteredUsers.length} z {users.length} používateľov
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Hľadať používateľov..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Všetky stavy</option>
                <option value="active">Aktívni</option>
                <option value="inactive">Neaktívni</option>
                <option value="banned">Zabanovaní</option>
              </select>
            </div>
            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Všetky role</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderátor</option>
                <option value="user">Používateľ</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setRoleFilter('all');
                }}
                className="w-full p-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Resetovať filtre
              </button>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Používateľ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Objednávky
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Celková suma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posledné prihlásenie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">
                          Registrovaný: {formatDate(user.created_at)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {user.role === 'admin' ? 'Admin' : 
                         user.role === 'moderator' ? 'Moderátor' : 'Používateľ'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status === 'active' ? 'Aktívny' : 
                         user.status === 'inactive' ? 'Neaktívny' : 'Zabanovaný'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.order_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(user.total_spent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.last_login ? formatDate(user.last_login) : 'Nikdy'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Upraviť
                        </button>
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Vymazať
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Edit Modal */}
        {isEditing && selectedUser && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Upraviť používateľa</h3>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveUser(selectedUser);
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Meno</label>
                      <input
                        type="text"
                        value={selectedUser.name}
                        onChange={(e) => setSelectedUser(prev => prev ? {...prev, name: e.target.value} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={selectedUser.email}
                        onChange={(e) => setSelectedUser(prev => prev ? {...prev, email: e.target.value} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Role</label>
                      <select
                        value={selectedUser.role}
                        onChange={(e) => setSelectedUser(prev => prev ? {...prev, role: e.target.value as 'admin' | 'user' | 'moderator'} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="user">Používateľ</option>
                        <option value="moderator">Moderátor</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <select
                        value={selectedUser.status}
                        onChange={(e) => setSelectedUser(prev => prev ? {...prev, status: e.target.value as 'active' | 'inactive' | 'banned'} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="active">Aktívny</option>
                        <option value="inactive">Neaktívny</option>
                        <option value="banned">Zabanovaný</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedUser(null);
                        setIsEditing(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Zrušiť
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Uložiť
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
