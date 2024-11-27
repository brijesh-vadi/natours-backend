export enum Difficulty {
  Easy = 'easy',
  Medium = 'medium',
  Hard = 'hard',
}

export interface Tour {
  id?: number;
  name: string;
  duration: number;
  maxGroupSize: number;
  difficulty: Difficulty;
  price: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  priceDiscount?: number;
  summary: string;
  description: string;
  imageCover: string;
  images: string[];
  startDates: string[];
  created_at?: string;
  updated_at?: string;
}
