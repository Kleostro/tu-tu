import { Carriage } from '@/app/api/models/carriage';

export const isCarriages = (data: unknown): data is Carriage[] =>
  Array.isArray(data) && data.every((item) => typeof item === 'string' && item !== null);
