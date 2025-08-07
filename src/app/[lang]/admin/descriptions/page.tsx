'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';

// Dynamicky importujeme RichTextEditor aby sa načítal len na klientovi
// const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), {
//   ssr: false,
//   loading: () => <div className="w-full h-32 p-3 border border-gray-300 rounded-lg bg-gray-50 animate-pulse">Načítavam editor...</div>
// });

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

export default function AdminDescriptionsPage() {
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
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data || []); // Všetky produkty
      setFilteredProducts(data || []); // Inicializuj filtrované produkty
    } catch (error) {
      console.error('Chyba pri načítaní produktov:', error);
      setProducts([]);
      setFilteredProducts([]);
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-black mb-8">Správa popiskov produktov</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ľavý panel - Zoznam produktov */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-black mb-4">Produkty ({filteredProducts.length})</h2>
            
            {/* Vyhľadávací panel */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Hľadať podľa názvu alebo ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                style={{ color: '#000' }}
              />
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${
                    selectedProduct?.id === product.id ? 'border-blue-500 shadow-md' : 'border-gray-200'
                  }`}
                >
                  <div className="font-medium text-black">{product.name}</div>
                  <div className="text-sm text-gray-700">ID: {product.id}</div>
                  
                  {/* Emoji náhľad */}
                  <div className="text-sm mt-1">
                    {product.icon_cs && <span className="mr-1 text-lg" title="CZ ikonka" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>{product.icon_cs}</span>}
                    {product.icon_sk && <span className="mr-1 text-lg" title="SK ikonka" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>{product.icon_sk}</span>}
                    {product.icon_en && <span className="mr-1 text-lg" title="EN ikonka" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>{product.icon_en}</span>}
                    {product.icon_de && <span className="mr-1 text-lg" title="DE ikonka" style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}>{product.icon_de}</span>}
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

          {/* Pravý panel - Editor */}
          <div className="lg:col-span-2">
            {selectedProduct ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-black mb-6">
                  Upraviť popisky: {selectedProduct.name}
                </h2>

                <div className="space-y-6">
                  {/* Názov produktu */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Názov produktu</label>
                    <input
                      type="text"
                      value={selectedProduct.name || ''}
                      onChange={(e) => updateProductDescription(selectedProduct.id, 'name', e.target.value)}
                      placeholder="Zadajte názov produktu..."
                      className="w-full p-3 border border-gray-300 rounded-lg text-black bg-white"
                      style={{ color: '#000' }}
                    />
                  </div>

                  {/* Čeština */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Čeština (CZ) - Originál</label>
                    
                    {/* Výber ikonky pre češtinu */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-800 mb-1">Ikonka:</label>
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
                            style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
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
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none text-black bg-white"
                      style={{ color: '#000' }}
                    />
                  </div>

                  {/* Slovenčina */}
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Slovenčina (SK) - Originál</label>
                    

                    
                    {/* Výber ikonky pre slovenčinu */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-800 mb-1">Ikonka:</label>
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
                            style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
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
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none text-black bg-white"
                      style={{ color: '#000' }}
                    />
                  </div>

                  {/* Angličtina */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-black">Angličtina (EN) - Preklad</label>
                      <Button
                        onClick={() => translateFromCzech('en')}
                        disabled={translating || !selectedProduct.description_cs}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded"
                      >
                        {translating ? 'Prekladám...' : 'Preložiť z CZ'}
                      </Button>
                    </div>
                    

                    
                    {/* Výber ikonky pre angličtinu */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-800 mb-1">Ikonka:</label>
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
                            style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
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
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none text-black bg-white"
                      style={{ color: '#000' }}
                    />
                  </div>

                  {/* Nemčina */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-black">Nemčina (DE) - Preklad</label>
                      <Button
                        onClick={() => translateFromCzech('de')}
                        disabled={translating || !selectedProduct.description_cs}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-sm rounded"
                      >
                        {translating ? 'Prekladám...' : 'Preložiť z CZ'}
                      </Button>
                    </div>
                    

                    
                    {/* Výber ikonky pre nemčinu */}
                    <div className="mb-3">
                      <label className="block text-xs text-gray-800 mb-1">Ikonka:</label>
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
                            style={{ fontFamily: 'Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif' }}
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
                      className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none text-black bg-white"
                      style={{ color: '#000' }}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      onClick={() => saveDescriptions(selectedProduct)}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
                    >
                      {saving ? 'Ukladám...' : 'Uložiť všetky popisky'}
                    </Button>
                    <Button
                      onClick={() => setSelectedProduct(null)}
                      variant="outline"
                      className="px-6 py-2 rounded-lg border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                    >
                      Zrušiť
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
                Vyberte produkt z ľavého zoznamu pre úpravu popiskov
              </div>
            )}
          </div>
        </div>

        {/* Tipy */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
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
    </div>
  );
} 