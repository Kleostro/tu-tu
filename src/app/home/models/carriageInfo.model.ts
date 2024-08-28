export interface CarriageInfo {
  type: string;
  freeSeats: number;
  price: number;
  seats: { seatNumber: number; occupied: boolean }[];
}
