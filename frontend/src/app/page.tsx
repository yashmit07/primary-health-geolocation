'use client';

import { useState, useCallback } from 'react';
import SearchForm from '../components/SearchForm';
import Map from '../components/Map';
import { searchPrograms } from '../utils/api';
import { SocialProgram } from '../types';

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.0060 }; // NYC coordinates

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState<SocialProgram[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  const handleSearch = useCallback(async (address: string, typeId: number | null, radiusMiles: number) => {
    setIsLoading(true);
    setError(null);
    setPrograms([]);
    
    try {
      const geocoder = new google.maps.Geocoder();
      const geocodeResult = await geocoder.geocode({ address });
      const location = geocodeResult.results[0]?.geometry?.location;
      
      if (!location) {
        throw new Error('Could not find the specified address');
      }

      setUserLocation({
        lat: location.lat(),
        lng: location.lng()
      });
      
      const foundPrograms = await searchPrograms(address, radiusMiles, typeId || undefined);

      if (foundPrograms.length === 0) {
        const typeMsg = typeId ? ' of the selected type' : '';
        setError(`No programs${typeMsg} found within ${radiusMiles} miles of your location. Try increasing the search radius or modifying your search criteria.`);
      }
      
      setPrograms(foundPrograms);
    } catch (err) {
      setError(
        err instanceof Error 
          ? err.message 
          : 'An error occurred while searching. Please try again.'
      );
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-black">Social Program Finder</h1>
      
      <SearchForm onSearch={handleSearch} isLoading={isLoading} />

      {error && (
        <div role="alert" className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 h-[600px]">
          <Map 
            programs={programs} 
            userLocation={userLocation}
            selectedProgramId={selectedProgram}
            onProgramSelect={setSelectedProgram}
          />
        </div>

        <div className="lg:col-span-2">
          {programs.length > 0 && (
            <ResultsList 
              programs={programs}
              selectedId={selectedProgram}
              onSelect={setSelectedProgram}
            />
          )}
        </div>
      </div>
    </main>
  );
}

interface ResultsListProps {
  programs: SocialProgram[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

function ResultsList({ programs, selectedId, onSelect }: ResultsListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-medium text-black">Found {programs.length} Programs</h2>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {programs.map((program) => (
          <div 
            key={program.id}
            className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
              selectedId === program.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onSelect(program.id)}
          >
            <h3 className="font-medium text-black">{program.name}</h3>
            <p className="text-sm text-gray-600">
              {program.types?.length > 0 
                ? program.types.join(', ')
                : 'No types specified'
              }
            </p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(program.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline mt-1 block"
              onClick={(e) => e.stopPropagation()}
            >
              {program.address}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}