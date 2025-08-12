import React from 'react';
import { FiPackage, FiXCircle, FiClock } from 'react-icons/fi';

export type StockStatus = 'in_stock' | 'out_of_stock' | 'on_demand';

interface StockIndicatorProps {
  stockStatus: StockStatus;
  className?: string;
}

export default function StockIndicator({ stockStatus, className = '' }: StockIndicatorProps) {
  const getStatusConfig = () => {
    switch (stockStatus) {
      case 'in_stock':
        return {
          text: 'Na sklade',
          icon: FiPackage,
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'out_of_stock':
        return {
          text: 'Nedostupné',
          icon: FiXCircle,
          color: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'on_demand':
        return {
          text: 'Na objednávku',
          icon: FiClock,
          color: 'text-blue-700',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          text: 'Neznámy stav',
          icon: FiPackage,
          color: 'text-gray-700',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.borderColor} ${config.color} ${className}`}>
      <IconComponent className="w-4 h-4" />
      <span>{config.text}</span>
    </div>
  );
}
