'use client';

import React, { useState } from 'react';
import { PROGRAM_TYPES } from '../types';

interface SearchFormProps {
  onSearch: (address: string, programTypes: string[], radiusMiles: number) => void;
  isLoading?: boolean;
}

export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [address, setAddress] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [radius, setRadius] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(address, selectedTypes, radius);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      {/* Address Input */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          placeholder="Enter your address"
          required
          disabled={isLoading}
        />
      </div>

      {/* Program Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Program Types (Optional)
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {PROGRAM_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setSelectedTypes(prev => 
                  prev.includes(type) 
                    ? prev.filter(t => t !== type)
                    : [...prev, type]
                );
              }}
              className={`p-2 text-sm rounded border ${
                selectedTypes.includes(type)
                  ? 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Radius Input */}
      <div>
        <label htmlFor="radius" className="block text-sm font-medium text-gray-700">
          Search Radius (miles)
        </label>
        <input
          type="number"
          id="radius"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          min="1"
          max="50"
          className="mt-1 block w-32 rounded-md border border-gray-300 px-3 py-2"
          required
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {isLoading ? 'Searching...' : 'Search Programs'}
      </button>
    </form>
  );
}