import { Injectable, signal } from '@angular/core';

// TBD: remove fake data

export interface CarriageInfo {
  type: string;
  freeSeats: number;
  price: string;
}
export interface CurrentRide {
  rideId: string;
  from: string;
  fromId: string;
  toId: string;
  to: string;
  departureDate: string;
  arrivalDate: string;
  city: string;
  carriageInfo: CarriageInfo[];
}

const currentRide1: CurrentRide = {
  rideId: '1',
  from: 'New York',
  fromId: '111',
  toId: '42',
  to: 'London',
  departureDate: '2023-10-01T08:14:00',
  arrivalDate: '2023-10-01T18:51:00',
  city: 'New York',
  carriageInfo: [
    { type: '1st class', freeSeats: 123, price: '$785' },
    { type: 'family', freeSeats: 75, price: '$300' },
    { type: 'women only', freeSeats: 50, price: '$437' },
    { type: 'disabled', freeSeats: 2, price: '$56' },
  ],
};

const currentRide2: CurrentRide = {
  rideId: '2',
  from: 'Los Angeles',
  fromId: '222',
  toId: '84',
  to: 'Tokyo',
  departureDate: '2023-10-05T12:00:00',
  arrivalDate: '2023-10-06T08:30:00',
  city: 'Los Angeles',
  carriageInfo: [
    { type: '2nd class', freeSeats: 150, price: '$500' },
    { type: 'family', freeSeats: 75, price: '$300' },
    { type: 'luxury', freeSeats: 10, price: '$1000' },
  ],
};

const currentRide3: CurrentRide = {
  rideId: '3',
  from: 'San Francisco',
  fromId: '333',
  toId: '126',
  to: 'Paris',
  departureDate: '2023-10-10T09:45:00',
  arrivalDate: '2023-10-11T11:20:00',
  city: 'San Francisco',
  carriageInfo: [
    { type: '2nd class', freeSeats: 150, price: '$500' },
    { type: '3rd class', freeSeats: 200, price: '$400' },
    { type: 'business', freeSeats: 80, price: '$600' },
    { type: 'economy', freeSeats: 50, price: '$200' },
    { type: 'luxury', freeSeats: 10, price: '$1000' },
  ],
};

const currentRide4: CurrentRide = {
  rideId: '4',
  from: 'Chicago',
  fromId: '444',
  toId: '168',
  to: 'Berlin',
  departureDate: '2023-10-15T07:30:00',
  arrivalDate: '2023-10-15T19:45:00',
  city: 'Chicago',
  carriageInfo: [
    { type: '1st class', freeSeats: 100, price: '$700' },
    { type: '2nd class', freeSeats: 150, price: '$450' },
    { type: 'family', freeSeats: 80, price: '$350' },
  ],
};

const currentRide5: CurrentRide = {
  rideId: '5',
  from: 'Miami',
  fromId: '555',
  toId: '210',
  to: 'Sydney',
  departureDate: '2023-10-20T14:00:00',
  arrivalDate: '2023-10-21T10:00:00',
  city: 'Miami',
  carriageInfo: [
    { type: 'economy', freeSeats: 200, price: '$300' },
    { type: 'business', freeSeats: 50, price: '$700' },
    { type: 'luxury', freeSeats: 20, price: '$1200' },
    { type: 'family', freeSeats: 100, price: '$400' },
  ],
};

const currentData: CurrentRide[] = [currentRide1, currentRide2, currentRide3, currentRide4, currentRide5];
@Injectable({
  providedIn: 'root',
})
export class ResultListService {
  public currentResultList = signal<CurrentRide[]>(currentData);
}
