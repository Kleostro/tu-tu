import { Station } from '@/app/api/models/stations';

import { CustomSchedule, OmitedSegment } from '../../api/models/schedule';
import FullRide from '../models/ride.model';

export const collectAllRideData = (stations: (Station | null)[], segments: OmitedSegment[]): FullRide[] => {
  const rides: FullRide[] = [];
  stations.forEach((station, index) => {
    if (index === 0) {
      rides.push({
        station,
        path: { from: segments[index].time[0], to: null },
        price: Object.keys(segments[index].price).map((key) => ({ type: key, price: segments[index].price[key] })),
      });
    } else if (index === stations.length - 1) {
      rides.push({
        station,
        path: { from: null, to: segments[index - 1].time[1] },
        price: null,
      });
    } else {
      rides.push({
        station,
        path: {
          from: segments[index].time[0],
          to: segments[index - 1].time[1],
        },
        price: Object.keys(segments[index].price).map((key) => ({ type: key, price: segments[index].price[key] })),
      });
    }
  });

  return rides;
};

export const exrtactRideData = (
  currentRide: CustomSchedule,
  event: { from: string | null; to: string | null },
  index: number,
): CustomSchedule => {
  const updatedData: CustomSchedule = { rideId: currentRide.rideId ?? 0, segments: currentRide.segments ?? [] };
  if (index === 0) {
    const updatedFromTime = event.from ? event.from : currentRide.segments[index].time[0];
    updatedData.segments[0].time[0] = new Date(updatedFromTime).toISOString();
  } else if (index === currentRide.segments.length) {
    const updatedToTime = event.to ? event.to : currentRide.segments[index].time[0];
    updatedData.segments[index - 1].time[1] = new Date(updatedToTime).toISOString();
  } else {
    const updatedFromTime = event.from ? event.from : currentRide.segments[index - 1].time[1];
    const updatedToTime = event.to ? event.to : currentRide.segments[index].time[0];
    updatedData.segments[index].time[0] = new Date(updatedFromTime).toISOString();
    updatedData.segments[index - 1].time[1] = new Date(updatedToTime).toISOString();
  }

  return updatedData;
};
