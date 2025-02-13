export interface SocialProgram {
    id: number;
    name: string;
    programType: string;
    address: string;
    latitude: number;
    longitude: number;
  }
  
  export const PROGRAM_TYPES = ['Food', 'Housing', 'Childcare', 'Transportation', 'Disability'] as const;