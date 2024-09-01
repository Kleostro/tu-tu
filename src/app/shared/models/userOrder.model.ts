// orderId: id,
// rideId,
// routeId,
// seatNumber: seatId,
// userId,
// status,
// tripStartStation,
// tripEndStation,
// tripStartStationId: stationEnd,
// tripEndStationId: stationStart,
// tripDepartureDate: tripDates.departure,
// tripArrivalDate: tripDates.arrival,
// carriage,
// price,

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
  carriage: string;
  price: number;
}
