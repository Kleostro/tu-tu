import { CurrentRide } from '@/app/shared/models/currentRide.model';

import { isCarriageInfoArray } from './isCarriageInfoArray';
import { isCarriages } from './isCarriages';
import { isStationInfoArray } from './isStationInfoArray';
import { isTrainCarriages } from './isTrainCarriages';

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
  'carriages' in data &&
  isCarriages(data['carriages']) &&
  'carriageInfo' in data &&
  isCarriageInfoArray(data['carriageInfo']) &&
  'stationsInfo' in data &&
  isStationInfoArray(data['stationsInfo']) &&
  'trainCarriages' in data &&
  isTrainCarriages(data['trainCarriages']);
