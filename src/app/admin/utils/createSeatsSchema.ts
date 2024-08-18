import { Carriage } from '@/app/api/models/carriage';

import chunkArray from './chunkArray';

const createSeatsSchema = (
  carriage: Carriage,
): {
  leftSeats: number[][];
  rightSeats: number[][];
} => {
  const leftSeats: number[] = [];
  const rightSeats: number[] = [];
  let seatNumber = 1;

  for (let row = 0; row < carriage.rows; row += 1) {
    for (let i = 0; i < carriage.leftSeats; i += 1) {
      leftSeats.push(seatNumber);
      seatNumber += 1;
    }
    for (let i = 0; i < carriage.rightSeats; i += 1) {
      rightSeats.push(seatNumber);
      seatNumber += 1;
    }
  }

  return {
    leftSeats: chunkArray(leftSeats, carriage.leftSeats),
    rightSeats: chunkArray(rightSeats, carriage.rightSeats),
  };
};

export default createSeatsSchema;
