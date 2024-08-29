export interface TrainCarriage {
  carriageType: string;
  firstSeat: number;
  lastSeat: number;
  totalSeats: number;
  occupiedSeats: number[];
  freeSeats: number;
}
