import { CarriageInfo } from './carriageInfo.model';
import { StationInfo } from './stationInfo.model';

export interface CurrentRide {
  rideId: number;
  routeId: number;

  routeStartStation: string;
  routeEndStation: string;

  tripStartStation: string;
  tripEndStation: string;

  routeStartStationId: number;
  routeEndStationId: number;

  tripStartStationId: number;
  tripEndStationId: number;

  tripDepartureDate: string;
  tripArrivalDate: string;
  carriageInfo: CarriageInfo[];
  stationsInfo: StationInfo[];
}
