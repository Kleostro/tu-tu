export interface TrainCarriage {
  carriageTypeCode: string;
  carriageName: string;
  carriageOrder: number;
  firstSeat: number;
  lastSeat: number;
  totalSeats: number;
  occupiedSeats: number[];
  freeSeats: number;
}
