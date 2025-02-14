import { SocialProgram } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/programs';

export async function searchPrograms(
  address: string, 
  radiusMiles: number, 
  programType?: string
): Promise<SocialProgram[]> {
  try {
    const params = new URLSearchParams({
      address: address,
      radiusMiles: radiusMiles.toString()
    });

    if(programType){
      params.append('programType', programType.toUpperCase());
    }

    const url = `${API_BASE_URL}/search?${params}`;
    console.log('API Request URL:', url);

    const response = await fetch(`${API_BASE_URL}/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch programs: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response:', data);  // Add this log too

    return data;
  } catch (error) {
    console.error('Error searching programs:', error);
    throw error;
  }
}