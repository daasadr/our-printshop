const ProductSkeleton = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        {/* Obrázek produktu */}
        <div className="rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 h-[500px] relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
        {/* Obrázek produktu */}
        <div className="rounded-lg overflow-hidden bg-gray-200 h-[500px]"></div>
        
        <div>
          {/* Název produktu */}
          <div className="h-10 bg-gray-200 rounded-md mb-3 w-3/4"></div>
          
          {/* Popis produktu */}
          <div className="h-24 bg-gray-200 rounded-md mb-6"></div>
          
          {/* Barvy */}
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded-md mb-2 w-24"></div>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-gray-300"></div>
              ))}
            </div>
          </div>
          
          {/* Velikosti */}
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded-md mb-2 w-24"></div>
            <div className="flex gap-2">
              {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                <div key={size} className="h-10 w-12 bg-gray-300 rounded-md"></div>
              ))}
            </div>
          </div>
          
          {/* Množství */}
          <div className="mb-6">
            <div className="h-6 bg-gray-200 rounded-md mb-2 w-24"></div>
            <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
          </div>
          
          {/* Cena a tlačítko */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-8 bg-gray-200 rounded-md w-32"></div>
            <div className="h-12 bg-gray-300 rounded-md w-40"></div>
          </div>
          
          {/* Detaily produktu */}
          <div className="border-t border-gray-200 pt-6">
            <div className="h-6 bg-gray-200 rounded-md mb-2 w-40"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-4 bg-gray-200 rounded-md w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ProductSkeleton;