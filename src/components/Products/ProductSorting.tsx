import { useState } from 'react';
import { motion } from 'framer-motion';

interface ProductSortingProps {
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

export function ProductSorting({ onSortChange }: ProductSortingProps) {
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSortChange = (newSortBy: string) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    onSortChange(newSortBy, newSortOrder);
  };

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'price', label: 'Price' },
    { value: 'createdAt', label: 'Newest' },
    { value: 'rating', label: 'Rating' },
  ];

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600">Sort by:</span>
      <div className="relative">
        <select
          value={`${sortBy}-${sortOrder}`}
          onChange={(e) => {
            const [field, order] = e.target.value.split('-');
            setSortBy(field);
            setSortOrder(order as 'asc' | 'desc');
            onSortChange(field, order as 'asc' | 'desc');
          }}
          className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-8 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={`${option.value}-asc`}>
              {option.label}: Low to High
            </option>
          ))}
          {sortOptions.map((option) => (
            <option key={`${option.value}-desc`} value={`${option.value}-desc`}>
              {option.label}: High to Low
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}