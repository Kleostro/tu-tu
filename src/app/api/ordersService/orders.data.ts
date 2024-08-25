import { Order } from '@/app/api/models/order';

export const ordersDummyData: Order[] = [
  {
    id: 64,
    rideId: 45,
    routeId: 18,
    seatId: 33,
    userId: 3,
    status: 'active',
    path: [33, 5, 62, 11, 48, 34],
    carriages: [
      'carriage_type_2',
      'carriage_type_2',
      'carriage_type_2',
      'carriage_type_2',
      'carriage_type_7',
      'carriage_type_7',
      'carriage_type_7',
      'carriage_type_7',
    ],
    schedule: {
      segments: [
        {
          time: ['2021-08-10T08:00:00', '2021-08-10T08:30:00'],
          price: {
            adult: 1000,
            child: 500,
            student: 700,
          },
          occupiedSeats: [32],
        },
        {
          time: ['2021-08-10T08:30:00', '2021-08-10T09:00:00'],
          price: {
            adult: 1000,
            child: 500,
            student: 700,
          },
          occupiedSeats: [32],
        },
      ],
    },
  },
  {
    id: 65,
    rideId: 46,
    routeId: 19,
    seatId: 34,
    userId: 3,
    status: 'active',
    path: [33, 5, 62, 11, 48, 34],
    carriages: [
      'carriage_type_2',
      'carriage_type_2',
      'carriage_type_2',
      'carriage_type_2',
      'carriage_type_7',
      'carriage_type_7',
      'carriage_type_7',
      'carriage_type_7',
    ],
    schedule: {
      segments: [
        {
          time: ['2021-09-11T07:00:00', '2021-09-11T08:30:00'],
          price: {
            adult: 1000,
            child: 500,
            student: 700,
          },
          occupiedSeats: [33],
        },
        {
          time: ['2021-09-11T08:30:00', '2021-09-11T10:00:00'],
          price: {
            adult: 1000,
            child: 500,
            student: 700,
          },
          occupiedSeats: [33],
        },
      ],
    },
  },
];
