'use client';

import React from 'react';
import { FiTruck, FiClock, FiGlobe, FiPackage } from 'react-icons/fi';

interface ShippingInfoSectionProps {
  dictionary: any;
  lang: string;
}

// Funkcia na zobrazenie ceny v oboch menách pre českú verziu
const formatPrice = (eurPrice: string, lang: string) => {
  if (lang === 'cs') {
    // Konverzia EUR na CZK (približne 25 CZK za 1 EUR)
    const eurValue = parseFloat(eurPrice.replace('€', '').trim());
    const czkValue = Math.round(eurValue * 25);
    return `${eurPrice} (${czkValue} Kč)`;
  }
  return eurPrice;
};

const ShippingInfoSection: React.FC<ShippingInfoSectionProps> = ({ dictionary, lang }) => {
  const shipping = dictionary.shipping;

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {shipping.title}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {shipping.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Printful Production */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-8 border border-gray-100">
            <div className="flex items-center mb-4 lg:mb-6">
              <div className="bg-blue-100 p-3 rounded-lg mr-4">
                <FiPackage className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {shipping.printful_production.title}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 lg:mb-6 leading-relaxed">
              {shipping.printful_production.description}
            </p>
            <div className="flex items-center text-blue-600 font-medium bg-blue-50 px-3 py-2 rounded-lg">
              <FiClock className="w-4 h-4 mr-2" />
              <span className="text-sm sm:text-base">{shipping.printful_production.days}</span>
            </div>
          </div>

          {/* Local Shipping - Packeta */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-8 border border-gray-100">
            <div className="flex items-center mb-4 lg:mb-6">
              <div className="bg-green-100 p-3 rounded-lg mr-4">
                <FiTruck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {shipping.local_shipping.packeta.name}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 lg:mb-6 leading-relaxed">
              {shipping.local_shipping.packeta.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg">
                <FiClock className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">{shipping.local_shipping.packeta.days}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatPrice(shipping.local_shipping.packeta.price, lang)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {shipping.local_shipping.packeta.regions}
                </span>
              </div>
            </div>
          </div>

          {/* Worldwide Shipping - DHL */}
          <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-8 border border-gray-100 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4 lg:mb-6">
              <div className="bg-red-100 p-3 rounded-lg mr-4">
                <FiGlobe className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {shipping.worldwide_shipping.dhl.name}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mb-4 lg:mb-6 leading-relaxed">
              {shipping.worldwide_shipping.dhl.description}
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-red-600 font-medium bg-red-50 px-3 py-2 rounded-lg">
                <FiClock className="w-4 h-4 mr-2" />
                <span className="text-sm sm:text-base">{shipping.worldwide_shipping.dhl.days}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatPrice(shipping.worldwide_shipping.dhl.price, lang)}
                </span>
                <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {shipping.worldwide_shipping.dhl.regions}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Total Delivery Time */}
        <div className="mt-12 lg:mt-16 bg-white rounded-xl shadow-lg p-6 lg:p-8 border border-gray-100">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-6">
              {shipping.total_delivery_time.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 lg:mb-8 max-w-2xl mx-auto">
              {shipping.total_delivery_time.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 lg:p-6 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">CZ/SK</h4>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
                  {shipping.total_delivery_time.cz_sk}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 lg:p-6 border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2 text-sm sm:text-base">Worldwide</h4>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600">
                  {shipping.total_delivery_time.worldwide}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tracking Info */}
        <div className="mt-8 lg:mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl px-6 py-4 lg:px-8 lg:py-6 border border-blue-200 shadow-md">
            <div className="bg-blue-200 p-2 rounded-lg mb-3 sm:mb-0 sm:mr-4">
              <FiPackage className="w-5 h-5 text-blue-700" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="font-semibold text-blue-900 text-sm sm:text-base mb-1">
                {shipping.tracking.title}
              </h4>
              <p className="text-xs sm:text-sm text-blue-700 max-w-sm">
                {shipping.tracking.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingInfoSection;
