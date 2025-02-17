import React, { useState, useEffect, useRef } from 'react';
import { ProgramType } from '@/types';
import { getProgramTypes } from '@/utils/api';

interface SearchFormProps {
    onSearch: (address: string, typeId: number | null, radiusMiles: number) => void;
    isLoading?: boolean;
}

const RADIUS_OPTIONS = [
    { value: 1, label: '1 mile' },
    { value: 5, label: '5 miles' },
    { value: 10, label: '10 miles' },
    { value: 20, label: '20 miles' }
] as const;

export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
    const [address, setAddress] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
    const [programTypes, setProgramTypes] = useState<ProgramType[]>([]);
    const [radius, setRadius] = useState(5);
    const [isAddressSelected, setIsAddressSelected] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    useEffect(() => {
        getProgramTypes().then(setProgramTypes).catch(console.error);
    }, []);

    useEffect(() => {
        if (!inputRef.current || !window.google) return;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
            componentRestrictions: { country: 'us' },
            fields: ['formatted_address'],
            types: ['address']
        });

        const listener = autocompleteRef.current.addListener('place_changed', () => {
            const place = autocompleteRef.current?.getPlace();
            if (place?.formatted_address) {
                setAddress(place.formatted_address);
                setIsAddressSelected(true);
            }
        });

        return () => {
            if (listener) {
                google.maps.event.removeListener(listener);
            }
            if (autocompleteRef.current) {
                google.maps.event.clearInstanceListeners(autocompleteRef.current);
            }
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAddressSelected) {
            onSearch(address, selectedTypeId, radius);
        }
    };

    const handleAddressInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
        setIsAddressSelected(false);
    };

    const inputStyles = "w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-black";
    const labelStyles = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg shadow">
            <div className="md:col-span-2">
                <label htmlFor="address" className={labelStyles}>
                    Address
                </label>
                <input
                    ref={inputRef}
                    type="text"
                    id="address"
                    value={address}
                    onChange={handleAddressInput}
                    className={inputStyles}
                    placeholder="Search and select an address"
                    required
                    disabled={isLoading}
                />
                {!isAddressSelected && address && (
                    <p className="mt-1 text-sm text-gray-500">
                        Please select an address from the suggestions
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="programType" className={labelStyles}>
                    Program Type
                </label>
                <select
                    id="programType"
                    value={selectedTypeId ?? ''}
                    onChange={(e) => setSelectedTypeId(e.target.value ? Number(e.target.value) : null)}
                    className={inputStyles}
                    disabled={isLoading}
                >
                    <option value="">All Programs</option>
                    {programTypes.map((type) => (
                        <option key={type.typeId} value={type.typeId}>
                            {type.typeName}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="radius" className={labelStyles}>
                    Search Radius
                </label>
                <div className="flex gap-2">
                    <select
                        id="radius"
                        value={radius}
                        onChange={(e) => setRadius(Number(e.target.value))}
                        className={inputStyles}
                        disabled={isLoading}
                    >
                        {RADIUS_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                    
                    <button
                        type="submit"
                        disabled={isLoading || !isAddressSelected}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
        </form>
    );
}