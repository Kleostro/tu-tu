interface Price {
  [key: string]: number;
}

interface Segment {
  time: string[];
  price: Price;
  occupiedSeats: number[];
}

interface Schedule {
  rideId: number;
  segments: Segment[];
  time: string[];
  occupiedSeats: number[];
}

interface Route {
  id: number;
  path: number[];
  carriages: string[];
  schedule: Schedule[];
  price: Price;
}

export interface SearchParams {
  fromLatitude: number;
  fromLongitude: number;
  toLatitude: number;
  toLongitude: number;
  time?: number;
}

export interface SearchResponse {
  from: {
    stationId: number;
    city: string;
    geolocation: {
      latitude: number;
      longitude: number;
    };
  };
  to: {
    stationId: number;
    city: string;
    geolocation: {
      latitude: number;
      longitude: number;
    };
  };
  routes: Route[];
}