'use client';

import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import Map from '../components/Map';
import { searchPrograms } from '../utils/api';
import { SocialProgram } from '../types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState<SocialProgram[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  const handleSearch = async (address: string, programTypes: string[], radiusMiles: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const geocoder = new google.maps.Geocoder();
      const geocodeResult = await geocoder.geocode({ address });
      
      if (geocodeResult.results[0]?.geometry?.location) {
        const location = geocodeResult.results[0].geometry.location;
        setUserLocation({
          lat: location.lat(),
          lng: location.lng()
        });
        
        const foundPrograms = await searchPrograms(address, radiusMiles);
        setPrograms(foundPrograms);
      }
    } catch (err) {
      setError('An error occurred while searching. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Social Program Finder</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />

          {programs.length > 0 && (
            <div className="mt-4 bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="font-medium text-black">Found {programs.length} Programs</h2>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {programs.map((program) => (
                  <div 
                    key={program.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                      selectedProgram === program.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedProgram(program.id)}
                  >
                    <h3 className="font-medium text-black">{program.name}</h3>
                    <p className="text-sm text-gray-600">{program.programType}</p>
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
          )}
        </div>
        
        <div className="md:col-span-2">
          <Map 
            programs={programs} 
            userLocation={userLocation}
            selectedProgramId={selectedProgram}
            onProgramSelect={setSelectedProgram}
          />
        </div>
      </div>
    </main>
  );
}