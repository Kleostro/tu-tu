import { TrainCarriage } from '@/app/shared/models/trainCarriage.model';

export interface UserOrder {
  orderId: number;
  rideId: number;
  routeId: number;
  seatNumber: number;
  userId: number;
  status: string;
  tripStartStation: string;
  tripEndStation: string;
  tripStartStationId: number;
  tripEndStationId: number;
  tripDepartureDate: string;
  tripArrivalDate: string;
  carriage: TrainCarriage | null;
  price: number;
}
