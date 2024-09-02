import { TrainCarriage } from '@/app/shared/models/trainCarriage.model';

export const isCarriage = (item: unknown): item is TrainCarriage => {
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
