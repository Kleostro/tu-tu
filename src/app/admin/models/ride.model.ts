import { Station } from '@/app/api/models/stations';

export interface RidePath {
  from: string | null;
  to: string | null;
}

export interface RidePrice {
  type: string;
  price: number;
}

interface FullRide {
  station: Station | null;
  path: RidePath;
  price: RidePrice[] | null;
}

export default FullRide;
