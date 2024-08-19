import { Profile } from './profile';
import { Segment } from './search';

type OrderStatus = 'active' | 'completed' | 'rejected' | 'canceled';

export interface Order {
  id: number;
  rideId: number;
  routeId: number;
  seatId: number;
  userId: number;
  status: OrderStatus;
  path: number[];
  carriages: string[];
  schedule: {
    segments: Segment[];
  };
  stationStart: number;
  stationEnd: number;
}

export interface User extends Profile {
  id: number;
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
