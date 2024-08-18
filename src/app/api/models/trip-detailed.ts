import { Segment } from './search';

export interface RideInfo {
  rideId: number;
  path: number[];
  carriages: string[];
  schedule: {
    segments: Segment[];
  };
}

export interface OrderRequest {
  rideId: number;
  seat: number;
  stationStart: number;
  stationEnd: number;
}

export interface OrderId {
  id: string;
}
