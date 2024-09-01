import { Station } from '@/app/api/models/stations';

export interface TripData {
  startCity: Station;
  endCity: Station;
  tripDate: Date;
}
