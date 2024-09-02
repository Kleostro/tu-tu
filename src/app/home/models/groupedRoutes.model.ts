import { Schedule } from '@/app/api/models/search';

export interface TripPoints {
  from: string;
  to: string;
  date: string;
}

export type OrderTripPoints = Omit<TripPoints, 'date'>;

export interface GroupedRoute {
  routeId: number;
  path: number[];
  carriages: string[];
  schedule: Schedule[];
}

export interface GroupedRoutes {
  [departureDate: string]: GroupedRoute[];
}

export interface TripIds {
  from: number;
  to: number;
}
