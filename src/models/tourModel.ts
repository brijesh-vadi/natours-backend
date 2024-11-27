import { z } from 'zod';
import { Difficulty } from '../types';

export const tourSchema = z.object({
  name: z
    .string({
      required_error: 'Tour name is required.',
    })
    .min(5, {
      message: 'Tour name must be greater than 5 chars.',
    })
    .trim(),
  duration: z.number({
    required_error: 'Tour must have duration.',
  }),
  maxGroupSize: z.number({
    required_error: 'Tour must have group size.',
  }),
  difficulty: z.nativeEnum(Difficulty, {
    required_error: 'Tour must have difficulty of easy,medium or hard.',
  }),
  price: z
    .number({
      required_error: 'Price is required.',
    })
    .min(0, {
      message: 'Price must be greater than zero',
    }),
  ratingsAverage: z.number().min(0).max(5).default(4.5).optional(),
  ratingsQuantity: z.number().default(0).optional(),
  priceDiscount: z.number().optional(),
  summary: z
    .string({
      required_error: 'Tour must have summary',
    })
    .trim(),
  description: z
    .string({
      required_error: 'Tour must have description',
    })
    .trim(),
  imageCover: z.string({
    required_error: 'Tour must have cover image',
  }),
  images: z.array(z.string()).optional(),
  startDates: z.array(z.string()).optional(),
});

export type Tour = z.infer<typeof tourSchema>;
