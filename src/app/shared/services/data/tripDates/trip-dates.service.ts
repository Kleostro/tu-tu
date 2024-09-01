import { Injectable } from '@angular/core';

import { Schedule } from '@/app/api/models/search';
import { RouteDates } from '@/app/shared/models/routeDates.model';
import { TripDates } from '@/app/shared/models/tripDates.model';
import { TripIndices } from '@/app/shared/models/tripIndices.model';

@Injectable({
  providedIn: 'root',
})
export class TripDatesService {
  public getTripDates(schedule: Schedule, indices: TripIndices): TripDates {
    return {
      departure: schedule.segments[indices.start].time[0],
      arrival: schedule.segments[indices.end - 1].time[1],
    };
  }

  public getArrivalAndDepartureDates(index: number, pathsLength: number, schedule: Schedule): RouteDates {
    let arrivalDate = '';
    let departureDate = '';

    if (index === 0) {
      [departureDate] = schedule.segments[index].time;
    } else if (index === pathsLength - 1) {
      [, arrivalDate] = schedule.segments[index - 1].time;
    } else if (index > 0 && index < pathsLength - 1) {
      [, arrivalDate] = schedule.segments[index - 1].time;
      [departureDate] = schedule.segments[index].time;
    }

    return { arrivalDate, departureDate };
  }
}
