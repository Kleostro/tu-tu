import { inject, Injectable, signal } from '@angular/core';

import { CarriageService } from '@/app/api/carriagesService/carriage.service';
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
  private carriagesService = inject(CarriageService);

  public currentResultList$$ = signal<CurrentRide[]>([]);
  public routesInfo$$ = signal<Record<string, RouteInfo> | null>(null);

  public createCurrentRides(data: GroupedRoute[], tripPoints: TripPoints): void {
    if (data === undefined) {
      this.currentResultList$$.set([]);
      return;
    }

    let currentRides: CurrentRide[] = [];

    data.forEach((routeInfo) => {
      const rides = routeInfo.schedule.map((schedule) => this.createCurrentRide(routeInfo, schedule, tripPoints));
      currentRides = [...currentRides, ...rides];
    });

    this.updateResultList(currentRides);
  }

  private updateResultList(currentRides: CurrentRide[]): void {
    const updatedResultList = [...currentRides];
    updatedResultList.sort((a, b) => new Date(a.tripDepartureDate).getTime() - new Date(b.tripDepartureDate).getTime());
    this.currentResultList$$.set(updatedResultList);
  }

  private createCurrentRide(routeInfo: GroupedRoute, schedule: Schedule, tripPoints: TripPoints): CurrentRide {
    const routeStations = this.getRouteStations(routeInfo.path);
    const tripStations = this.getTripStations(tripPoints);
    const tripStationIds = this.getTripStationIds(tripStations);
    const routeStationIds = this.getRouteStationIds(routeInfo.path);
    const tripStationIndices = this.getTripStationIndices(routeInfo.path, tripStationIds);
    const tripDates = this.getTripDates(schedule, tripStationIndices);
    const aggregatedPriceMap = this.aggregatePrices(schedule.segments, tripStationIndices);
    const occupiedSeats = this.calculateOccupiedSeats(routeInfo.carriages, schedule.segments, tripStationIndices);
    const carriageInfo = this.createCarriageInfo(routeInfo.carriages, occupiedSeats, aggregatedPriceMap);
    const stationsInfo = this.createStationsInfo(routeInfo.path, schedule, tripStationIndices);

    return {
      rideId: schedule.rideId,
      routeId: routeInfo.routeId,
      routeStartStation: routeStations.start,
      routeEndStation: routeStations.end,
      tripStartStation: tripStations.start,
      tripEndStation: tripStations.end,
      routeStartStationId: routeStationIds.start,
      routeEndStationId: routeStationIds.end,
      tripStartStationId: tripStationIds.start,
      tripEndStationId: tripStationIds.end,
      tripDepartureDate: tripDates.departure,
      tripArrivalDate: tripDates.arrival,
      carriageInfo,
      stationsInfo,
    };
  }

  private getRouteStations(path: number[]): { start: string; end: string } {
    return {
      start: this.getStationCityById(path[0]),
      end: this.getStationCityById(path[path.length - 1]),
    };
  }

  private getTripStations(tripPoints: TripPoints): { start: string; end: string } {
    return {
      start: tripPoints.from,
      end: tripPoints.to,
    };
  }

  private getTripStationIds(tripStations: { start: string; end: string }): { start: number; end: number } {
    return {
      start: this.getStationIdByCity(tripStations.start),
      end: this.getStationIdByCity(tripStations.end),
    };
  }

  private getRouteStationIds(path: number[]): { start: number; end: number } {
    return {
      start: path[0],
      end: path[path.length - 1],
    };
  }

  private getTripStationIndices(
    path: number[],
    tripStationIds: { start: number; end: number },
  ): { start: number; end: number } {
    return {
      start: path.indexOf(tripStationIds.start),
      end: path.indexOf(tripStationIds.end),
    };
  }

  private getTripDates(
    schedule: Schedule,
    indices: { start: number; end: number },
  ): { departure: string; arrival: string } {
    return {
      departure: schedule.segments[indices.start].time[0],
      arrival: schedule.segments[indices.end - 1].time[1],
    };
  }

  private getStationCityById(stationId: number): string {
    return this.stationsService.findStationById(stationId)?.city ?? PLACEHOLDER.CITY;
  }

  private getStationIdByCity(city: string): number {
    return this.stationsService.findStationByCity(city)!.id;
  }

  private aggregatePrices(
    segments: { price: { [key: string]: number } }[],
    indices: { start: number; end: number },
  ): { [key: string]: number } {
    const priceMap: { [key: string]: number } = {};
    segments.slice(indices.start, indices.end).forEach((segment) => {
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
      [departureDate] = schedule.segments[index].time;
    } else if (index === pathsLength - 1) {
      [, arrivalDate] = schedule.segments[index - 1].time;
    } else if (index > 0 && index < pathsLength - 1) {
      [, arrivalDate] = schedule.segments[index - 1].time;
      [departureDate] = schedule.segments[index].time;
    }

    return { arrivalDate, departureDate };
  }

  private createStationsInfo(
    paths: number[],
    schedule: Schedule,
    indices: { start: number; end: number },
  ): StationInfo[] {
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
        firstUserStation: index === indices.start,
        lastUserStation: index === indices.end,
        userStation: index >= indices.start && index <= indices.end,
      };
    });

    return stationsInfo;
  }

  private createCarriageInfo(
    carriages: string[],
    occupiedSeats: { [key: string]: number[] },
    priceMap: { [key: string]: number },
  ): CarriageInfo[] {
    const carriageCountMap = this.countCarriages(carriages, occupiedSeats);
    const freeSeatsMap = this.calculateFreeSeats(carriageCountMap);

    return this.generateCarriageInfo(carriageCountMap, freeSeatsMap, priceMap);
  }

  private countCarriages(
    carriages: string[],
    occupiedSeats: { [key: string]: number[] },
  ): { [key: string]: { count: number; occupiedSeats: number[] } } {
    const carriageCountMap: { [key: string]: { count: number; occupiedSeats: number[] } } = {};
    carriages.forEach((carriage) => {
      if (!carriageCountMap[carriage]) {
        carriageCountMap[carriage] = { count: 0, occupiedSeats: [] };
      }
      carriageCountMap[carriage].count += 1;
      carriageCountMap[carriage].occupiedSeats = [
        ...carriageCountMap[carriage].occupiedSeats,
        ...occupiedSeats[carriage],
      ];
    });
    return carriageCountMap;
  }

  private calculateFreeSeats(carriageCountMap: { [key: string]: { count: number; occupiedSeats: number[] } }): {
    [key: string]: number;
  } {
    const allCarriages = this.carriagesService.allCarriages();
    const freeSeatsMap: { [key: string]: number } = {};

    allCarriages.forEach((carriage) => {
      const { code, leftSeats, rightSeats, rows } = carriage;
      const totalSeatsPerCarriage = rows * (leftSeats + rightSeats);
      if (carriageCountMap[code]) {
        const occupiedSeats = carriageCountMap[code].occupiedSeats.length;
        freeSeatsMap[code] = totalSeatsPerCarriage * carriageCountMap[code].count - occupiedSeats;
      }
    });

    return freeSeatsMap;
  }

  private calculateOccupiedSeats(
    carriages: string[],
    segments: { occupiedSeats: number[] }[],
    tripStationIndices: { start: number; end: number },
  ): { [key: string]: number[] } {
    const occupiedSeats: { [key: string]: number[] } = {};

    carriages.forEach((carriage) => {
      occupiedSeats[carriage] = [];
    });

    segments.slice(tripStationIndices.start, tripStationIndices.end).forEach((segment) => {
      segment.occupiedSeats.forEach((seat) => {
        const carriageIndex = Math.floor(seat / carriages.length);
        const seatNumber = seat % carriages.length;
        const carriage = carriages[carriageIndex];
        if (carriage) {
          occupiedSeats[carriage].push(seatNumber);
        }
      });
    });
    return occupiedSeats;
  }

  private generateCarriageInfo(
    carriageCountMap: { [key: string]: { count: number; occupiedSeats: number[] } },
    freeSeatsMap: { [key: string]: number },
    priceMap: { [key: string]: number },
  ): CarriageInfo[] {
    return Object.keys(carriageCountMap).map((carriage) => ({
      type: carriage,
      freeSeats: freeSeatsMap[carriage] ?? 0,
      price: priceMap[carriage] ?? 0,
      seats: carriageCountMap[carriage].occupiedSeats.map((seatNumber) => ({
        seatNumber,
        occupied: true,
      })),
    }));
  }
}
