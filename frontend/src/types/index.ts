export interface SocialProgram {
    id: number;
    name: string;
    programType: string;
    address: string;
    latitude: number;
    longitude: number;
  }
  
  export const PROGRAM_TYPES = ['All Programs', 'Food', 'Housing', 'Childcare', 'Transportation', 'Disability'] as const;