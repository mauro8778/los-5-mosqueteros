export interface Pet {
  id: string;
  name: string;
  species: 'DOG' | 'CAT' | 'OTHER';
  breed?: string;
  ageMonths?: number;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  gender: string;
  description: string;
  photos: string[];
  status: 'AVAILABLE' | 'PENDING_ADOPTION' | 'ADOPTED' | 'LOST' | 'FOUND';
  isVaccinated: boolean;
  isNeutered: boolean;
  energyLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  targetAmount: number;
  raisedAmount: number;
  imageUrl?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'SHELTER_VOLUNTEER' | 'VET' | 'ADOPTER';
  phone?: string;
}

export interface AiEvaluationResult {
  score: number;
  analysis: string;
  isRecommended: boolean;
}
