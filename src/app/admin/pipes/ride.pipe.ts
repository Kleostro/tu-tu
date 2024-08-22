import { Pipe, PipeTransform } from '@angular/core';

import { OmitedSegment } from '@/app/api/models/schedule';
import { Station } from '@/app/api/models/stations';

interface Ride {
  station: Station | null;
  path: { from: string | null; to: string | null };
  price:
    | {
        type: string;
        price: number;
      }[]
    | null;
}

@Pipe({
  name: 'ride',
  standalone: true,
})
export class RidePipe implements PipeTransform {
  public transform(stations: (Station | null)[], segments: OmitedSegment[]): Ride[] {
    const rides: Ride[] = [];
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
  }
}
