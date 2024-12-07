export interface PlantAnalysis {
  commonName: string;
  scientificName: string;
  confidence: number;
  characteristics: string[];
}

export interface IdentificationHistory {
  id: string;
  timestamp: number;
  imageUrl: string;
  analysis: PlantAnalysis;
}

export type UploadMethod = 'camera' | 'file';