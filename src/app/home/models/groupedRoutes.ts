import { Schedule, Segment } from '@/app/api/models/search';


export interface TripPoints {
  from: string;
  to: string;
}

interface GroupedRoute {
  routeId: number;
  path: number[];
  carriages: string[];
  schedule: Schedule[];
  segments: Segment[];
  rideId: number;
}

export interface GroupedRoutes {
  [departureDate: string]: GroupedRoute[];
}

export type City = {
  name: string;
  country: string;
  lat: number;
  lng: number;
};
