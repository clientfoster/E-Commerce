import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';

interface ProductFilterProps {
  onFilterChange: (filters: {
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    materials?: string[];
  }) => void;
}

export function ProductFilter({ onFilterChange }: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    sizes: [] as string[],
    colors: [] as string[],
    materials: [] as string[],
  });

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Convert to numbers for the callback
    const numericFilters: any = {
      minPrice: newFilters.minPrice ? parseFloat(newFilters.minPrice) : undefined,
      maxPrice: newFilters.maxPrice ? parseFloat(newFilters.maxPrice) : undefined,
      sizes: newFilters.sizes,
      colors: newFilters.colors,
      materials: newFilters.materials,
    };
    
    onFilterChange(numericFilters);
  };

  const handleCheckboxChange = (category: 'sizes' | 'colors' | 'materials', value: string) => {
    const currentValues = filters[category];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    
    const newFilters = { ...filters, [category]: newValues };
    setFilters(newFilters);
    
    // Convert to proper types for callback
    const typedFilters: any = {
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
      sizes: newFilters.sizes,
      colors: newFilters.colors,
      materials: newFilters.materials,
    };
    
    onFilterChange(typedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      minPrice: '',
      maxPrice: '',
      sizes: [],
      colors: [],
      materials: [],
    };
    setFilters(clearedFilters);
    
    // Convert to proper types for callback
    const typedFilters: any = {
      minPrice: undefined,
      maxPrice: undefined,
      sizes: [],
      colors: [],
      materials: [],
    };
    
    onFilterChange(typedFilters);
  };

  // Sample filter options (in a real app, these would come from the API)
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorOptions = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Red', hex: '#FF0000' },
  ];
  const materialOptions = ['Cotton', 'Polyester', 'Silk', 'Wool', 'Linen'];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          <span className="font-semibold text-gray-900">Filters</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-500"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-gray-200 px-4 pb-4 overflow-hidden"
        >
          <div className="space-y-6 pt-4">
            {/* Price Range */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Min</label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Max</label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                    placeholder="500"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Size</h3>
              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.sizes.includes(size)}
                      onChange={() => handleCheckboxChange('sizes', size)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Color</h3>
              <div className="grid grid-cols-2 gap-2">
                {colorOptions.map((color) => (
                  <label key={color.name} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.colors.includes(color.name)}
                      onChange={() => handleCheckboxChange('colors', color.name)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm text-gray-700">{color.name}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Material Filter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Material</h3>
              <div className="space-y-2">
                {materialOptions.map((material) => (
                  <label key={material} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.materials.includes(material)}
                      onChange={() => handleCheckboxChange('materials', material)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    <span className="text-sm text-gray-700">{material}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            {(filters.minPrice || filters.maxPrice || filters.sizes.length > 0 || filters.colors.length > 0 || filters.materials.length > 0) && (
              <button
                onClick={clearFilters}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}