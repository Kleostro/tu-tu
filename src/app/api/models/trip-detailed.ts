interface Price {
  [key: string]: number;
}

interface Segment {
  time: string[];
  price: Price;
  occupiedSeats: number[];
}

export interface RideInfo {
  rideId: number;
  path: number[];
  carriages: string[];
  schedule: {
    segments: Segment[];
  };
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
