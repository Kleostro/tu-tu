import { Station } from '@/app/api/models/stations';

export interface RidePath {
  from: string | null;
  to: string | null;
}

interface FullRide {
  station: Station | null;
  path: RidePath;
  price:
    | {
        type: string;
        price: number;
      }[]
    | null;
}

export default FullRide;
