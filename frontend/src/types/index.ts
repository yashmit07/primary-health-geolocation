export interface SocialProgram {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  types: string[];  // Array of type names
}

export interface ProgramType {
  typeId: number;
  typeName: string;
}