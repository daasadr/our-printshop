'use client';

import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useDarkMode } from '@/context/DarkModeContext';

interface DarkModeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'switch';
}

export default function DarkModeToggle({ 
  className = '', 
  size = 'md', 
  variant = 'icon' 
}: DarkModeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-12 h-12 text-lg';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = 'flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'button':
        return `${baseClasses} bg-white dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600`;
      case 'switch':
        return `${baseClasses} bg-gray-200 dark:bg-gray-700 relative`;
      default:
        return `${baseClasses} bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800`;
    }
  };

  const handleToggle = () => {
    toggleDarkMode();
  };

  if (variant === 'switch') {
    return (
      <button
        onClick={handleToggle}
        className={`${getSizeClasses()} ${getVariantClasses()} ${className}`}
        aria-label={isDarkMode ? 'Prepnúť na svetlý režim' : 'Prepnúť na tmavý režim'}
      >
        <div className={`absolute inset-1 rounded-full transition-all duration-300 ${
          isDarkMode 
            ? 'bg-blue-600 translate-x-full' 
            : 'bg-gray-400 translate-x-0'
        }`} />
        <div className={`relative z-10 transition-all duration-300 ${
          isDarkMode ? 'text-white' : 'text-gray-600'
        }`}>
          {isDarkMode ? <FiMoon className="w-4 h-4" /> : <FiSun className="w-4 h-4" />}
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={`${getSizeClasses()} ${getVariantClasses()} ${className}`}
      aria-label={isDarkMode ? 'Prepnúť na svetlý režim' : 'Prepnúť na tmavý režim'}
    >
      <div className="relative">
        <FiSun 
          className={`absolute inset-0 transition-all duration-300 ${
            isDarkMode 
              ? 'opacity-0 rotate-90 scale-0' 
              : 'opacity-100 rotate-0 scale-100'
          }`} 
        />
        <FiMoon 
          className={`transition-all duration-300 ${
            isDarkMode 
              ? 'opacity-100 rotate-0 scale-100' 
              : 'opacity-0 -rotate-90 scale-0'
          }`} 
        />
      </div>
    </button>
  );
}

// Variant pre floating toggle
export function FloatingDarkModeToggle() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DarkModeToggle 
        size="lg" 
        variant="button"
        className="shadow-lg hover:shadow-xl transform hover:scale-110"
      />
    </div>
  );
}

// Variant pre header toggle
export function HeaderDarkModeToggle() {
  return (
    <DarkModeToggle 
      size="md" 
      variant="icon"
      className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
    />
  );
}
