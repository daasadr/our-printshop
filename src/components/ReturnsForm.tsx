'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiCamera, FiFileText, FiUser, FiMail, FiPhone } from 'react-icons/fi';

interface ReturnsFormProps {
  dictionary: any;
  lang: string;
  onClose: () => void;
}

const ReturnsForm: React.FC<ReturnsFormProps> = ({ dictionary, lang, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderNumber: '',
    deliveryDate: '',
    productName: '',
    problemType: '',
    description: '',
    photos: [] as File[]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const problemTypes = [
    { value: 'printing_error', label: dictionary?.returns_form?.problem_types?.printing_error || 'Tlačová chyba' },
    { value: 'wrong_size', label: dictionary?.returns_form?.problem_types?.wrong_size || 'Nesprávna veľkosť' },
    { value: 'damaged', label: dictionary?.returns_form?.problem_types?.damaged || 'Poškodený produkt' },
    { value: 'wrong_product', label: dictionary?.returns_form?.problem_types?.wrong_product || 'Nesprávny produkt' },
    { value: 'quality_issue', label: dictionary?.returns_form?.problem_types?.quality_issue || 'Problém s kvalitou' },
    { value: 'other', label: dictionary?.returns_form?.problem_types?.other || 'Iné' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.photos.length <= 5) {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...files]
      }));
    } else {
      alert(dictionary?.returns_form?.max_photos_alert || 'Môžete nahrať maximálne 5 fotografií');
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Tu by sa odoslal formulár na server
      // Pre demo len simulujeme odoslanie
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✅</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {dictionary?.returns_form?.success_title || 'Reklamácia odoslaná!'}
          </h3>
          <p className="text-gray-600">
            {dictionary?.returns_form?.success_message || 'Ďakujeme za vašu reklamáciu. Budeme vás kontaktovať do 24 hodín.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            📝 {dictionary?.returns_form?.title || 'Reklamačný formulár'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiUser className="w-5 h-5 mr-2" />
              {dictionary?.returns_form?.personal_info || 'Osobné údaje'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dictionary?.returns_form?.name || 'Meno a priezvisko'} *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dictionary?.returns_form?.email || 'Email'} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary?.returns_form?.phone || 'Telefón'}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Order Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiFileText className="w-5 h-5 mr-2" />
              {dictionary?.returns_form?.order_info || 'Informácie o objednávke'}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dictionary?.returns_form?.order_number || 'Číslo objednávky'} *
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {dictionary?.returns_form?.delivery_date || 'Dátum doručenia'} *
                </label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary?.returns_form?.product_name || 'Názov produktu'} *
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Problem Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              🔍 {dictionary?.returns_form?.problem_info || 'Informácie o probléme'}
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary?.returns_form?.problem_type || 'Typ problému'} *
              </label>
              <select
                name="problemType"
                value={formData.problemType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{dictionary?.returns_form?.select_problem || 'Vyberte typ problému'}</option>
                {problemTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {dictionary?.returns_form?.description || 'Popis problému'} *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder={dictionary?.returns_form?.description_placeholder || "Podrobne popíšte problém s produktom..."}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <FiCamera className="w-5 h-5 mr-2" />
              {dictionary?.returns_form?.photo_upload || 'Fotografie problému'}
            </h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-2">
                {dictionary?.returns_form?.max_photos || 'Nahrajte fotografie problému (max. 5 fotografií)'}
              </p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label
                htmlFor="photo-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                {dictionary?.returns_form?.select_photos || 'Vybrať fotografie'}
              </label>
            </div>

            {/* Photo Preview */}
            {formData.photos.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(photo)}
                      alt={`Photo ${index + 1}`}
                      width={96}
                      height={96}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {dictionary?.returns_form?.cancel || 'Zrušiť'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (dictionary?.returns_form?.submitting || 'Odosielam...') : (dictionary?.returns_form?.submit || 'Odoslať reklamáciu')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnsForm;
