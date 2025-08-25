'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Category {
  id: string;
  name: string;
  name_cs?: string;
  name_sk?: string;
  name_en?: string;
  name_de?: string;
  description?: string;
  slug: string;
  parent_id?: string;
  is_active: boolean;
  product_count: number;
  created_at: string;
  updated_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      // Mock dáta pre kategórie
      const mockCategories: Category[] = [
        {
          id: '1',
          name: 'Oblečenie',
          name_cs: 'Oblečení',
          name_sk: 'Oblečenie',
          name_en: 'Clothing',
          name_de: 'Kleidung',
          description: 'Všetky druhy oblečenia',
          slug: 'clothing',
          is_active: true,
          product_count: 25,
          created_at: '2024-01-15T10:00:00Z',
          updated_at: '2024-08-20T14:30:00Z'
        },
        {
          id: '2',
          name: 'Tričká',
          name_cs: 'Trička',
          name_sk: 'Tričká',
          name_en: 'T-shirts',
          name_de: 'T-Shirts',
          description: 'Tričká s potlačou',
          slug: 't-shirts',
          parent_id: '1',
          is_active: true,
          product_count: 15,
          created_at: '2024-01-16T11:00:00Z',
          updated_at: '2024-08-19T16:45:00Z'
        },
        {
          id: '3',
          name: 'Mikiny',
          name_cs: 'Mikiny',
          name_sk: 'Mikiny',
          name_en: 'Hoodies',
          name_de: 'Kapuzenpullover',
          description: 'Mikiny a hoodie',
          slug: 'hoodies',
          parent_id: '1',
          is_active: true,
          product_count: 8,
          created_at: '2024-01-17T12:00:00Z',
          updated_at: '2024-08-18T13:20:00Z'
        },
        {
          id: '4',
          name: 'Doplnky',
          name_cs: 'Doplňky',
          name_sk: 'Doplnky',
          name_en: 'Accessories',
          name_de: 'Zubehör',
          description: 'Rôzne doplnky',
          slug: 'accessories',
          is_active: true,
          product_count: 12,
          created_at: '2024-01-18T13:00:00Z',
          updated_at: '2024-08-17T15:10:00Z'
        },
        {
          id: '5',
          name: 'Hrnčeky',
          name_cs: 'Hrnky',
          name_sk: 'Hrnčeky',
          name_en: 'Mugs',
          name_de: 'Tassen',
          description: 'Hrnčeky s potlačou',
          slug: 'mugs',
          parent_id: '4',
          is_active: true,
          product_count: 6,
          created_at: '2024-01-19T14:00:00Z',
          updated_at: '2024-08-16T12:30:00Z'
        }
      ];
      
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    setIsCreating(true);
    setSelectedCategory({
      id: '',
      name: '',
      slug: '',
      is_active: true,
      product_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleSaveCategory = async (categoryData: Category) => {
    try {
      if (isCreating) {
        // Simulácia vytvorenia novej kategórie
        const newCategory = {
          ...categoryData,
          id: Date.now().toString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setCategories(prev => [...prev, newCategory]);
      } else {
        // Simulácia aktualizácie kategórie
        setCategories(prev => prev.map(cat => 
          cat.id === categoryData.id 
            ? { ...categoryData, updated_at: new Date().toISOString() }
            : cat
        ));
      }
      
      setSelectedCategory(null);
      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('Naozaj chcete vymazať túto kategóriu?')) {
      try {
        setCategories(prev => prev.filter(cat => cat.id !== categoryId));
        setSelectedCategory(null);
        setIsEditing(false);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const getParentCategoryName = (parentId: string) => {
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : '';
  };

  if (isLoading) {
    return (
      <AdminLayout currentPage="categories">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Načítavam kategórie...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentPage="categories">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Správa kategórií</h1>
          <button
            onClick={handleCreateCategory}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Pridať kategóriu
          </button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Hľadať kategórie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Kategórie ({filteredCategories.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Názov
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nadradená kategória
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produkty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcie
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.parent_id ? getParentCategoryName(category.parent_id) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {category.product_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        category.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {category.is_active ? 'Aktívna' : 'Neaktívna'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Upraviť
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Vymazať
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Form Modal */}
        {(isEditing || isCreating) && selectedCategory && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {isCreating ? 'Nová kategória' : 'Upraviť kategóriu'}
                </h3>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveCategory(selectedCategory);
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Názov (SK)</label>
                      <input
                        type="text"
                        value={selectedCategory.name_sk || selectedCategory.name}
                        onChange={(e) => setSelectedCategory(prev => prev ? {...prev, name_sk: e.target.value, name: e.target.value} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Názov (CS)</label>
                      <input
                        type="text"
                        value={selectedCategory.name_cs || ''}
                        onChange={(e) => setSelectedCategory(prev => prev ? {...prev, name_cs: e.target.value} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Názov (EN)</label>
                      <input
                        type="text"
                        value={selectedCategory.name_en || ''}
                        onChange={(e) => setSelectedCategory(prev => prev ? {...prev, name_en: e.target.value} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Názov (DE)</label>
                      <input
                        type="text"
                        value={selectedCategory.name_de || ''}
                        onChange={(e) => setSelectedCategory(prev => prev ? {...prev, name_de: e.target.value} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Slug</label>
                      <input
                        type="text"
                        value={selectedCategory.slug}
                        onChange={(e) => setSelectedCategory(prev => prev ? {...prev, slug: e.target.value} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Popis</label>
                      <textarea
                        value={selectedCategory.description || ''}
                        onChange={(e) => setSelectedCategory(prev => prev ? {...prev, description: e.target.value} : null)}
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Nadradená kategória</label>
                      <select
                        value={selectedCategory.parent_id || ''}
                        onChange={(e) => setSelectedCategory(prev => prev ? {...prev, parent_id: e.target.value || undefined} : null)}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Žiadna</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={selectedCategory.is_active}
                        onChange={(e) => setSelectedCategory(prev => prev ? {...prev, is_active: e.target.checked} : null)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Aktívna kategória
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(null);
                        setIsEditing(false);
                        setIsCreating(false);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Zrušiť
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                    >
                      {isCreating ? 'Vytvoriť' : 'Uložiť'}
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
