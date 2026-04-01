import { Timestamp } from 'firebase/firestore';

export type Plan = 'free' | 'starter' | 'pro' | 'elite';
export type Role = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: Role;
  plan: Plan;
  subscriptionExpiresAt?: Timestamp;
  dailyScansCount: number;
  lastScanDate: string; // YYYY-MM-DD
  createdAt: Timestamp;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  ingredients: string[];
  instructions: string;
  nutrients?: {
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
  };
  time?: string;
  difficulty?: string;
  isFavorite: boolean;
  createdAt: Timestamp;
}

export interface InventoryItem {
  name: string;
  quantity?: string;
  expiryDate?: string;
}

export interface Inventory {
  userId: string;
  items: InventoryItem[];
  updatedAt: Timestamp;
}

export interface AppConfig {
  pricing: {
    starter: number;
    pro: number;
    elite: number;
  };
  aiPrompts: {
    recipeGeneration: string;
    ingredientDetection: string;
  };
  featureToggles: {
    adsEnabled: boolean;
    voiceAssistant: boolean;
  };
}

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 5,
  starter: 10,
  pro: 25,
  elite: 50,
};
