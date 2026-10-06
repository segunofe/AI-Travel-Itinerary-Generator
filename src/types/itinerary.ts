export interface Activity {
  id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  title: string;
  category: string;
  description: string;
  duration: string;
  estimatedCost: 'Free' | '$' | '$$' | '$$$';
  recommendedFood?: string;
  insiderTip?: string;
}

export interface DayPlan {
  dayNumber: number;
  title: string;
  theme: string;
  neighborhoods: string[];
  activities: Activity[];
}

export interface Itinerary {
  id?: string;
  cityName: string;
  country: string;
  tagline: string;
  overview: string;
  bestSeason: string;
  localCurrency: string;
  language: string;
  transitTip: string;
  days: DayPlan[];
  curatedTips: string[];
  packingHighlights: string[];
  preferences?: {
    style: string;
    pace: string;
    companion: string;
  };
  generatedAt?: string;
}

export interface GenerationRequest {
  city: string;
  style?: string;
  pace?: string;
  companion?: string;
}
