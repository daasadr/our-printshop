import Image from 'next/image';
import Link from 'next/link';
import { FormattedProduct } from '@/types/prisma';
import { formatPriceByLocale, convertEurToCzkSync, convertEurToGbpSync, detectUserCountry } from '@/utils/currency';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.variants[0]?.price || 0;
  const { locale = 'cs' } = useRouter();
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    detectUserCountry().then(setCountry);
  }, []);

  const previewUrl =
    product.designs[0]?.previewUrl && product.designs[0]?.previewUrl.startsWith('http')
      ? product.designs[0].previewUrl
      : product.image || '/placeholder.jpg';
  
  return (
    <Link href={`/products/${product.id}`} className="group">
      <div className="bg-white/5 backdrop-blur-md rounded-lg overflow-hidden transition-transform hover:scale-105">
        <div className="relative aspect-square">
          <Image
            src={getProductImages(product).main}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-white mb-2">{product.name}</h3>
          <p className="text-green-200 font-medium">
            {formatPriceByLocale(price, locale, country || undefined)}
          </p>
        </div>
      </div>
    </Link>
  );
} 