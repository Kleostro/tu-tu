import { OrderSchedule } from './search';

export interface RideInfo {
  routeId: number;
  rideId: number;
  path: number[];
  carriages: string[];
  schedule: OrderSchedule;
}
