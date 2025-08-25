'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

interface Product {
  id: string;
  name: string;
  name_cs?: string;
  name_sk?: string;
  name_en?: string;
  name_de?: string;
  description_cs?: string;
  description_sk?: string;
  description_en?: string;
  description_de?: string;
  icon_cs?: string;
  icon_sk?: string;
  icon_en?: string;
  icon_de?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dostupné ikonky - základné univerzálne emoji
  const availableIcons = [
    // Základné symboly
    { emoji: '❤️', name: 'Srdce' },
    { emoji: '💪', name: 'Sila' },
    { emoji: '🔥', name: 'Oheň' },
    { emoji: '⚡', name: 'Blesk' },
    { emoji: '💡', name: 'Žiarovka' },
    { emoji: '💎', name: 'Diamant' },
    { emoji: '🚀', name: 'Raketa' },
    { emoji: '🎯', name: 'Terč' },
    { emoji: '🎉', name: 'Oslava' },
    { emoji: '✨', name: 'Šparkle' },
    
    // Príroda
    { emoji: '☀️', name: 'Slnko' },
    { emoji: '🌙', name: 'Mesiac' },
    { emoji: '⭐', name: 'Hviezda' },
    { emoji: '🌟', name: 'Záblesk' },
    { emoji: '🌈', name: 'Dúha' },
    { emoji: '🌊', name: 'Vlny' },
    
    // Umenie a kultúra
    { emoji: '🎨', name: 'Štetec' },
    { emoji: '🎵', name: 'Muzika' },
    { emoji: '🎤', name: 'Mikrofon' },
    { emoji: '💃', name: 'Tanec' },
    
    // Jedlo a nápoje
    { emoji: '🍹', name: 'Koktail' },
    { emoji: '🍷', name: 'Víno' },
    { emoji: '🍕', name: 'Pizza' },
    { emoji: '🍦', name: 'Zmrzlina' },
    
    // Symboly
    { emoji: '♠️', name: 'Pik' },
    { emoji: '♥️', name: 'Srdce' },
    { emoji: '♦️', name: 'Káro' },
    { emoji: '♣️', name: 'Kríž' },
    { emoji: '☮️', name: 'Mier' },
    { emoji: '☯️', name: 'Jin Yang' },
    { emoji: '✡️', name: 'Dávidova hviezda' },
    { emoji: '☪️', name: 'Pôlměsíc' },
    { emoji: '✝️', name: 'Kríž' }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      console.log('Admin Products - Fetching products from API...');
      const response = await fetch('/api/products?limit=1000');
      const data = await response.json();
      console.log('Admin Products - Fetched products:', data.length);
      
      // Transformácia dát pre admin panel - len základné produkty (bez variantov)
      // Filtrujeme len produkty ktoré nemajú product_id (nie sú varianty)
      const baseProducts = data.filter((product: any) => !product.product_id);
      
      const transformedProducts: Product[] = baseProducts.map((product: any) => ({
        id: product.id,
        name: product.name || product.name_cs || 'Bez názvu',
        name_cs: product.name_cs,
        name_sk: product.name_sk,
        name_en: product.name_en,
        name_de: product.name_de,
        description_cs: product.description_cs,
        description_sk: product.description_sk,
        description_en: product.description_en,
        description_de: product.description_de,
        icon_cs: product.icon_cs,
        icon_sk: product.icon_sk,
        icon_en: product.icon_en,
        icon_de: product.icon_de
      }));
      
      setProducts(transformedProducts);
      setFilteredProducts(transformedProducts);
      console.log('Admin Products - Loaded products:', transformedProducts.length);
    } catch (error) {
      console.error('Chyba pri načítaní produktov:', error);
      // Fallback na mock dáta ak API zlyhá
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Tričko s potlačou',
          description_cs: 'Kvalitné bavlnené tričko s unikátnou potlačou',
          description_sk: 'Kvalitné bavlnené tričko s unikátnou potlačou',
          icon_cs: '👕',
          icon_sk: '👕'
        },
        {
          id: '2',
          name: 'Hrnček s potlačou',
          description_cs: 'Keramický hrnček s odolnou potlačou',
          description_sk: 'Keramický hrnček s odolnou potlačou',
          icon_cs: '☕',
          icon_sk: '☕'
        },
        {
          id: '3',
          name: 'Nálepka',
          description_cs: 'Vysokokvalitná nálepka s pestrými farbami',
          description_sk: 'Vysokokvalitná nálepka s pestrými farbami',
          icon_cs: '🏷️',
          icon_sk: '🏷️'
        }
      ];
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    }
  };

  // Filtrovanie produktov podľa vyhľadávania
  useEffect(() => {
    if (!products) {
      setFilteredProducts([]);
      return;
    }
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm]);

  const updateProductDescription = (productId: string, field: string, value: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, [field]: value } : p
    ));
    
    // Aktualizuj aj selectedProduct ak je to ten istý produkt
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const translateFromCzech = async (targetLang: 'en' | 'de') => {
    if (!selectedProduct?.description_cs) {
      alert('Najprv napíšte popis v češtine!');
      return;
    }

    setTranslating(true);
    try {
      // Preklad popisu
      const descriptionResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: selectedProduct.description_cs,
          from: 'cs',
          to: targetLang
        }),
      });

      if (descriptionResponse.ok) {
        const descriptionData = await descriptionResponse.json();
        const translatedDescription = descriptionData.translatedText;
        updateProductDescription(selectedProduct.id, `description_${targetLang}`, translatedDescription);
        alert(`Preložené do ${targetLang.toUpperCase()}`);
      } else {
        alert('Chyba pri preklade');
      }
    } catch (error) {
      console.error('Chyba pri preklade:', error);
      alert('Chyba pri preklade');
    } finally {
      setTranslating(false);
    }
  };

  const saveDescriptions = async (product: Product) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/products/${product.id}/descriptions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description_cs: product.description_cs,
          description_sk: product.description_sk,
          description_en: product.description_en,
          description_de: product.description_de,
          icon_cs: product.icon_cs,
          icon_sk: product.icon_sk,
          icon_en: product.icon_en,
          icon_de: product.icon_de,
          name: product.name
        }),
      });

      if (response.ok) {
        alert('Popisky boli uložené!');
        setSelectedProduct(null);
        fetchProducts(); // Obnoviť zoznam
      } else {
        alert('Chyba pri ukladaní popiskov');
      }
    } catch (error) {
      console.error('Chyba pri ukladaní:', error);
      alert('Chyba pri ukladaní popiskov');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout currentPage="products">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Správa produktov a popiskov</h1>
          <div className="text-sm text-gray-500">
            {filteredProducts.length} produktov
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ľavý panel - Zoznam produktov */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Produkty</h2>
              
              {/* Vyhľadávací panel */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Hľadať podľa názvu alebo ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-4 bg-gray-50 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                      selectedProduct?.id === product.id ? 'border-blue-500 shadow-md bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-sm text-gray-600">ID: {product.id}</div>
                    
                    {/* Emoji náhľad */}
                    <div className="text-sm mt-1">
                      {product.icon_cs && <span className="mr-1 text-lg" title="CZ ikonka">{product.icon_cs}</span>}
                      {product.icon_sk && <span className="mr-1 text-lg" title="SK ikonka">{product.icon_sk}</span>}
                      {product.icon_en && <span className="mr-1 text-lg" title="EN ikonka">{product.icon_en}</span>}
                      {product.icon_de && <span className="mr-1 text-lg" title="DE ikonka">{product.icon_de}</span>}
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-1">
                      {product.description_cs ? '✅' : '❌'} CZ
                      {product.description_sk ? ' ✅' : ' ❌'} SK
                      {product.description_en ? ' ✅' : ' ❌'} EN
                      {product.description_de ? ' ✅' : ' ❌'} DE
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pravý panel - Editor */}
          <div className="lg:col-span-2">
            {selectedProduct ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Upraviť popisky: {selectedProduct.name}
                </h2>

                <div className="space-y-6">
                  {/* Názov produktu */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Názov produktu</label>
                    <input
                      type="text"
                      value={selectedProduct.name || ''}
                      onChange={(e) => updateProductDescription(selectedProduct.id, 'name', e.target.value)}
                      placeholder="Zadajte názov produktu..."
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white"
                    />
                  </div>

                  {/* Čeština */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Čeština (CZ) - Originál</label>
                    
                    {/* Výber ikonky pre češtinu */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-600 mb-1">Ikonka:</label>
                      <div className="flex flex-wrap gap-2">
                        {availableIcons.map((icon) => (
                          <button
                            key={icon.emoji}
                            type="button"
                            onClick={() => updateProductDescription(selectedProduct.id, 'icon_cs', icon.emoji)}
                            className={`p-2 rounded-lg border-2 text-lg hover:scale-110 transition-transform ${
                              selectedProduct.icon_cs === icon.emoji 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            title={icon.name}
                          >
                            {icon.emoji}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => updateProductDescription(selectedProduct.id, 'icon_cs', '')}
                          className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-sm"
                          title="Bez ikonky"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                    
                    <textarea
                      value={selectedProduct.description_cs || ''}
                      onChange={(e) => updateProductDescription(selectedProduct.id, 'description_cs', e.target.value)}
                      placeholder="Napíšte originálny popis v češtine..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none text-gray-900 bg-white"
                    />
                  </div>

                  {/* Slovenčina */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Slovenčina (SK) - Originál</label>
                    
                    {/* Výber ikonky pre slovenčinu */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-600 mb-1">Ikonka:</label>
                      <div className="flex flex-wrap gap-2">
                        {availableIcons.map((icon) => (
                          <button
                            key={icon.emoji}
                            type="button"
                            onClick={() => updateProductDescription(selectedProduct.id, 'icon_sk', icon.emoji)}
                            className={`p-2 rounded-lg border-2 text-lg hover:scale-110 transition-transform ${
                              selectedProduct.icon_sk === icon.emoji 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            title={icon.name}
                          >
                            {icon.emoji}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => updateProductDescription(selectedProduct.id, 'icon_sk', '')}
                          className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-sm"
                          title="Bez ikonky"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                    
                    <textarea
                      value={selectedProduct.description_sk || ''}
                      onChange={(e) => updateProductDescription(selectedProduct.id, 'description_sk', e.target.value)}
                      placeholder="Napíšte originálny popis v slovenčine..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none text-gray-900 bg-white"
                    />
                  </div>

                  {/* Angličtina */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-900">Angličtina (EN) - Preklad</label>
                      <button
                        onClick={() => translateFromCzech('en')}
                        disabled={translating || !selectedProduct.description_cs}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded disabled:opacity-50"
                      >
                        {translating ? 'Prekladám...' : 'Preložiť z CZ'}
                      </button>
                    </div>
                    
                    {/* Výber ikonky pre angličtinu */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-600 mb-1">Ikonka:</label>
                      <div className="flex flex-wrap gap-2">
                        {availableIcons.map((icon) => (
                          <button
                            key={icon.emoji}
                            type="button"
                            onClick={() => updateProductDescription(selectedProduct.id, 'icon_en', icon.emoji)}
                            className={`p-2 rounded-lg border-2 text-lg hover:scale-110 transition-transform ${
                              selectedProduct.icon_en === icon.emoji 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            title={icon.name}
                          >
                            {icon.emoji}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => updateProductDescription(selectedProduct.id, 'icon_en', '')}
                          className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-sm"
                          title="Bez ikonky"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                    
                    <textarea
                      value={selectedProduct.description_en || ''}
                      onChange={(e) => updateProductDescription(selectedProduct.id, 'description_en', e.target.value)}
                      placeholder="Automatický preklad z češtiny alebo manuálna úprava..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none text-gray-900 bg-white"
                    />
                  </div>

                  {/* Nemčina */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-900">Nemčina (DE) - Preklad</label>
                      <button
                        onClick={() => translateFromCzech('de')}
                        disabled={translating || !selectedProduct.description_cs}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded disabled:opacity-50"
                      >
                        {translating ? 'Prekladám...' : 'Preložiť z CZ'}
                      </button>
                    </div>
                    
                    {/* Výber ikonky pre nemčinu */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-600 mb-1">Ikonka:</label>
                      <div className="flex flex-wrap gap-2">
                        {availableIcons.map((icon) => (
                          <button
                            key={icon.emoji}
                            type="button"
                            onClick={() => updateProductDescription(selectedProduct.id, 'icon_de', icon.emoji)}
                            className={`p-2 rounded-lg border-2 text-lg hover:scale-110 transition-transform ${
                              selectedProduct.icon_de === icon.emoji 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                            title={icon.name}
                          >
                            {icon.emoji}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => updateProductDescription(selectedProduct.id, 'icon_de', '')}
                          className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-sm"
                          title="Bez ikonky"
                        >
                          ❌
                        </button>
                      </div>
                    </div>
                    
                    <textarea
                      value={selectedProduct.description_de || ''}
                      onChange={(e) => updateProductDescription(selectedProduct.id, 'description_de', e.target.value)}
                      placeholder="Automatický preklad z češtiny alebo manuálna úprava..."
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none text-gray-900 bg-white"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => saveDescriptions(selectedProduct)}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
                    >
                      {saving ? 'Ukladám...' : 'Uložiť všetky popisky'}
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      Zrušiť
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Vyberte produkt z ľavého zoznamu pre úpravu popiskov
              </div>
            )}
          </div>
        </div>

        {/* Tipy */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tipy pre písanie popiskov:</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• CS a SK: Píšte originálne, jedinečné texty</li>
            <li>• EN a DE: Použite automatický preklad ako základ, potom upravte</li>
            <li>• Dĺžka: 50-150 slov je ideálna</li>
            <li>• Opíšte emócie, materiály a kvalitu</li>
            <li>• Pridajte call-to-action (napr. "Objednajte si teraz")</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

