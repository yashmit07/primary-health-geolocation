import { SocialProgram } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/programs';

export async function searchPrograms(
  address: string, 
  radiusMiles: number, 
  programTypes?: string[]
): Promise<SocialProgram[]> {
  try {
    const params = new URLSearchParams({
      address: address,
      radiusMiles: radiusMiles.toString()
    });

    const response = await fetch(`${API_BASE_URL}/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch programs: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error searching programs:', error);
    throw error;
  }
}