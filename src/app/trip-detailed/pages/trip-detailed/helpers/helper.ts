import { Carriage } from '@/app/api/models/carriage';
import { CarriageInfo } from '@/app/home/models/carriageInfo.model';
import { CurrentRide } from '@/app/home/models/currentRide.model';
import { StationInfo } from '@/app/home/models/stationInfo.model';
import { TrainCarriage } from '@/app/home/models/trainCarriage';
import { TrainCarriages } from '@/app/home/models/trainCarriages';

const isCarriageInfoArray = (data: unknown): data is CarriageInfo[] =>
  Array.isArray(data) && data.every((item) => typeof item === 'object' && item !== null);

const isStationInfoArray = (data: unknown): data is StationInfo[] =>
  Array.isArray(data) && data.every((item) => typeof item === 'object' && item !== null);

const isCarriages = (data: unknown): data is Carriage[] =>
  Array.isArray(data) && data.every((item) => typeof item === 'string' && item !== null);

const isCarriage = (item: unknown): item is TrainCarriage => {
  if (typeof item !== 'object' || item === null) {
    return false;
  }

  const obj = item;

  return (
    'carriageTypeCode' in obj &&
    typeof obj['carriageTypeCode'] === 'string' &&
    'carriageName' in obj &&
    typeof obj['carriageName'] === 'string' &&
    'carriageOrder' in obj &&
    typeof obj['carriageOrder'] === 'number' &&
    'firstSeat' in obj &&
    typeof obj['firstSeat'] === 'number' &&
    'lastSeat' in obj &&
    typeof obj['lastSeat'] === 'number' &&
    'totalSeats' in obj &&
    typeof obj['totalSeats'] === 'number' &&
    'occupiedSeats' in obj &&
    Array.isArray(obj['occupiedSeats']) &&
    obj['occupiedSeats'].every((seat) => typeof seat === 'number') &&
    'freeSeats' in obj &&
    typeof obj['freeSeats'] === 'number'
  );
};

const isTrainCarriages = (data: unknown): data is TrainCarriages =>
  typeof data === 'object' && data !== null && Object.values(data).every(isCarriage);

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
