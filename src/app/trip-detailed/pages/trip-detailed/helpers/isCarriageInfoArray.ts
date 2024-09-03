import { CarriageInfo } from '@/app/shared/models/carriageInfo.model';

export const isCarriageInfoArray = (data: unknown): data is CarriageInfo[] =>
  Array.isArray(data) && data.every((item) => typeof item === 'object' && item !== null);
