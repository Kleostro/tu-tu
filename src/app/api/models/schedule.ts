import { Route, Schedule, Segment } from './search';

type PickedRoute = Pick<Route, 'carriages' | 'id' | 'path'>;

type OmitedSegment = Omit<Segment, 'occupiedSeats'>;

type CustomSchedule = Pick<Schedule, 'rideId'> & { segments: OmitedSegment[] };

export interface RouteInfo extends PickedRoute {
  schedule: CustomSchedule[];
}

export interface RideBody {
  segments: OmitedSegment[];
}
