import { Segment } from '@/app/api/models/search';

export interface TripPoints {
  from: string;
  to: string;
}

interface GroupedRoute {
  routeId: number;
  segment: Segment;
  rideId: number;
  path: number[];
  carriages: string[];
}

export interface GroupedRoutes {
  [departureDate: string]: GroupedRoute[];
}
