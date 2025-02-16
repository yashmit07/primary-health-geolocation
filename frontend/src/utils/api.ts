import { SocialProgram, ProgramType } from '../types';

const API_BASE_URL = 'http://localhost:8080/api/programs';

export async function searchPrograms(
    address: string, 
    radiusMiles: number, 
    typeId?: number
): Promise<SocialProgram[]> {
    try {
        const params = new URLSearchParams({
            address: address,
            radiusMiles: radiusMiles.toString()
        });

        if (typeId !== undefined) {
            params.append('typeId', typeId.toString());
        }

        const response = await fetch(`${API_BASE_URL}/search?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch programs: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error searching programs:', error);
        throw error;
    }
}

export async function getProgramTypes(): Promise<ProgramType[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/types`);
        if (!response.ok) {
            throw new Error(`Failed to fetch program types: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching program types:', error);
        throw error;
    }
}