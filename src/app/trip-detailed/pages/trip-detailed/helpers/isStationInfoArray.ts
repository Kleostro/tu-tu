import { StationInfo } from '@/app/shared/models/stationInfo.model';

export const isStationInfoArray = (data: unknown): data is StationInfo[] =>
  Array.isArray(data) && data.every((item) => typeof item === 'object' && item !== null);
