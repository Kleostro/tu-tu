import { inject, Injectable, signal } from '@angular/core';

import { RouteInfo } from '@/app/api/models/schedule';
import { Schedule } from '@/app/api/models/search';
import { StationsService } from '@/app/api/stationsService/stations.service';
import { calculateDuration } from '@/app/shared/utils/calculateDuration';

import { CarriageInfo } from '../../models/carriageInfo.model';
import { CurrentRide } from '../../models/currentRide.model';
import { GroupedRoute, TripPoints } from '../../models/groupedRoutes';
import { StationInfo } from '../../models/stationInfo.model';
import { PLACEHOLDER } from './constants/constants';

@Injectable({
  providedIn: 'root',
})
export class ResultListService {
  private stationsService = inject(StationsService);

  public currentRides: CurrentRide[] = [];

  public currentResultList$$ = signal<CurrentRide[]>([]);
  public routesInfo$$ = signal<Record<string, RouteInfo> | null>(null);

  public createCurrentRides(date: Date, data: GroupedRoute[], tripPoints: TripPoints): void {
    this.currentRides = [];
    this.currentResultList$$.set([]);

    if (data === undefined) {
      this.currentResultList$$.set([]);
      return;
    }

    data.forEach((routeInfo) => {
      const startOfNextDay = new Date(date);
      startOfNextDay.setDate(startOfNextDay.getDate() + 1);
      startOfNextDay.setHours(0, 0, 0, 0);

      const rides: CurrentRide[] = routeInfo.schedule
        .map((schedule) => this.createCurrentRide(routeInfo, schedule, tripPoints))
        .filter((ride): ride is CurrentRide => {
          const rideDate = new Date(ride.tripDepartureDate);
          return rideDate > date && rideDate < startOfNextDay;
        })
        .filter((ride) => !this.currentRides.some((existingRide) => existingRide.rideId === ride.rideId));

      this.currentRides = [...this.currentRides, ...rides];

      const updatedResultList = [...this.currentResultList$$(), ...rides];
      updatedResultList.sort(
        (a, b) => new Date(a.tripDepartureDate).getTime() - new Date(b.tripDepartureDate).getTime(),
      );

      this.currentResultList$$.set(updatedResultList);
    });
  }

  // eslint-disable-next-line max-lines-per-function
  private createCurrentRide(routeInfo: GroupedRoute, schedule: Schedule, tripPoints: TripPoints): CurrentRide {
    const { routeId } = routeInfo;
    const { rideId } = schedule;

    const routeStartStation = this.stationsService.findStationById(routeInfo.path[0])?.city ?? PLACEHOLDER.CITY;
    const routeEndStation =
      this.stationsService.findStationById(routeInfo.path[routeInfo.path.length - 1])?.city ?? PLACEHOLDER.CITY;

    const tripStartStation = tripPoints.from;
    const tripEndStation = tripPoints.to;

    const tripStartStationId = this.stationsService.findStationByCity(tripStartStation)!.id;
    const tripEndStationId = this.stationsService.findStationByCity(tripEndStation)!.id;

    const routeStartStationId = routeInfo.path[0];
    const routeEndStationId = routeInfo.path[routeInfo.path.length - 1];

    const tripStartStationIdIndex = routeInfo.path.indexOf(tripStartStationId);
    const tripEndStationIdIndex = routeInfo.path.indexOf(tripEndStationId);

    const tripDepartureDate = schedule.segments[tripStartStationIdIndex].time[0];
    const tripArrivalDate = schedule.segments[tripEndStationIdIndex - 1].time[1];

    const aggregatedPriceMap = this.aggregatePrices(schedule.segments, tripStartStationIdIndex, tripEndStationIdIndex);
    const carriageInfo = this.createCarriageInfo(routeInfo.carriages, aggregatedPriceMap);

    const stationsInfo = this.createStationsInfo(
      routeInfo.path,
      schedule,
      tripStartStationIdIndex,
      tripEndStationIdIndex,
    );

    return {
      rideId, // correct
      routeId, // correct

      routeStartStation, // correct
      routeEndStation, // correct

      tripStartStation, // correct
      tripEndStation, // correct

      routeStartStationId, // correct
      routeEndStationId, // correct

      tripStartStationId, // correct
      tripEndStationId, // correct

      tripDepartureDate, // correct
      tripArrivalDate, // correct

      carriageInfo, // For the current schedule
      stationsInfo, // correct
    };
  }

  private aggregatePrices(
    segments: { price: { [key: string]: number } }[],
    startIndex: number,
    endIndex: number,
  ): { [key: string]: number } {
    const priceMap: { [key: string]: number } = {};

    segments.slice(startIndex, endIndex + 1).forEach((segment) => {
      Object.keys(segment.price).forEach((carriage) => {
        if (priceMap[carriage]) {
          priceMap[carriage] += segment.price[carriage];
        } else {
          priceMap[carriage] = segment.price[carriage];
        }
      });
    });

    return priceMap;
  }

  private getArrivalAndDepartureDates(
    index: number,
    pathsLength: number,
    schedule: Schedule,
  ): { arrivalDate: string; departureDate: string } {
    let arrivalDate = '';
    let departureDate = '';

    if (index === 0) {
      arrivalDate = '';
      [departureDate] = schedule.segments[index].time;
    } else if (index === pathsLength - 1) {
      [, arrivalDate] = schedule.segments[index - 1].time;
      departureDate = '';
    } else if (index > 0 && index < pathsLength - 1) {
      [, arrivalDate] = schedule.segments[index - 1].time;
      [departureDate] = schedule.segments[index].time;
    }

    return { arrivalDate, departureDate };
  }

  private createStationsInfo(paths: number[], schedule: Schedule, start: number, end: number): StationInfo[] {
    const pathsLength = paths.length;
    const stations = this.stationsService.allStations();
    const stationMap = new Map<number, string>();

    stations.forEach((station) => {
      stationMap.set(station.id, station.city);
    });

    const stationsInfo = paths.map((stationId, index) => {
      const stationName = stationMap.get(stationId) ?? PLACEHOLDER.STATION;
      const { arrivalDate, departureDate } = this.getArrivalAndDepartureDates(index, pathsLength, schedule);

      return {
        stationId,
        stationName,
        arrivalDate,
        departureDate,
        stopDuration: calculateDuration(arrivalDate, departureDate),
        firstStation: index === 0,
        lastStation: index === pathsLength - 1,
        firstUserStation: index === start,
        lastUserStation: index === end,
        userStation: index >= start && index <= end,
      };
    });

    return stationsInfo;
  }

  private createCarriageInfo(carriages: string[], priceMap: { [key: string]: number }): CarriageInfo[] {
    const uniqueCarriages = Array.from(new Set(carriages));
    return uniqueCarriages.map((carriage) => ({
      type: carriage,
      freeSeats: 0,
      price: priceMap[carriage] ?? 0,
    }));
  }
}