import { Segment } from './search';

export interface RideInfo {
  rideId: number;
  path: number[];
  carriages: string[];
  schedule: {
    segments: Segment[];
  };
}
