import { CarriageInfo } from '@/app/home/models/carriageInfo.model';
import { CurrentRide } from '@/app/home/models/currentRide.model';
import { StationInfo } from '@/app/home/models/stationInfo.model';

const isCarriageInfoArray = (data: unknown): data is CarriageInfo[] =>
  Array.isArray(data) && data.every((item) => typeof item === 'object' && item !== null);

const isStationInfoArray = (data: unknown): data is StationInfo[] =>
  Array.isArray(data) && data.every((item) => typeof item === 'object' && item !== null);

export const isCurrentRide = (data: unknown): data is CurrentRide =>
  typeof data === 'object' &&
  data !== null &&
  'rideId' in data &&
  typeof data['rideId'] === 'number' &&
  'routeId' in data &&
  typeof data['routeId'] === 'number' &&
  'routeStartStation' in data &&
  typeof data['routeStartStation'] === 'string' &&
  'routeEndStation' in data &&
  typeof data['routeEndStation'] === 'string' &&
  'tripStartStation' in data &&
  typeof data['tripStartStation'] === 'string' &&
  'tripEndStation' in data &&
  typeof data['tripEndStation'] === 'string' &&
  'routeStartStationId' in data &&
  typeof data['routeStartStationId'] === 'number' &&
  'routeEndStationId' in data &&
  typeof data['routeEndStationId'] === 'number' &&
  'tripStartStationId' in data &&
  typeof data['tripStartStationId'] === 'number' &&
  'tripEndStationId' in data &&
  typeof data['tripEndStationId'] === 'number' &&
  'tripDepartureDate' in data &&
  typeof data['tripDepartureDate'] === 'string' &&
  'tripArrivalDate' in data &&
  typeof data['tripArrivalDate'] === 'string' &&
  'carriageInfo' in data &&
  isCarriageInfoArray(data['carriageInfo']) &&
  'stationsInfo' in data &&
  isStationInfoArray(data['stationsInfo']);
