import { inject, Injectable } from '@angular/core';

import { OrderSchedule, Schedule } from '@/app/api/models/search';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { OrderTripPoints, TripPoints } from '@/app/home/models/groupedRoutes.model';
import { StationInfo } from '@/app/shared/models/stationInfo.model';
import { TripIds } from '@/app/shared/models/tripIds.model';
import { TripIndices } from '@/app/shared/models/tripIndices.model';
import { TripStations } from '@/app/shared/models/tripStations.model';
import { calculateDuration } from '@/app/shared/utils/calculateDuration';

import { PLACEHOLDER } from '../constants/constants';
import { TripDatesService } from '../tripDates/trip-dates.service';

@Injectable({
  providedIn: 'root',
})
export class TripStationsService {
  private stationsService = inject(StationsService);
  private tripDatesService = inject(TripDatesService);

  public getRouteStations(path: number[]): TripStations {
    return {
      start: this.getStationCityById(path[0]),
      end: this.getStationCityById(path[path.length - 1]),
    };
  }

  public getTripStations(tripPoints: TripPoints | OrderTripPoints): TripStations {
    return {
      start: tripPoints.from,
      end: tripPoints.to,
    };
  }

  public getTripStationIds(tripStations: TripStations): TripIds {
    return {
      start: this.getStationIdByCity(tripStations.start),
      end: this.getStationIdByCity(tripStations.end),
    };
  }

  public getRouteStationIds(path: number[]): TripIds {
    return {
      start: path[0],
      end: path[path.length - 1],
    };
  }

  public getTripStationIndices(path: number[], tripStationStartId: number, tripStationEndId: number): TripIndices {
    return {
      start: path.indexOf(tripStationStartId),
      end: path.indexOf(tripStationEndId),
    };
  }

  public createStationsInfo(paths: number[], schedule: Schedule | OrderSchedule, indices: TripIndices): StationInfo[] {
    const pathsLength = paths.length;
    const stations = this.stationsService.allStations();
    const stationMap = new Map<number, string>();

    stations.forEach((station) => {
      stationMap.set(station.id, station.city);
    });

    const stationsInfo = paths.map((stationId, index) => {
      const stationName = stationMap.get(stationId) ?? PLACEHOLDER.STATION;
      const { arrivalDate, departureDate } = this.tripDatesService.getArrivalAndDepartureDates(
        index,
        pathsLength,
        schedule,
      );

      return {
        stationId,
        stationName,
        arrivalDate,
        departureDate,
        stopDuration: calculateDuration(arrivalDate, departureDate),
        firstStation: index === 0,
        lastStation: index === pathsLength - 1,
        firstUserStation: index === indices.start,
        lastUserStation: index === indices.end,
        userStation: index >= indices.start && index <= indices.end,
      };
    });

    return stationsInfo;
  }

  public getStationCityById(stationId: number): string {
    this.stationsService.getStations();
    return this.stationsService.findStationById(stationId)?.city ?? PLACEHOLDER.CITY;
  }

  private getStationIdByCity(city: string): number {
    return this.stationsService.findStationByCity(city)!.id;
  }
}
