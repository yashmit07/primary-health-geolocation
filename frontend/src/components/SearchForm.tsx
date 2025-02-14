import React, { useState, useEffect, useRef } from 'react';
import { PROGRAM_TYPES } from '../types';
import styles from './SearchForm.module.scss';

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
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddressSelected) {
      onSearch(address, selectedTypes, radius);
    }
  };

  const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    setIsAddressSelected(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {/* Address Input */}
      <div>
        <label htmlFor="address" className={styles.inputLabel}>
          Address
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id="address"
            value={address}
            onChange={handleAddressInput}
            className={styles.inputField}
            placeholder="Search and select an address"
            required
            disabled={isLoading}
          />
          {!isAddressSelected && address && (
            <div className={styles.validationMessage}>
              Please select an address from the suggestions
            </div>
          )}
        </div>
      </div>

      {/* Program Types */}
      <div>
        <label className={styles.inputLabel}>
          Program Types (Optional)
        </label>
        <div className={styles.programTypesGrid}>
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
              className={`${styles.programTypeButton} ${
                selectedTypes.includes(type) 
                  ? styles.selected 
                  : styles.unselected
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Radius Slider */}
      <div>
        <div className={styles.radiusContainer}>
          <label htmlFor="radius" className={styles.inputLabel}>
            Search Radius
          </label>
          <span className={styles.radiusValue}>{radius} miles</span>
        </div>
        <input
          type="range"
          id="radius"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          min="1"
          max="25"
          step="1"
          className={styles.radiusSlider}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !isAddressSelected}
        className={`${styles.submitButton} ${
          isLoading || !isAddressSelected 
            ? styles.disabled 
            : styles.enabled
        }`}
      >
        {isLoading ? 'Searching...' : 'Search Programs'}
      </button>
    </form>
  );
}