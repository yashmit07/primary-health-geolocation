'use client';

import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import Map from '../components/Map';
import { searchPrograms } from '../utils/api';
import { SocialProgram } from '../types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [programs, setPrograms] = useState<SocialProgram[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (address: string, programTypes: string[], radiusMiles: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const foundPrograms = await searchPrograms(address, radiusMiles);
      setPrograms(foundPrograms);
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
            <div className="mt-4 p-4 bg-white rounded-lg shadow">
              <h2 className="font-medium">Found {programs.length} Programs</h2>
            </div>
          )}
        </div>
        
        <div className="md:col-span-2">
          <Map programs={programs} />
        </div>
      </div>
    </main>
  );
}