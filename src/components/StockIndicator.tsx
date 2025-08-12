'use client';

import React from 'react';
import { FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi';

interface StockIndicatorProps {
  stockStatus: 'in_stock' | 'out_of_stock' | 'on_demand';
  className?: string;
}

const StockIndicator: React.FC<StockIndicatorProps> = ({ stockStatus, className = '' }) => {
  const getStatusConfig = () => {
    switch (stockStatus) {
      case 'in_stock':
        return {
          icon: FiCheckCircle,
          text: 'Skladem',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200'
        };
      case 'out_of_stock':
        return {
          icon: FiXCircle,
          text: 'Není skladem',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200'
        };
      case 'on_demand':
        return {
          icon: FiClock,
          text: 'Na objednávku',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          icon: FiClock,
          text: 'Na objednávku',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          borderColor: 'border-orange-200'
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
};

export default StockIndicator;
