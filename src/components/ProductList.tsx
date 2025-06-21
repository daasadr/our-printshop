"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { formatPriceByLocale, detectUserCountry } from '@/utils/currency';

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  currency: string;
  shippingPrice: {
    min: number;
    max: number;
  };
  printfulId: string;
}

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Detekcia krajiny
    detectUserCountry().then(setCountry);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Zostav URL s query parametrami
        const params = new URLSearchParams();
        const priceMin = searchParams.get('price_min');
        const priceMax = searchParams.get('price_max');
        const name = searchParams.get('name');
        
        if (priceMin) params.set('price_min', priceMin);
        if (priceMax) params.set('price_max', priceMax);
        if (name) params.set('name', name);

        const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Žiadne produkty nevyhovujú zadaným filtrom');
          } else {
            setError('Chyba pri načítaní produktov');
          }
          setProducts([]);
          return;
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Chyba pri načítaní produktov');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Skúsiť znova
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenašli sa žiadne produkty</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div key={product.id} className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden transition-transform hover:scale-105">
          <div className="relative aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
            <p className="text-green-200 font-medium">
              {product.price ? formatPriceByLocale(product.price, 'cs', country || undefined) : 'Cena na vyžiadanie'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}