import React, { useState, useEffect, useRef } from 'react';
import { PROGRAM_TYPES } from '../types';

interface SearchFormProps {
  onSearch: (address: string, programTypes: string[], radiusMiles: number) => void;
  isLoading?: boolean;
}

export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [address, setAddress] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [radius, setRadius] = useState(5);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'geometry'],
      types: ['address']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) {
        setAddress(place.formatted_address);
        setIsAddressSelected(true);
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddressSelected) {
      onSearch(address, selectedTypes, radius);
    }
  };

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setIsAddressSelected(false); // Reset the selection flag when user types
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      {/* Address Input */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id="address"
            value={address}
            onChange={handleAddressInput}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm"
            placeholder="Search and select an address"
            required
            disabled={isLoading}
          />
          {!isAddressSelected && address && (
            <div className="absolute inset-x-0 bottom-0 transform translate-y-full bg-yellow-50 border border-yellow-200 rounded-md p-2 text-sm text-yellow-700 mt-1">
              Please select an address from the suggestions
            </div>
          )}
        </div>
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

      {/* Radius Slider */}
      <div>
        <div className="flex justify-between items-center">
          <label htmlFor="radius" className="block text-sm font-medium text-gray-700">
            Search Radius
          </label>
          <span className="text-sm text-gray-600">{radius} miles</span>
        </div>
        <input
          type="range"
          id="radius"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          min="1"
          max="5000"
          step="1"
          className="mt-2 w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isAddressSelected}
        className={`w-full py-2 px-4 rounded-md text-white ${
          isLoading || !isAddressSelected 
            ? 'bg-blue-300 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Searching...' : 'Search Programs'}
      </button>
    </form>
  );
}